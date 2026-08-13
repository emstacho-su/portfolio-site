'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { SlabHeading } from '@/components/sections/slab-heading';

// Bars pin beneath the SHRUNKEN navbar (h-12 = 48px): the nav slims down
// past the hero, and collapsed bars only ever exist in that state.
const NAV_PX = 48;
// Collapsed bar height upper bound (text-sm + py-2), used to start the
// push-out exactly when the next header would touch the bar's bottom edge.
const BAR_PX = 36;

interface CollapsingHeaderProps {
  title: string;
  as?: 'h2' | 'h3';
  size?: 'lg' | 'sm';
  captions?: readonly [string, string];
}

// True once the slab has scrolled up past the navbar line, false again when
// it scrolls back into view. IntersectionObserver with the viewport top inset
// by the nav height; guarded for jsdom, where IO does not exist.
function usePastHeader(ref: RefObject<HTMLDivElement | null>): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setPast(
          !entry.isIntersecting && entry.boundingClientRect.top < NAV_PX
        );
      },
      { rootMargin: `-${NAV_PX}px 0px 0px 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return past;
}

// Slab header that collapses on scroll-past: the full slab stays in flow, and
// once it slides under the navbar a compact bar with the same styling snaps
// in, pinned at the shrunken nav line (sticky top-12). The bar stays pinned for as
// long as this component's PARENT container is in view, so wrap each header
// plus its content in a `relative` div to scope the sticky range. When the
// NEXT header approaches, the bar is pushed out: a scroll-linked translate
// slides it up in lockstep with the container's end crossing the nav line,
// so adjacent headers never collide. The bar is aria-hidden: the real
// heading lives in the slab.
export function CollapsingHeader({
  title,
  as = 'h2',
  size = 'sm',
  captions,
}: CollapsingHeaderProps) {
  const slabRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const past = usePastHeader(slabRef);
  const reduce = useReducedMotion();

  // The push-out tracks the PARENT container (the wrapper div that scopes
  // this header's sticky range); resolved after mount.
  useEffect(() => {
    containerRef.current = slabRef.current?.parentElement ?? null;
  }, []);

  // 0 while the container's end is below the bar; 1 when the end reaches the
  // nav line. Mapped to a full upward slide, so the bar leaves exactly as
  // the next section's header arrives underneath it.
  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef as RefObject<HTMLElement>,
    offset: [`end ${NAV_PX + BAR_PX}px`, `end ${NAV_PX}px`],
  });
  const pushY = useTransform(exitProgress, [0, 1], ['0%', '-105%'], {
    clamp: true,
  });

  // Condensed bar (Evan, 2026-08-13): ~36px tall so the nav + bar stack
  // stays light.
  const barClass =
    'flex items-center w-full bg-crimson text-background font-sans font-bold uppercase tracking-tight text-sm px-6 py-2 shadow-sm';

  return (
    <>
      <div ref={slabRef}>
        <SlabHeading title={title} as={as} size={size} captions={captions} />
      </div>

      {/* Zero-height sticky slot right under the slab: pins at the nav line
          the moment the slab's bottom edge passes it, so the snap reads as
          the slab collapsing into the bar. overflow-hidden on the slot's
          child would clip the snap, so the push-out translate lives on an
          outer wrapper and the snap-in spring on an inner one. */}
      <div className="sticky top-12 z-30 h-0" aria-hidden="true">
        {past &&
          (reduce ? (
            <div className={barClass}>{title}</div>
          ) : (
            <motion.div style={{ y: pushY }}>
              <motion.div
                initial={{ y: '-110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                className={barClass}
              >
                {title}
              </motion.div>
            </motion.div>
          ))}
      </div>
    </>
  );
}
