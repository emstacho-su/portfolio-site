// Saves the rendered OG card for visual review (brief §10.6).
import { writeFileSync, mkdirSync } from 'node:fs';

const outDir = process.argv[2] ?? '.audit/phase-1';
mkdirSync(outDir, { recursive: true });
const res = await fetch('http://localhost:3000/opengraph-image');
const buf = Buffer.from(await res.arrayBuffer());
writeFileSync(`${outDir}/og-image.png`, buf);
console.log('saved', `${outDir}/og-image.png`, res.status, buf.length, 'bytes');
