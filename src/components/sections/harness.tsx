'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { EASE } from '@/lib/animation';

// Placeholder Harness section (Wave 1 / D-01). It exists now so the `#harness`
// anchor and scrollspy target are present on the single page. Wave 2 (plan
// 02-04, R-28 / D-18) replaces the body below with the six capability pillars
// (Second Brain as RAG, GSD Workflow, Multi-Agent Research, Sub-Agent
// Execution, Context Engineering, Guardrails). No em dashes (D-22).
export function HarnessSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <Section id="harness">
      <div ref={headingRef} className="mb-10">
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
        <p className="text-muted-foreground text-sm max-w-md">
          The agentic dev stack behind this portfolio. The six capability
          pillars land here in a later wave of the redesign.
        </p>
      </Reveal>
    </Section>
  );
}
