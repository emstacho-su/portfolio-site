// Downloads General Sans woff2 (400/500/600/700) from Fontshare into
// src/fonts/ for next/font/local self-hosting (brief §7.1, approved by Evan).
import { writeFileSync, mkdirSync } from 'node:fs';

const CSS_URL =
  'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

mkdirSync('src/fonts', { recursive: true });

const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text();

// Each @font-face block carries one weight and a woff2 src.
const blocks = css.match(/@font-face\s*{[^}]*}/g) ?? [];
const wanted = new Map(); // weight -> url
for (const block of blocks) {
  const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
  const url = block.match(/url\((['"]?)([^'")]+\.woff2)\1\)/)?.[2];
  const style = block.match(/font-style:\s*(\w+)/)?.[1] ?? 'normal';
  if (weight && url && style === 'normal' && !wanted.has(weight)) {
    wanted.set(weight, url);
  }
}

for (const w of ['400', '500', '600', '700']) {
  let url = wanted.get(w);
  if (url?.startsWith('//')) url = 'https:' + url;
  if (!url) {
    console.log(`MISSING weight ${w} — css had:`, [...wanted.keys()]);
    continue;
  }
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const buf = Buffer.from(await res.arrayBuffer());
  const magic = buf.subarray(0, 4).toString('ascii');
  const out = `src/fonts/GeneralSans-${w}.woff2`;
  writeFileSync(out, buf);
  console.log(out, res.status, buf.length, 'bytes, magic:', magic);
}
