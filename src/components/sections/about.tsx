'use client';

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
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
  const aboutLead = linkedinAbout.slice(0, -1);
  const aboutLast = linkedinAbout[linkedinAbout.length - 1];

  return (
    <section id="about" className="w-full mt-12 md:mt-16 scroll-mt-12">
      {/* Small crimson slab headers matching the Projects transition (Evan,
          2026-08-12). Each header + its content sits in its own wrapper so
          the collapsed sticky bar releases when its subsection ends. */}
      <div className="relative">
        <CollapsingHeader title="About" as="h2" size="sm" />

        <div className="mx-auto w-full max-w-[1200px] px-6 pt-12 md:pt-14 pb-16 md:pb-20">
          {/* LinkedIn About leads (§9.4): the technical record first. All but
              the last paragraph rotate through the pinned carousel; the last
              flows so the section scrolls naturally into the next. */}
          <CarouselBlocks>
            {aboutLead.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-lg sm:text-xl text-foreground leading-[1.7] max-w-[58rem]"
              >
                {paragraph}
              </p>
            ))}
          </CarouselBlocks>

          <SlideBlock from="left" className="mt-8 md:mt-10">
            <p className="text-lg sm:text-xl text-foreground leading-[1.7] max-w-[58rem]">
              {aboutLast}
            </p>
          </SlideBlock>
        </div>
      </div>

      {/* Origin narrative below the fold under its own heading (§9.4): kept
          in full, repositioned rather than deleted. All five paragraphs of
          the approved narrative render (D-09) with the pull quote woven in
          (S-3). Paragraphs and quote rotate in the carousel; the closing
          paragraph flows. */}
      <div className="relative">
        <CollapsingHeader title="How I got here" as="h3" size="sm" />

        <div className="mx-auto w-full max-w-[1200px] px-6 pt-12 md:pt-14 pb-16 md:pb-20">
          <CarouselBlocks>
            {landingAbout.paragraphs.slice(0, 4).map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base sm:text-lg text-foreground/85 leading-[1.7] max-w-[58rem]"
              >
                {paragraph}
              </p>
            ))}
            <blockquote className="pl-8 border-l-2 border-crimson max-w-[52rem]">
              <p className="font-sans text-2xl sm:text-3xl md:text-4xl text-foreground leading-[1.25] tracking-tight">
                &ldquo;{landingAbout.pullQuote}&rdquo;
              </p>
            </blockquote>
          </CarouselBlocks>

          <SlideBlock from="left" className="mt-8 md:mt-10">
            <p className="text-base sm:text-lg text-foreground/85 leading-[1.7] max-w-[58rem]">
              {landingAbout.paragraphs[4]}
            </p>
          </SlideBlock>
        </div>
      </div>
    </section>
  );
}

// Stage line: shrunken nav (48) + collapsed bar (36) + breathing room (36).
// The pinned carousel stage and the SlideBlock fade-out line both use it so
// text is never covered by the header stack.
const STAGE_TOP_PX = 120;

// Scroll-driven paragraph carousel (Evan, 2026-08-13): the stage pins below
// the nav + collapsed-bar stack, the page reads as stationary, and scroll
// rotates the blocks through it, each sliding in from the right and out to
// the left with amped fades. The runway height sets how much scroll each
// rotation consumes. Small viewports and reduced motion fall back to the
// stacked SlideBlock flow.
function CarouselBlocks({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const small = useIsSmallViewport();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${STAGE_TOP_PX}px`, `end ${STAGE_TOP_PX}px`],
  });

  // toArray flattens the mapped-array + sibling-element mix into one flat,
  // keyed list.
  const items = Children.toArray(children);

  if (reduce || small) {
    return (
      // The ref still attaches here: useScroll above requires a hydrated
      // target even when its progress goes unused in this branch.
      <div ref={ref} className="space-y-8 md:space-y-10">
        {items.map((child, i) => (
          <SlideBlock key={i} from="left">
            {child}
          </SlideBlock>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ height: `${items.length * 55 + 25}vh` }}>
      <div
        className="sticky grid"
        style={{ top: STAGE_TOP_PX }}
      >
        {items.map((child, i) => (
          <CarouselItem
            key={i}
            index={i}
            count={items.length}
            progress={scrollYProgress}
          >
            {child}
          </CarouselItem>
        ))}
      </div>
    </div>
  );
}

interface CarouselItemProps {
  index: number;
  count: number;
  progress: MotionValue<number>;
  children: ReactNode;
}

function CarouselItem({ index, count, progress, children }: CarouselItemProps) {
  // Rotations fill the pinned portion of the runway; the tail past 0.88 is
  // the un-pin, which the held last item rides out into normal flow.
  const span = 0.88 / count;
  const a = index * span;
  const b = a + span;
  const f = span * 0.38;
  const first = index === 0;
  const last = index === count - 1;

  // First item is already on stage when the pin begins (it entered with the
  // page scroll); the last one holds so the stage never empties before the
  // un-pin hands off to the flowing closer.
  const opacityRange = first
    ? [b - f, b]
    : last
      ? [a, a + f]
      : [a, a + f, b - f, b];
  const opacityValues = first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0];
  const xRange = opacityRange;
  const xValues = first ? [0, -80] : last ? [80, 0] : [80, 0, 0, -80];

  const opacity = useTransform(progress, opacityRange, opacityValues, {
    clamp: true,
  });
  const x = useTransform(progress, xRange, xValues, { clamp: true });

  return (
    <motion.div
      style={{ opacity, x }}
      // All stacked in one grid cell; pointer events off so invisible layers
      // never intercept selection or clicks.
      className="col-start-1 row-start-1 pointer-events-none"
    >
      {children}
    </motion.div>
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
  // Exit boundary sits at the header-stack line, not the viewport top, so
  // flowing text finishes its fade BEFORE sliding under the nav + collapsed
  // bar instead of being covered mid-sentence (Evan, 2026-08-13).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', `end ${STAGE_TOP_PX}px`],
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
