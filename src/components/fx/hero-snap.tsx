'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';

// Shrunken navbar height (the nav slims to h-12 past the hero); the snap
// lands the About slab flush under it.
const NAV_PX = 48;
// Free-scroll dead zone at the very top so tiny wheel nudges do not fire.
const TOP_DEADZONE_PX = 48;

// Snappy hero <-> about scroll: the hero fills the initial viewport, and any
// committed scroll inside it snaps the page to the About header (or back to
// the top when scrolling up). Runs on Lenis scroll events; under reduced
// motion Lenis is destroyed, so no snap ever fires (native scroll wins).
export function HeroSnap() {
  const snapping = useRef(false);
  const lastY = useRef(0);
  const lastWheelAt = useRef(0);

  // The snap must fire ONLY on direct wheel/trackpad input. Gating on recent
  // wheel activity excludes every other scroll source in one move: nav-link
  // and CTA lenis.scrollTo transits, ?s= deep links, touch panning, and
  // keyboard scrolling — all of which pass through the hero zone and were
  // being hijacked mid-flight to About (viewport audit 2026-08-12).
  useEffect(() => {
    const onWheel = () => {
      lastWheelAt.current = performance.now();
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useLenis((lenis) => {
    // Touch devices scroll natively (syncTouch is off), so a locked
    // programmatic scrollTo here fires mid-gesture and fights the finger and
    // its momentum (mobile audit 2026-08-12). The snap is a wheel/trackpad
    // affordance; coarse pointers keep fully native hero scrolling.
    if (window.matchMedia('(pointer: coarse)').matches) return;
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

    // Only snap while a wheel event is fresh (see the wheel listener above).
    if (performance.now() - lastWheelAt.current > 200) return;

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
