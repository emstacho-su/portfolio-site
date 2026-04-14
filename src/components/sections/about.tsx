'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { AboutSkills } from './about-skills';
import { aboutParagraphs } from '@/data/about';
import { EASE } from '@/lib/animation';

export function AboutSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <Section id="about">
      {/* Heading with animated underline */}
      <div ref={headingRef} className="mb-10">
        <Reveal>
          <h2 className="font-mono text-2xl md:text-3xl text-crimson">
            About Me
          </h2>
        </Reveal>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeadingInView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE.OUT }}
          className="h-px bg-gradient-to-r from-crimson/60 via-crimson/20 to-transparent mt-3 origin-left"
        />
      </div>

      {/* Two-column: paragraphs left, skills right — bottoms aligned */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-stretch">
        {/* Paragraphs */}
        <div className="space-y-5">
          {aboutParagraphs.map((paragraph, i) => (
            <Reveal key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.12}>
              <p className="text-foreground/85 leading-relaxed text-base">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Skills — right column, bottom-aligned with text */}
        <Reveal delay={0.2}>
          <AboutSkills />
        </Reveal>
      </div>
    </Section>
  );
}
