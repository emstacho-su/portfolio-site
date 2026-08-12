'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SlabHeading } from '@/components/sections/slab-heading';

// Navbar is fixed h-16 (64px); bars pin directly beneath it.
const NAV_PX = 64;

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
// in, pinned at the nav line (sticky top-16). The bar stays pinned
// for as long as this component's PARENT container is in view, so wrap each
// header plus its content in a `relative` div to scope the sticky range.
// The bar is aria-hidden: the real heading lives in the slab.
export function CollapsingHeader({
  title,
  as = 'h2',
  size = 'sm',
  captions,
}: CollapsingHeaderProps) {
  const slabRef = useRef<HTMLDivElement>(null);
  const past = usePastHeader(slabRef);
  const reduce = useReducedMotion();

  const barClass =
    'flex items-center w-full bg-crimson text-background font-sans font-bold uppercase tracking-tight text-base md:text-lg px-6 py-2.5 shadow-md';

  return (
    <>
      <div ref={slabRef}>
        <SlabHeading title={title} as={as} size={size} captions={captions} />
      </div>

      {/* Zero-height sticky slot right under the slab: pins at the nav line
          the moment the slab's bottom edge passes it, so the snap reads as
          the slab collapsing into the bar. */}
      <div className="sticky top-16 z-30 h-0" aria-hidden="true">
        {past &&
          (reduce ? (
            <div className={barClass}>{title}</div>
          ) : (
            <motion.div
              initial={{ y: '-110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 480, damping: 36 }}
              className={barClass}
            >
              {title}
            </motion.div>
          ))}
      </div>
    </>
  );
}
