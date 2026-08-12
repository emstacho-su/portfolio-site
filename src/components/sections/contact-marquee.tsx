'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { MarqueeBand } from '@/components/fx/marquee-band';

// Crimson contact ticker, after the Telepathic Instruments sale-bar reference
// with the sale copy swapped for contact info (Evan's pick, 2026-08-12: email,
// GitHub, LinkedIn, phone). It pops up as a floating sticky footer, rides the
// bottom of the viewport for the whole page (sticky bottom-0 inside <main>),
// and docks at main's end where it morphs flush into the footer: the floating
// inset and rounded corners collapse to zero as the footer scrolls into view.
// The strip is aria-hidden inside MarqueeBand; the footer below carries the
// same addresses as real links.
const CONTACT_ITEMS = [
  'emstacho@syr.edu',
  'github.com/emstacho-su',
  'linkedin.com/in/evan-stachowiak',
  '(262) 933-0228',
] as const;

export function ContactMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // While pinned to the viewport bottom the bar's rect is constant, so this
  // progress sits at 0. It only advances once the bar docks into its natural
  // flow position and rises with the footer, which drives the morph.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'end 0.78'],
  });
  const inset = useTransform(scrollYProgress, [0, 0.7], [12, 0], {
    clamp: true,
  });
  const radius = useTransform(scrollYProgress, [0, 0.7], [14, 0], {
    clamp: true,
  });

  return (
    <div ref={ref} className="sticky bottom-0 z-30 mt-16 md:mt-24">
      <motion.div
        initial={reduce ? false : { y: '110%' }}
        animate={reduce ? undefined : { y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.6 }}
        style={
          reduce
            ? undefined
            : {
                marginLeft: inset,
                marginRight: inset,
                marginBottom: inset,
                borderRadius: radius,
              }
        }
        className="overflow-hidden shadow-lg"
      >
        <MarqueeBand
          items={CONTACT_ITEMS}
          repeat={2}
          duration={38}
          drift={80}
          className="bg-crimson text-background py-2.5 font-mono text-xs md:text-sm uppercase tracking-[0.15em]"
        />
      </motion.div>
    </div>
  );
}
