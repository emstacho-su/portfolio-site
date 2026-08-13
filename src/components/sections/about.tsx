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
          {/* LinkedIn About leads (§9.4): the technical record first. Stacked
              flow, several paragraphs visible at once, each with the amped
              scroll-linked slide in/out (Evan, 2026-08-13). */}
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
          the approved narrative render (D-09) with the pull quote woven in
          (S-3). Paragraphs and quote rotate in the carousel; the closing
          paragraph flows. */}
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

// The header-stack line: shrunken nav (48) + collapsed bar (36) + breathing
// room (36). Flowing text finishes its fade here so it is never covered by
// the stack.
const STAGE_TOP_PX = 120;

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

  // Mobile slide distance, sized to the phone gutter (mobile audit
  // 2026-08-12); direction still honors `from` in the mobile fallback,
  // which keeps the latched entry-only reveal.
  const offset = (from === 'left' ? -1 : 1) * 44;

  // Desktop: rotating circular carousel (Evan, 2026-08-13). The wheel's hub
  // sits off the LEFT edge of the screen and blocks ride its rim through
  // the stacked flow: each arcs in from the left at the bottom of the
  // viewport, swings right to its reading position mid-transit, and arcs
  // back out to the LEFT as it reaches the header-stack line (the exit
  // boundary above). In and out on the same side, several blocks sharing
  // the visible arc at once. ARC_PX stays inside the side gutter ("one
  // side cut off", viewport audit 2026-08-12); the slight tilt about the
  // left edge sells the rotation.
  const ARC_PX = 96;
  const ARC_TILT_DEG = 4;
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

  const source = small ? latched : scrollYProgress;

  const xRaw: MotionValue<number> = useTransform(source, (v: number) => {
    const p = clamp01(v);
    if (small) return offset * (1 - Math.min(1, p / 0.2));
    return -ARC_PX * (1 - Math.sin(Math.PI * p));
  });
  const opacityRaw: MotionValue<number> = useTransform(source, (v: number) => {
    const p = clamp01(v);
    if (small) return Math.min(1, p / 0.25);
    if (p < 0.16) return p / 0.16;
    if (p > 0.86) return (1 - p) / 0.14;
    return 1;
  });
  const rotateRaw: MotionValue<number> = useTransform(source, (v: number) =>
    small ? 0 : (0.5 - clamp01(v)) * ARC_TILT_DEG
  );

  // Spring-smooth the raw scroll-linked values; stiff enough that the arc
  // tracks the wheel without drifting behind the scroll.
  const springCfg = small
    ? { stiffness: 120, damping: 26, mass: 0.9 }
    : { stiffness: 95, damping: 24, mass: 1 };
  const xMotion = useSpring(xRaw, springCfg);
  const rotateMotion = useSpring(rotateRaw, springCfg);
  const opacityMotion = useSpring(
    opacityRaw,
    small
      ? { stiffness: 150, damping: 28, mass: 0.9 }
      : { stiffness: 110, damping: 26, mass: 1 }
  );

  const style = prefersReducedMotion
    ? undefined
    : {
        x: xMotion,
        opacity: opacityMotion,
        rotate: rotateMotion,
        transformOrigin: 'left center',
      };

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
