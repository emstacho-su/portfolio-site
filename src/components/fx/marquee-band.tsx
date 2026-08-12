'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { Sparkle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarqueeBandProps {
  /* Phrases repeated along the band; a separator glyph renders after each. */
  items: readonly string[];
  /* Band surface: background, text color, font, size, vertical padding. */
  className?: string;
  /* Seconds for one full loop (one copy width). Lower = faster. */
  duration?: number;
  /* Extra scroll-linked slip in px, applied on top of the auto-scroll so the
     band reacts to the user's scroll (the Busy Bee reference mechanic).
     0 disables it. */
  drift?: number;
  /* How many times the items list repeats inside ONE copy. The default keeps a
     copy comfortably wider than any viewport so the 3-copy loop never shows a
     seam, even with drift applied. */
  repeat?: number;
  separator?: ReactNode;
}

// Full-bleed auto-scrolling ticker. The CSS keyframe loop lives on the inner
// track (3 identical copies, translated by exactly one copy per cycle); the
// scroll-linked drift lives on a separate motion wrapper so the two transforms
// never fight. The band is presentational: callers must ensure the copy also
// exists somewhere accessible, because the whole strip is aria-hidden.
export function MarqueeBand({
  items,
  className,
  duration = 30,
  drift = 120,
  repeat = 4,
  separator = <Sparkle size={14} strokeWidth={2.5} className="shrink-0" />,
}: MarqueeBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Down-scroll slips the track further in its travel direction, so scrolling
  // feels like it accelerates the ticker; scrolling back up rewinds it.
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -drift], {
    clamp: true,
  });
  const x = useSpring(xRaw, { stiffness: 60, damping: 22, mass: 1 });

  const copy = (
    <div className="flex items-center gap-8 shrink-0">
      {Array.from({ length: repeat }).flatMap((_, r) =>
        items.map((item, i) => (
          <span key={`${r}-${i}`} className="flex items-center gap-8 shrink-0">
            <span className="whitespace-nowrap">{item}</span>
            {separator}
          </span>
        ))
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('relative w-full overflow-hidden', className)}
    >
      <motion.div
        style={reduce || drift === 0 ? undefined : { x }}
        className="w-max"
      >
        <div
          className="flex items-center gap-8 w-max animate-marquee"
          style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
        >
          {copy}
          {copy}
          {copy}
        </div>
      </motion.div>
    </div>
  );
}
