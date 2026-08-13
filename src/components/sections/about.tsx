'use client';

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CollapsingHeader } from '@/components/sections/collapsing-header';
import { landingAbout, linkedinAbout } from '@/data/about';
import { EASE } from '@/lib/animation';

// Small-viewport tuning (mobile audit 2026-08-12): the ±140px desktop offset
// overflows a phone-width layout (501px scrollWidth at a 390px viewport), and
// the unhurried 0→0.4 entry range lets a momentum flick arrive at content
// that is still transparent. Under 768px the slide shrinks and the entry
// range compresses so the reveal keeps pace with touch scrolling.
const SMALL_VIEWPORT_QUERY = '(max-width: 767px)';

function useIsSmallViewport(): boolean {
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(SMALL_VIEWPORT_QUERY);
    // Synchronous first read in the effect (not a lazy initializer): the
    // server and hydration renders must agree on the desktop values, then the
    // real viewport applies post-hydration (same SSR rationale as HeroLoader).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSmall(mq.matches);
    const update = (event: MediaQueryListEvent) => setSmall(event.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return small;
}

export function AboutSection() {
  return (
    <section id="about" className="w-full mt-12 md:mt-16 scroll-mt-12">
      {/* Small crimson slab headers matching the Projects transition (Evan,
          2026-08-12). Each header + its content sits in its own wrapper so
          the collapsed sticky bar releases when its subsection ends. */}
      <div className="relative">
        <CollapsingHeader title="About" as="h2" size="sm" />

        <div className="mx-auto w-full max-w-[1200px] px-6 pt-12 md:pt-14 pb-16 md:pb-20">
          {/* LinkedIn About leads (§9.4): the technical record first. */}
          <div className="space-y-8 md:space-y-10">
            {linkedinAbout.map((paragraph) => (
              <SlideBlock key={paragraph.slice(0, 32)} from="left">
                <p className="text-lg sm:text-xl text-foreground leading-[1.7] max-w-[58rem]">
                  {paragraph}
                </p>
              </SlideBlock>
            ))}
          </div>
        </div>
      </div>

      {/* Origin narrative below the fold under its own heading (§9.4): kept
          in full, repositioned rather than deleted. All five paragraphs of
          the approved narrative render (D-09) with the pull quote woven in;
          each keeps the SlideBlock reduced-motion-gated slide (S-3). */}
      <div className="relative">
        <CollapsingHeader title="How I got here" as="h3" size="sm" />

        <div className="mx-auto w-full max-w-[1200px] px-6 pt-12 md:pt-14 pb-16 md:pb-20">
          <div className="space-y-8 md:space-y-10">
            {landingAbout.paragraphs.slice(0, 4).map((paragraph) => (
              <SlideBlock key={paragraph.slice(0, 32)} from="left">
                <p className="text-base sm:text-lg text-foreground/85 leading-[1.7] max-w-[58rem]">
                  {paragraph}
                </p>
              </SlideBlock>
            ))}
          </div>

          <SlideBlock from="right" className="my-14 md:my-16">
            <blockquote className="pl-8 border-l-2 border-crimson max-w-[52rem]">
              <p className="font-sans text-2xl sm:text-3xl md:text-4xl text-foreground leading-[1.25] tracking-tight">
                &ldquo;{landingAbout.pullQuote}&rdquo;
              </p>
            </blockquote>
          </SlideBlock>

          <SlideBlock from="left">
            <p className="text-base sm:text-lg text-foreground/85 leading-[1.7] max-w-[58rem]">
              {landingAbout.paragraphs[4]}
            </p>
          </SlideBlock>
        </div>
      </div>
    </section>
  );
}

interface SlideBlockProps {
  children: ReactNode;
  from: 'left' | 'right';
  className?: string;
}

// Scroll-linked slide. Content shoots in from the chosen side as it enters
// the viewport, then holds. Progress is latched at its high-water mark so the
// reveal plays once and never rewinds: the previous continuous mapping re-hid
// content whenever it dropped below the viewport again, which on phones read
// as whole sections going missing (mobile audit 2026-08-12).
function SlideBlock({ children, from, className }: SlideBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const small = useIsSmallViewport();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Latch: track the furthest progress seen; never report less.
  const highWaterRef = useRef(0);
  const latched: MotionValue<number> = useTransform(scrollYProgress, (v) => {
    if (v > highWaterRef.current) highWaterRef.current = v;
    return highWaterRef.current;
  });

  // Offsets sized to fit the layout's side margins: the old ±140px exceeded
  // the (viewport − 1200px)/2 + px-6 gutter on most desktop windows, so
  // mid-reveal text was readable while its leading edge sat clipped past the
  // overflow-x boundary ("one side cut off", viewport audit 2026-08-12).
  const offset = (from === 'left' ? -1 : 1) * (small ? 44 : 96);

  // Small viewports: entry only on the latched progress — slide in from the
  // side as the block enters from the bottom, then hold (the continuous
  // mapping read as sections going missing on phones, mobile audit
  // 2026-08-12). Desktop: the full sideload in AND out restored (Evan,
  // 2026-08-12) — continuous, unlatched progress slides the block in as it
  // enters from the bottom and back out the same side as it leaves through
  // the top, rewinding naturally when scrolling up. Opacity's entry range
  // ends after x's on purpose: the block must land (or nearly land) before
  // it turns readable, so a still-offset block is never presented as
  // clipped readable text.
  const xRaw: MotionValue<number> = useTransform(
    small ? latched : scrollYProgress,
    small ? [0, 0.2] : [0, 0.35, 0.72, 1],
    small ? [offset, 0] : [offset, 0, 0, offset],
    { clamp: true }
  );
  const opacityRaw: MotionValue<number> = useTransform(
    small ? latched : scrollYProgress,
    small ? [0, 0.25] : [0, 0.4, 0.76, 1],
    small ? [0, 1] : [0, 1, 1, 0],
    { clamp: true }
  );

  // Spring-smooth the raw scroll-linked values for a softer settle. Small
  // viewports get a stiffer spring for the same keep-up reason as the ranges.
  const xMotion = useSpring(
    xRaw,
    small
      ? { stiffness: 120, damping: 26, mass: 0.9 }
      : { stiffness: 55, damping: 22, mass: 1 }
  );
  const opacityMotion = useSpring(
    opacityRaw,
    small
      ? { stiffness: 150, damping: 28, mass: 0.9 }
      : { stiffness: 70, damping: 24, mass: 1 }
  );

  const style = prefersReducedMotion
    ? undefined
    : { x: xMotion, opacity: opacityMotion };

  return (
    <motion.div
      ref={ref}
      style={style}
      transition={{ ease: EASE.OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
