'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { CursorSpotlight } from '@/components/fx/cursor-spotlight';

// Navbar height (h-16 = 64px); anchors scroll to sit just below the fixed nav.
const NAV_OFFSET = -64;

// Reads the `?s=<section>` query that the legacy-route redirects (next.config.ts)
// land on, smooth-scrolls to the matching anchor via Lenis, then cleans the URL.
// The query value is used ONLY as a Lenis scroll target / id lookup, never as
// markup or a selector beyond `#id`; an unknown id simply no-ops (threat T-02-03).
// useSearchParams requires a Suspense boundary in the App Router, so this lives
// in its own client child wrapped in <Suspense> below.
function ScrollFromQuery() {
  const params = useSearchParams();
  const router = useRouter();
  const lenis = useLenis();

  useEffect(() => {
    const s = params.get('s');
    if (!s) return;
    lenis?.scrollTo(`#${s}`, { offset: NAV_OFFSET });
    // Drop the query so a refresh does not re-trigger the scroll.
    router.replace('/', { scroll: false });
  }, [params, router, lenis]);

  return null;
}

export default function Home() {
  return (
    <>
      <CursorSpotlight />
      <Suspense fallback={null}>
        <ScrollFromQuery />
      </Suspense>
      <main id="main-content" className="flex-1">
        <HeroSection />
        {/* Single faint hairline rule separating hero from about (spec section 6.1) */}
        <div
          aria-hidden="true"
          className="mx-auto w-full max-w-[1200px] px-6"
        >
          <div className="hairline-rule" />
        </div>
        <AboutSection />
      </main>
    </>
  );
}
