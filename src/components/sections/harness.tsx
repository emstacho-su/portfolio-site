'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { staggerContainer, staggerItem, EASE } from '@/lib/animation';
import { pillars } from '@/data/harness';

// Distilled harness section (R-28 / D-18). Six scannable capability pillars
// replace the prior tabbed, data-dense UI. The story to land is not "I use AI"
// but "I engineer the system around the AI (retrieval, orchestration, context,
// guardrails)." The entrance uses the shared staggerContainer/staggerItem
// variants, which already short-circuit under prefers-reduced-motion via the
// AnimationProvider MotionConfig gate (S-3 / D-23). No em dashes (D-22).
function HarnessBody() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <Section id="harness">
      <div ref={headingRef} className="mb-4">
        <Reveal>
          <h2 className="font-mono text-2xl md:text-3xl text-crimson">
            Harness
          </h2>
        </Reveal>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeadingInView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE.OUT }}
          className="h-px bg-gradient-to-r from-crimson/60 via-crimson/20 to-transparent mt-3 origin-left"
        />
      </div>

      <Reveal delay={0.1}>
        <p className="text-muted-foreground text-sm max-w-2xl mb-10 mt-6">
          The system engineered around the AI. Not "I use AI," but the
          retrieval, orchestration, and discipline that turn a model into
          reliable output on real projects.
        </p>
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {pillars.map((pillar) => (
          <motion.article
            key={pillar.id}
            variants={staggerItem}
            className="border border-hairline rounded-md p-6 bg-background
                       hover:border-crimson/40 transition-colors duration-300"
          >
            <h3 className="font-sans text-lg font-semibold text-foreground">
              {pillar.name}
            </h3>
            <p className="font-mono text-xs text-muted-foreground mt-3 leading-relaxed">
              {pillar.oneLiner}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}

// `Harness` is the name the Wave 0 test imports; `HarnessSection` is the name
// page.tsx imports. Both render the same body so the two callers stay in sync.
export function Harness() {
  return <HarnessBody />;
}

export function HarnessSection() {
  return <HarnessBody />;
}
