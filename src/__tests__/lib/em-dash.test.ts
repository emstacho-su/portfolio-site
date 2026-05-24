import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * R-20 / D-22: No em dash (U+2014, "—") or en dash (U+2013, "–") in user-facing
 * copy. The sweep covers TWO surfaces:
 *
 *   (a) Every string value exported from src/data/*.ts (imported and walked
 *       recursively), and
 *   (b) The SOURCE TEXT of src/components/sections/*.tsx (read via fs and
 *       scanned for the codepoints) — component string literals are not all
 *       exported, so reading file text is the simplest reliable check. This
 *       catches copy-bearing regressions in section components, at minimum
 *       hero.tsx and harness.tsx. Source comments (line comments and block /
 *       JSX comment wrappers) are STRIPPED before scanning because R-20 governs
 *       user-facing copy, not decorative source comments; only string/JSX-text
 *       content is asserted on.
 *
 * INTENDED RED: src/components/sections/hero.tsx currently contains an em dash
 * in its TAGLINE constant (line ~10). That case is the ACCEPTANCE TARGET for
 * 02-03, which must retarget the TAGLINE to the approved D-08 copy. Until then
 * the "section component source" test below is red BY DESIGN; the failure is an
 * assertion failure (em dash found), not a syntax/import error.
 */

const REPO_ROOT = path.resolve(__dirname, '../../..');
const DATA_DIR = path.join(REPO_ROOT, 'src', 'data');
const SECTIONS_DIR = path.join(REPO_ROOT, 'src', 'components', 'sections');

const EM_DASH = '—';
const DASH_RE = /[—–]/;

function listFiles(dir: string, ext: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => path.join(dir, f));
}

function collectStrings(value: unknown, acc: string[]): void {
  if (typeof value === 'string') {
    acc.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, acc);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectStrings(v, acc);
  }
}

// Strip source comments so the section-component scan asserts only on
// user-facing copy (string literals + JSX text), not decorative source
// comments. Removes both block comments (including JSX comment wrappers) and
// line comments. This is a deliberately simple pass: it does not parse strings
// that contain comment-like sequences, which is acceptable here because no
// section component embeds a comment opener inside a copy string.
function stripComments(source: string): string {
  // Normalize CRLF -> LF first so the per-line comment strip is not defeated by
  // a trailing \r (which `.` does not match), which would leave Windows-checked-
  // out `// ...` comments in the scanned text.
  const normalized = source.replace(/\r\n/g, '\n');
  const withoutBlocks = normalized.replace(/\/\*[\s\S]*?\*\//g, '');
  return withoutBlocks
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n');
}

describe('no em/en dash in src/data/*.ts exports (R-20)', () => {
  const dataFiles = listFiles(DATA_DIR, '.ts').filter((f) => !f.endsWith('.d.ts'));

  it('finds data modules to sweep', () => {
    expect(dataFiles.length).toBeGreaterThan(0);
  });

  for (const file of dataFiles) {
    const rel = path.relative(REPO_ROOT, file).replace(/\\/g, '/');
    it(`has no em/en dash in any string export of ${rel}`, async () => {
      const mod = (await import(/* @vite-ignore */ file)) as Record<string, unknown>;
      const strings: string[] = [];
      collectStrings(mod, strings);
      const offenders = strings.filter((s) => DASH_RE.test(s));
      expect(
        offenders,
        `${rel} exports strings containing U+2014/U+2013: ${JSON.stringify(offenders)}`
      ).toEqual([]);
    });
  }
});

describe('no em/en dash in src/components/sections/*.tsx source text (R-20, D-22)', () => {
  const sectionFiles = listFiles(SECTIONS_DIR, '.tsx');

  it('includes hero.tsx and harness.tsx in scope when present', () => {
    const names = sectionFiles.map((f) => path.basename(f));
    expect(names).toContain('hero.tsx');
    // harness.tsx is created in Wave 2; assert it is swept once it exists.
    // (Until then it is simply absent from the glob; hero.tsx alone proves
    //  component-copy coverage and carries the intended-red em dash.)
  });

  for (const file of sectionFiles) {
    const rel = path.relative(REPO_ROOT, file).replace(/\\/g, '/');
    const isIntendedRed = path.basename(file) === 'hero.tsx';
    const label = isIntendedRed
      ? `[INTENDED RED until 02-03] has no em/en dash in source text of ${rel}`
      : `has no em/en dash in source text of ${rel}`;
    it(label, () => {
      const source = stripComments(fs.readFileSync(file, 'utf8'));
      const found: string[] = [];
      source.split('\n').forEach((line, i) => {
        if (DASH_RE.test(line)) {
          const code = line.includes(EM_DASH) ? 'U+2014' : 'U+2013';
          found.push(`${rel}:${i + 1} (${code}): ${line.trim()}`);
        }
      });
      expect(found, found.join('\n')).toEqual([]);
    });
  }
});
