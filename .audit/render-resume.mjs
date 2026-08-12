// Renders .audit/resume-draft.html to .audit/resume-draft.pdf via Chromium
// print-to-PDF. public/resume.pdf is NOT touched; swapping the draft in is a
// separate, explicit step after Evan approves.
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const htmlPath = resolve('.audit/resume-draft.html');
const pdfPath = resolve('.audit/resume-draft.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href);
await page.waitForTimeout(500); // let the woff2 faces load
await page.pdf({
  path: pdfPath,
  format: 'Letter',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await browser.close();

const bytes = readFileSync(pdfPath);
const pages = (bytes.toString('latin1').match(/\/Type[\s]*\/Page[^s]/g) || []).length;
console.log('rendered', pdfPath, bytes.length, 'bytes,', pages, 'page(s)');
