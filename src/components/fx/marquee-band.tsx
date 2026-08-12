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

export interface MarqueeItem {
  label: string;
  /* When set, the item renders as a link. Marquee links are tabIndex -1:
     the band is aria-hidden and every item repeats many times, so keyboard
     and AT users get a single accessible copy elsewhere (see ContactRibbon's
     sr-only list) while pointer users click the moving strip. */
  href?: string;
}

interface MarqueeBandProps {
  /* Items repeated along the band; a separator glyph renders after each. */
  items: readonly MarqueeItem[];
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
            {item.href ? (
              <a
                href={item.href}
                tabIndex={-1}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  item.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="whitespace-nowrap hover:underline underline-offset-4"
              >
                {item.label}
              </a>
            ) : (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
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
      className={cn('group relative w-full overflow-hidden', className)}
    >
      <motion.div
        style={reduce || drift === 0 ? undefined : { x }}
        className="w-max"
      >
        {/* No hover pause (Evan, 2026-08-12): the band keeps rolling under
            the cursor; at these loop durations a link is still easily
            clickable in motion. */}
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
