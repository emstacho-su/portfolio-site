import { describe, it, expect } from 'vitest';
import nextConfig from '../../../next.config';

/**
 * R-16 (Wave 1): All six legacy sources redirect to the single page with the
 * correct `?s=<section>` destination and the chosen permanent status.
 *
 * next.config.ts already exists, so this file imports and asserts the real
 * `redirects()` output. It is INTENTIONALLY RED until Wave 1 extends the
 * single existing `/toolkit` entry to the full six-entry table
 * (see 02-PATTERNS.md "next.config.ts" assignment). The failures here are
 * assertion failures against the not-yet-written table, NOT import errors.
 *
 * Destinations use `/?s=<section>` (query, not `/#fragment`) because fragments
 * cannot be matched server-side in Next 16.2.2 (RESEARCH Pitfall 2).
 */
describe('next.config redirects (R-16)', () => {
  const EXPECTED = [
    { source: '/projects', destination: '/?s=projects' },
    // Scoped to exclude paths containing a dot so real static assets under
    // public/projects/ (demo .mp4 / .png) are served instead of 308-redirected;
    // only extensionless legacy slug paths still redirect.
    { source: '/projects/:slug((?!.*\\.).*)', destination: '/?s=projects' },
    { source: '/resume', destination: '/?s=resume' },
    { source: '/harness', destination: '/?s=harness' },
    { source: '/interested', destination: '/?s=contact' },
    { source: '/toolkit', destination: '/?s=harness' },
  ] as const;

  async function getRedirects() {
    expect(typeof nextConfig.redirects).toBe('function');
    return (await nextConfig.redirects!()) ?? [];
  }

  it('returns exactly six redirect entries', async () => {
    const redirects = await getRedirects();
    expect(redirects).toHaveLength(EXPECTED.length);
  });

  it('maps every legacy source to its /?s=<section> destination', async () => {
    const redirects = await getRedirects();
    for (const expected of EXPECTED) {
      const match = redirects.find((r) => r.source === expected.source);
      expect(match, `missing redirect for ${expected.source}`).toBeDefined();
      expect(match!.destination).toBe(expected.destination);
    }
  });

  it('declares a permanent status on every entry', async () => {
    const redirects = await getRedirects();
    for (const r of redirects) {
      // Either `permanent: true` (emits 308 in Next 16.2.2) or an explicit
      // numeric statusCode (e.g. 301) is acceptable per the planner's choice.
      const hasPermanentFlag = typeof r.permanent === 'boolean';
      const hasStatusCode = typeof r.statusCode === 'number';
      expect(
        hasPermanentFlag || hasStatusCode,
        `redirect for ${r.source} has no permanent flag or statusCode`
      ).toBe(true);
    }
  });
});
