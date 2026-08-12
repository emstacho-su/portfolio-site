'use client';

import { useRef } from 'react';
import { useLenis } from 'lenis/react';

// Navbar height; the snap lands the About slab flush under the nav.
const NAV_PX = 64;
// Free-scroll dead zone at the very top so tiny wheel nudges do not fire.
const TOP_DEADZONE_PX = 48;

// Snappy hero <-> about scroll: the hero fills the initial viewport, and any
// committed scroll inside it snaps the page to the About header (or back to
// the top when scrolling up). Runs on Lenis scroll events; under reduced
// motion Lenis is destroyed, so no snap ever fires (native scroll wins).
export function HeroSnap() {
  const snapping = useRef(false);
  const lastY = useRef(0);

  useLenis((lenis) => {
    const y = lenis.scroll;
    const dir = y - lastY.current;
    lastY.current = y;
    if (snapping.current || dir === 0) return;

    const about = document.getElementById('about');
    if (!about) return;
    const aboutTop =
      about.getBoundingClientRect().top + y - NAV_PX;

    const inHeroZone = y > TOP_DEADZONE_PX && y < aboutTop - 8;
    if (!inHeroZone) return;

    snapping.current = true;
    lenis.scrollTo(dir > 0 ? aboutTop : 0, {
      duration: 0.85,
      // Quartic ease-out: fast launch, firm landing.
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      lock: true,
      onComplete: () => {
        snapping.current = false;
        lastY.current = lenis.scroll;
      },
    });
  });

  return null;
}
