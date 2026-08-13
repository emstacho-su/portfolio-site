'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ProjectsSection } from '@/components/sections/projects';
import { ResumeSection } from '@/components/sections/resume';
import { ContactRibbon } from '@/components/fx/contact-ribbon';
import { HeroSnap } from '@/components/fx/hero-snap';
import { CursorSpotlight } from '@/components/fx/cursor-spotlight';
import { useSectionView } from '@/hooks/use-section-view';

// Navbar height (h-16 = 64px); anchors scroll to sit just below the fixed nav.
const NAV_OFFSET = -48;

// Section ids observed for section_view analytics + scrollspy, in scroll order
// (D-01 / D-02). The standalone "Get In Touch" section was removed as redundant
// with the footer; `contact` now resolves to the footer (id="contact"), so the
// Contact nav link, scrollspy, and the ?s=contact redirect still land there and
// a contact section_view still fires when the footer scrolls into view.
const SECTION_IDS = [
  'hero',
  'about',
  'projects',
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
        <ResumeSection />
        {/* Contact ribbon: top bar during the hero, ribbon-wrap transit down
            the right edge on the snap, full-bleed bottom bar after. Last
            child of main so the bottom segment docks above the footer. */}
        <ContactRibbon />
      </main>
      {/* Snappy hero-to-About scroll snapping (Lenis-driven). */}
      <HeroSnap />
    </>
  );
}
