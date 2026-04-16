'use client';

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { Section } from '@/components/ui/section';
import { landingAbout } from '@/data/about';
import { EASE } from '@/lib/animation';

export function AboutSection() {
  return (
    <Section id="about" className="max-w-[1200px] py-20 md:py-28">
      <SlideBlock from="left" className="mb-12 md:mb-14">
        <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight">
          About
        </h2>
        <div className="h-[2px] bg-crimson mt-4 w-32" />
      </SlideBlock>

      <div className="space-y-8 md:space-y-10">
        {landingAbout.paragraphs.slice(0, 2).map((paragraph, i) => (
          <SlideBlock key={i} from="left">
            <p className="text-lg sm:text-xl text-foreground leading-[1.7] max-w-[58rem]">
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
        <p className="text-lg sm:text-xl text-foreground leading-[1.7] max-w-[58rem]">
          {landingAbout.paragraphs[2]}
        </p>
      </SlideBlock>
    </Section>
  );
}

interface SlideBlockProps {
  children: ReactNode;
  from: 'left' | 'right';
  className?: string;
}

// Scroll-linked slide. Content shoots in from the chosen side as it enters
// the viewport, and slides back out the same side as it leaves near the
// footer. Tracks scroll position continuously rather than a one-shot trigger.
function SlideBlock({ children, from, className }: SlideBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const offset = from === 'left' ? -140 : 140;
  const xMotion: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.18, 0.78, 1],
    [offset, 0, 0, offset]
  );
  const opacityMotion: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.15, 0.82, 1],
    [0, 1, 1, 0]
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
