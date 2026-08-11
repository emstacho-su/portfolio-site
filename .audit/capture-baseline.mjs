// Phase 0 baseline capture (brief §5.5, §10.2–10.5).
// Usage: node .audit/capture-baseline.mjs [outDir]
// Requires the dev server on http://localhost:3000.
//
// Captures full-page desktop 1440x900 + mobile 390x844, three desktop
// header-legibility shots (scroll 0 / 400 / mid-project-panel), and a
// JS-disabled hero shot. Also reports whether General Sans actually loads
// (Fontshare request observed + document.fonts.check) since that is the
// central Phase 2 finding to verify.

import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://localhost:3000';
const OUT = process.argv[2] ?? join('.audit', 'baseline');
mkdirSync(OUT, { recursive: true });

// Seed the session keys so the boot loader and hero compile sequence render
// their final state instead of mid-animation frames (deterministic captures).
const SKIP_ANIMATIONS = () => {
  sessionStorage.setItem('es-hero-loader-played-v1', '1');
  sessionStorage.setItem('es-compile-played-v1', '1');
};

async function settleAndReveal(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  // Scroll through the page to fire the once:true IntersectionObserver
  // reveals, then return to top.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

const browser = await chromium.launch();
const report = {};

for (const [name, viewport] of [
  ['desktop-1440x900', { width: 1440, height: 900 }],
  ['mobile-390x844', { width: 390, height: 844 }],
]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.addInitScript(SKIP_ANIMATIONS);

  let fontshareRequested = false;
  page.on('request', (r) => {
    if (r.url().includes('fontshare')) fontshareRequested = true;
  });

  await page.goto(BASE);
  await settleAndReveal(page);

  const generalSansLoaded = await page.evaluate(() =>
    document.fonts.check('600 16px "General Sans"')
  );
  const h1Font = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? getComputedStyle(h1).fontFamily : null;
  });
  report[name] = { fontshareRequested, generalSansLoaded, h1Font };

  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });

  if (name.startsWith('desktop')) {
    // Header legibility at fixed scroll offsets (§9.6 / §10.3).
    for (const [label, y] of [
      ['scroll-0', 0],
      ['scroll-400', 400],
    ]) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(OUT, `header-${label}.png`) });
    }
    // Mid-project-panel: scroll the first project panel to viewport center.
    await page.evaluate(() => {
      const panel = document.querySelector('#projects section');
      panel?.scrollIntoView({ block: 'center', behavior: 'auto' });
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: join(OUT, 'header-mid-panel.png') });
  }

  await context.close();
}

// JS disabled: does the hero ship any text? (§9.1 / §10.5)
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  report.noJs = {
    heroText: await page.evaluate(
      () => document.querySelector('#hero')?.textContent?.trim() ?? null
    ),
    bodyTextLength: await page.evaluate(
      () => document.body.innerText.trim().length
    ),
  };
  await page.screenshot({ path: join(OUT, 'nojs-desktop.png') });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
