// Programmatic WCAG contrast gate (brief §10.4). Parses the design tokens out
// of src/app/globals.css and asserts every text-on-background pair meets AA
// normal-text 4.5:1. Exits 1 on any failure so CI/loops can gate on it.

import { readFileSync } from 'node:fs';

const css = readFileSync('src/app/globals.css', 'utf8');
const token = (name) => {
  const m = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token ${name} not found or not a hex color`);
  return m[1];
};

const luminance = (hex) => {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const ratio = (fg, bg) => {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
};

const backgrounds = { 'bg-base': token('--bg-base'), 'bg-surface': token('--bg-surface') };
const foregrounds = {
  'text-primary': token('--text-primary'),
  'text-secondary': token('--text-secondary'),
  'text-tertiary': token('--text-tertiary'),
  accent: token('--accent'),
  'accent-hover': token('--accent-hover'),
};

let failures = 0;
for (const [fgName, fg] of Object.entries(foregrounds)) {
  for (const [bgName, bg] of Object.entries(backgrounds)) {
    const r = ratio(fg, bg);
    const pass = r >= 4.5;
    if (!pass) failures++;
    console.log(
      `${pass ? 'PASS' : 'FAIL'} ${fgName} (${fg}) on ${bgName} (${bg}): ${r.toFixed(2)}:1`
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} contrast pair(s) below AA 4.5:1`);
  process.exit(1);
}
console.log('\nAll token pairs meet AA 4.5:1');
