'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { cn } from '@/lib/utils';

interface SlabHeadingProps {
  title: string;
  /* Heading level; visual treatment is identical either way. */
  as?: 'h2' | 'h3';
  /* lg = the Projects transition scale; sm = the same slab at roughly 40% of
     the lg height (60% shorter) for the in-page section headers. */
  size?: 'lg' | 'sm';
  /* Optional mono caption pair rendered under the wordmark, left and right. */
  captions?: readonly [string, string];
  className?: string;
}

// Full-bleed crimson slab heading: oversized paper wordmark that parallaxes
// slower than the scroll (the Busy Bee reference mechanic). One component so
// About, How I got here, and Projects stay visually related; only scale and
// parallax amplitude differ by size.
export function SlabHeading({
  title,
  as = 'h2',
  size = 'sm',
  captions,
  className,
}: SlabHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Amplitude scales with slab height so the small slabs never clip the
  // wordmark against their tighter padding.
  const amp = size === 'lg' ? 52 : 16;
  const yRaw = useTransform(scrollYProgress, [0, 1], [amp, -amp], {
    clamp: true,
  });
  const y = useSpring(yRaw, { stiffness: 55, damping: 22, mass: 1 });

  // Captions reveal via whileInView (IntersectionObserver), NOT the scroll
  // progress above: target-based useScroll caches element offsets, and when
  // late layout (media, reflow) shifts the slab's document position the
  // cached mapping strands the captions at opacity 0 (mobile audit
  // 2026-08-12). IO measures real intersection, and once:true latches the
  // reveal so it never rewinds at the top of the page. The parallax y stays
  // scroll-linked — a slightly stale parallax is invisible; missing captions
  // are not.

  const MotionTag = as === 'h3' ? motion.h3 : motion.h2;

  return (
    <div
      ref={ref}
      className={cn(
        'relative w-full overflow-hidden bg-crimson px-4 sm:px-6',
        size === 'lg'
          ? 'pt-10 md:pt-14 pb-7 md:pb-10'
          : 'pt-4 md:pt-5 pb-3 md:pb-4',
        className
      )}
    >
      <MotionTag
        style={reduce ? undefined : { y }}
        className={cn(
          'text-center font-sans font-bold uppercase text-background leading-[0.92] tracking-tight',
          size === 'lg'
            ? 'text-[clamp(3.25rem,10.5vw,11.25rem)]'
            : 'text-[clamp(1.3rem,4.2vw,4.5rem)]'
        )}
      >
        {title}
      </MotionTag>

      {captions ? (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto mt-4 md:mt-5 flex w-full max-w-[1200px] items-center justify-between gap-6 font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] text-background/75"
        >
          <span>{captions[0]}</span>
          <span>{captions[1]}</span>
        </motion.div>
      ) : null}
    </div>
  );
}
