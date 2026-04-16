'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { landingAbout } from '@/data/about';
import { EASE } from '@/lib/animation';

export function AboutSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <Section id="about" className="max-w-[900px]">
      {/* Heading with animated underline */}
      <div ref={headingRef} className="mb-10">
        <Reveal>
          <h2 className="font-sans text-3xl md:text-4xl text-foreground">
            About
          </h2>
        </Reveal>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeadingInView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE.OUT }}
          className="h-[2px] bg-crimson mt-3 origin-left w-24"
        />
      </div>

      {/* First two paragraphs */}
      <div className="space-y-6">
        {landingAbout.paragraphs.slice(0, 2).map((paragraph, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <p className="text-foreground leading-[1.65] prose-body">
              {paragraph}
            </p>
          </Reveal>
        ))}
      </div>

      {/* Pull quote — left-hairline rule + oversized serif-esque treatment */}
      <Reveal delay={0.15}>
        <blockquote className="my-10 pl-6 border-l-2 border-crimson max-w-[44rem]">
          <p className="font-sans text-xl sm:text-2xl md:text-3xl text-foreground leading-[1.3] tracking-tight">
            &ldquo;{landingAbout.pullQuote}&rdquo;
          </p>
        </blockquote>
      </Reveal>

      {/* Closing paragraph */}
      <Reveal delay={0.1}>
        <p className="text-foreground leading-[1.65] prose-body">
          {landingAbout.paragraphs[2]}
        </p>
      </Reveal>
    </Section>
  );
}
