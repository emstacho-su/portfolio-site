import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Harness | Evan Stachowiak',
  description:
    'Field notes on the 10-layer Claude Code harness behind this portfolio — architecture, the OneDrive→AppData migration, and a chroma orphan bug.',
};

// force-static: this page is purely build-time content. If a future maintainer
// adds a request-time data fetch (cookies(), headers(), etc.), Next will fail the
// build rather than silently switch to dynamic rendering — that's intended.
export const dynamic = 'force-static';

export default function HarnessPage() {
  return (
    <main
      id="main-content"
      className="flex-1 pt-16 px-6 max-w-[1200px] mx-auto w-full"
    >
      <article className="py-12">
        <p className="font-mono text-xs text-tertiary uppercase tracking-[0.18em] mb-3">
          Field Notes — 2026-05-07
        </p>
        <h1 className="mb-4">The harness behind the portfolio.</h1>
      </article>
    </main>
  );
}
