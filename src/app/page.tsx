'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ProjectsSection } from '@/components/sections/projects';
import { HarnessSection } from '@/components/sections/harness';
import { ResumeSection } from '@/components/sections/resume';
import { ContactSection } from '@/components/sections/contact';
import { CursorSpotlight } from '@/components/fx/cursor-spotlight';
import { useSectionView } from '@/hooks/use-section-view';

// Navbar height (h-16 = 64px); anchors scroll to sit just below the fixed nav.
const NAV_OFFSET = -64;

// The six in-page section ids in scroll order (D-01 / D-02). useSectionView
// observes these and fires one section_view analytics event per section on first
// scroll-into-view, so the live page emits section_view events (R-17 / D-05).
const SECTION_IDS = [
  'hero',
  'about',
  'projects',
  'harness',
  'resume',
  'contact',
] as const;

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
  // Emit one section_view event per section as each scrolls into view. The hook
  // observes the rendered section ids by getElementById, so the section_view
  // POSTs to /api/analytics fire on the real page (closing the live-wiring gap
  // for 02-07 manual check 7). useSectionView takes a stable array reference.
  useSectionView(SECTION_IDS as unknown as string[]);

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
        <ProjectsSection />
        <HarnessSection />
        <ResumeSection />
        {/* Contact is the final scroll target above the layout footer (D-21). */}
        <ContactSection />
      </main>
    </>
  );
}
