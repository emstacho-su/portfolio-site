'use client';

import { useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { MarqueeBand, type MarqueeItem } from '@/components/fx/marquee-band';

// Contact ticker as a traveling ribbon (Evan, 2026-08-12). During the hero it
// runs full-bleed under the navbar. The wrap is anchored to scroll itself
// (not a fired animation): as the page moves from the hero to the About
// header, the top bar shoots right, a 45-degree fold flashes at the top-right
// corner, the ribbon travels down the right edge, folds again at the bottom
// corner, and lands right side up as the full-bleed bottom bar. The hero snap
// drives that scroll quickly, so the wrap reads as the scroll effect; slow or
// reversed scrolling plays it back proportionally.
//
// Nav collision guarantee: the right-edge segment translates INSIDE a fixed
// clipping wrapper that starts at the nav line (top-16, overflow-hidden), so
// no resting or transit position can ever show above it. All segments are
// square-cornered and touch both screen edges. The strip is decorative
// (MarqueeBand is aria-hidden); the sr-only block carries the addresses for
// assistive tech, since the footer holds only the copyright.
// Phone stays plain text (Evan, 2026-08-12: no tel: link); the other
// addresses are clickable in the visible strip (tabIndex -1, see
// MarqueeBand) and real focusable links in the sr-only list below.
const CONTACT_ITEMS: readonly MarqueeItem[] = [
  { label: 'emstacho@syr.edu', href: 'mailto:emstacho@syr.edu' },
  { label: 'github.com/emstacho-su', href: 'https://github.com/emstacho-su' },
  {
    label: 'linkedin.com/in/evan-stachowiak',
    href: 'https://www.linkedin.com/in/evan-stachowiak-449119349',
  },
  { label: '(262) 933-0228' },
];

// Bar cross-section after the 33% trim: py-1 + text ~= 26px tall. The right
// ribbon column and the fold diamonds share the same 26px.
const BAND_CLASS =
  'bg-crimson text-background py-1 font-mono text-[11px] md:text-xs uppercase tracking-[0.15em]';

const NAV_PX = 64;

export function ContactRibbon() {
  const reduce = useReducedMotion();

  // The wrap plays across the hero-to-About scroll distance. Measured from
  // the real #about position (hero height) so the snap's landing point and
  // the wrap's completion coincide; re-measured on resize.
  const [range, setRange] = useState(800);
  useEffect(() => {
    const measure = () => {
      const about = document.getElementById('about');
      if (about) setRange(Math.max(about.offsetTop - NAV_PX, 1));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, [0, range], [0, 1], { clamp: true });

  // Phase map: top bar exits (0 to 0.3), ribbon transits the right edge
  // (0.22 to 0.78), bottom bar lands (0.7 to 1). Folds flash while the
  // ribbon passes their corner.
  const topX = useTransform(progress, [0, 0.3], ['0%', '110%'], {
    clamp: true,
  });
  const ribbonY = useTransform(progress, [0.22, 0.78], ['-101%', '101%'], {
    clamp: true,
  });
  const bottomX = useTransform(progress, [0.7, 1], ['110%', '0%'], {
    clamp: true,
  });
  const topFoldOpacity = useTransform(
    progress,
    [0.18, 0.28, 0.42, 0.52],
    [0, 1, 1, 0]
  );
  const bottomFoldOpacity = useTransform(
    progress,
    [0.55, 0.65, 0.78, 0.88],
    [0, 1, 1, 0]
  );

  // Reduced motion: no ribbon theatrics, just the static full-bleed bottom
  // bar docking above the footer.
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

      {/* Top segment: full-bleed under the navbar during the hero. Clipped
          horizontally by its own wrapper so the exit never paints outside
          the viewport. Pointer events stay ON so its links are clickable;
          once translated away, the moved content no longer hit-tests. */}
      <div className="fixed top-16 inset-x-0 z-30 overflow-hidden">
        <motion.div aria-hidden="true" style={{ x: topX }}>
          <MarqueeBand
            items={CONTACT_ITEMS}
            repeat={2}
            duration={38}
            drift={0}
            className={BAND_CLASS}
          />
        </motion.div>
      </div>

      {/* Right-edge segment: a rotated copy of the band translating inside a
          clip wrapper that starts AT the nav line, so it can never show over
          or behind the navbar. */}
      <div className="fixed top-16 bottom-0 right-0 z-30 w-[26px] overflow-hidden pointer-events-none">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ y: ribbonY }}
        >
          <div
            className="absolute top-0 left-[26px] origin-top-left rotate-90"
            style={{ width: `calc(100vh - ${NAV_PX}px)` }}
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
      </div>

      {/* Corner folds: 45-degree diamonds in the darker crimson, visible only
          while the ribbon wraps their corner. */}
      <motion.div
        aria-hidden="true"
        className="fixed top-16 right-0 z-[31] w-[26px] h-[26px] bg-crimson-hover rotate-45 pointer-events-none"
        style={{ opacity: topFoldOpacity }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed bottom-0 right-0 z-[31] w-[26px] h-[26px] bg-crimson-hover rotate-45 pointer-events-none"
        style={{ opacity: bottomFoldOpacity }}
      />

      {/* Bottom segment: sticky inside <main>, so it rides the viewport
          bottom and docks flush above the footer at the end of the page.
          Full-bleed, square corners. */}
      <div className="sticky bottom-0 z-30 mt-16 md:mt-24 overflow-hidden">
        <motion.div aria-hidden="true" style={{ x: bottomX }}>
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

// The addresses as real, focusable links for keyboard and screen reader
// users: the visible ribbon is aria-hidden with unfocusable links and the
// footer is copyright-only, so this is the accessible source of the
// contact info.
function ContactAddresses() {
  return (
    <ul className="sr-only">
      {CONTACT_ITEMS.map((item) => (
        <li key={item.label}>
          {item.href ? (
            <a
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={
                item.href.startsWith('http') ? 'noopener noreferrer' : undefined
              }
            >
              {item.label}
            </a>
          ) : (
            item.label
          )}
        </li>
      ))}
    </ul>
  );
}
