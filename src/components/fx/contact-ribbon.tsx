'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { MarqueeBand } from '@/components/fx/marquee-band';

// Contact ticker as a traveling ribbon (Evan, 2026-08-12). During the hero it
// runs full-bleed under the navbar. On the snap to About it plays a ribbon
// wrap: shoots off to the right, a 45-degree corner fold appears, the ribbon
// travels down the right edge of the viewport, folds again at the bottom
// corner, and lands right side up as the full-bleed bottom bar. Scrolling
// back to the hero plays the wrap in reverse. Corners are square and the bar
// touches both screen edges in every resting state.
//
// The three segments are separate fixed/sticky elements choreographed with
// variant delays; the fold diamonds flash at each corner while the ribbon
// passes. The whole strip is decorative (MarqueeBand is aria-hidden); the
// sr-only block below carries the addresses for assistive tech, since the
// footer now holds only the copyright.
const CONTACT_ITEMS = [
  'emstacho@syr.edu',
  'github.com/emstacho-su',
  'linkedin.com/in/evan-stachowiak',
  '(262) 933-0228',
] as const;

// Bar cross-section after the 33% trim: py-1 + text ~= 26px tall. The right
// ribbon column and the fold diamonds share the same 26px (w/h utilities
// below use the arbitrary value directly).
const BAND_CLASS =
  'bg-crimson text-background py-1 font-mono text-[11px] md:text-xs uppercase tracking-[0.15em]';

// Zone hysteresis: past 60% of the viewport counts as below the hero; back
// above 35% counts as the hero again. The snap animation crosses the gap
// fast, so the state never flaps mid-wrap.
const DOWN_AT = 0.6;
const UP_AT = 0.35;

type Zone = 'top' | 'bottom';

const topBarVariants = {
  top: {
    x: '0%',
    transition: { delay: 0.95, duration: 0.4, ease: [0, 0, 0.2, 1] as const },
  },
  bottom: {
    x: '110%',
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
};

const rightRibbonVariants = {
  top: {
    y: ['101%', '0%', '-101%'],
    transition: { delay: 0.25, duration: 0.8, times: [0, 0.5, 1], ease: 'easeInOut' as const },
  },
  bottom: {
    y: ['-101%', '0%', '101%'],
    transition: { delay: 0.25, duration: 0.8, times: [0, 0.5, 1], ease: 'easeInOut' as const },
  },
};

const bottomBarVariants = {
  top: {
    x: '110%',
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
  bottom: {
    x: '0%',
    transition: { delay: 0.95, type: 'spring' as const, stiffness: 300, damping: 32 },
  },
};

// Fold diamonds: opacity flashes while the ribbon passes their corner.
const foldFlash = (delay: number) => ({
  opacity: [0, 1, 1, 0],
  transition: { delay, duration: 0.5, times: [0, 0.2, 0.8, 1] },
});

const topFoldVariants = { bottom: foldFlash(0.2), top: foldFlash(0.85) };
const bottomFoldVariants = { bottom: foldFlash(0.85), top: foldFlash(0.2) };

export function ContactRibbon() {
  const reduce = useReducedMotion();
  const [zone, setZone] = useState<Zone>('top');

  useLenis((lenis) => {
    const vh = window.innerHeight;
    const y = lenis.scroll;
    setZone((current) => {
      if (current === 'top' && y > vh * DOWN_AT) return 'bottom';
      if (current === 'bottom' && y < vh * UP_AT) return 'top';
      return current;
    });
  });

  // Reduced motion: no ribbon theatrics, just the static full-bleed bottom
  // bar docking above the footer (Lenis is destroyed under reduce, so the
  // zone listener never runs either).
  if (reduce) {
    return (
      <div className="sticky bottom-0 z-30 mt-16 md:mt-24">
        <ContactAddresses />
        <MarqueeBand
          items={CONTACT_ITEMS}
          repeat={2}
          duration={38}
          drift={0}
          className={BAND_CLASS}
        />
      </div>
    );
  }

  return (
    <>
      <ContactAddresses />

      {/* Top segment: full-bleed under the navbar during the hero. */}
      <motion.div
        aria-hidden="true"
        className="fixed top-16 inset-x-0 z-30"
        initial={false}
        variants={topBarVariants}
        animate={zone}
      >
        <MarqueeBand
          items={CONTACT_ITEMS}
          repeat={2}
          duration={38}
          drift={0}
          className={BAND_CLASS}
        />
      </motion.div>

      {/* Right-edge segment: the ribbon in transit. A rotated copy of the
          band travels the full height of the viewport below the nav. */}
      <motion.div
        aria-hidden="true"
        className="fixed top-16 bottom-0 right-0 z-30 w-[26px] overflow-hidden"
        initial={false}
        variants={rightRibbonVariants}
        animate={zone}
      >
        <div
          className="absolute top-0 left-[26px] origin-top-left rotate-90"
          style={{ width: 'calc(100vh - 64px)' }}
        >
          <MarqueeBand
            items={CONTACT_ITEMS}
            repeat={2}
            duration={38}
            drift={0}
            className={BAND_CLASS}
          />
        </div>
      </motion.div>

      {/* Corner folds: 45-degree diamonds in the darker crimson, flashing as
          the ribbon wraps each corner. */}
      <motion.div
        aria-hidden="true"
        className="fixed top-16 right-0 z-[31] w-[26px] h-[26px] bg-crimson-hover rotate-45 opacity-0"
        initial={false}
        variants={topFoldVariants}
        animate={zone}
      />
      <motion.div
        aria-hidden="true"
        className="fixed bottom-0 right-0 z-[31] w-[26px] h-[26px] bg-crimson-hover rotate-45 opacity-0"
        initial={false}
        variants={bottomFoldVariants}
        animate={zone}
      />

      {/* Bottom segment: sticky inside <main>, so it rides the viewport
          bottom and docks flush above the footer at the end of the page.
          Full-bleed, square corners. */}
      <div className="sticky bottom-0 z-30 mt-16 md:mt-24">
        <motion.div
          aria-hidden="true"
          initial={false}
          variants={bottomBarVariants}
          animate={zone}
        >
          <MarqueeBand
            items={CONTACT_ITEMS}
            repeat={2}
            duration={38}
            drift={60}
            className={BAND_CLASS}
          />
        </motion.div>
      </div>
    </>
  );
}

// The addresses as real text for screen readers: the visible ribbon is
// aria-hidden and the footer is copyright-only, so this is the accessible
// source of the contact info.
function ContactAddresses() {
  return (
    <ul className="sr-only">
      {CONTACT_ITEMS.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
