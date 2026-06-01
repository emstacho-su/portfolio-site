import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Single-page redesign (D-04 / R-16): the former multi-page routes are
  // consolidated onto `/`. Each legacy source issues a permanent redirect to
  // `/?s=<section>` and a client effect in page.tsx reads `?s=` and smooth-
  // scrolls to the matching anchor (the fragment cannot be matched or reliably
  // set server-side, RESEARCH Pitfall 2). `permanent: true` emits HTTP 308 in
  // Next 16.2.2 (the modern, SEO-equivalent permanent), per RESEARCH Open Q2;
  // swap a per-entry `statusCode: 301` only if a literal 301 is ever mandated.
  // Every destination is a static internal `/?s=` literal, so no user input
  // flows into the redirect target (closes the open-redirect threat, T-02-04).
  async redirects() {
    return [
      { source: '/projects', destination: '/?s=projects', permanent: true },
      // Retire the dynamic case-study detail route; everything lands on the
      // projects section of the single page. The negative-lookahead on a dot
      // excludes real static assets under public/projects/ (demo .mp4 / .png
      // files) so they are served instead of 308-redirected; only extensionless
      // legacy slug paths (e.g. /projects/quant-edge-tracker) still redirect.
      { source: '/projects/:slug((?!.*\\.).*)', destination: '/?s=projects', permanent: true },
      { source: '/resume', destination: '/?s=resume', permanent: true },
      { source: '/harness', destination: '/?s=harness', permanent: true },
      { source: '/interested', destination: '/?s=contact', permanent: true },
      // RETARGET the original /toolkit entry: its old destination (/harness) is
      // being deleted, so it now points at the harness section anchor.
      { source: '/toolkit', destination: '/?s=harness', permanent: true },
    ];
  },
};

export default nextConfig;
