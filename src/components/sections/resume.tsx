'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { ResumeContent } from '@/components/resume/resume-content';
import { Download } from 'lucide-react';
import { EASE } from '@/lib/animation';

interface ResumeSectionProps {
  onResumeDownload?: () => void;
}

export function ResumeSection() {
  return <ResumeSectionClient />;
}

export function ResumeSectionClient({ onResumeDownload }: ResumeSectionProps = {}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <Section id="resume">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div ref={headingRef}>
          <Reveal>
            <h2 className="font-mono text-2xl md:text-3xl text-crimson flex items-center gap-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={isHeadingInView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-crimson/40"
              >
                {'>_'}
              </motion.span>
              Resume
            </h2>
          </Reveal>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeadingInView ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE.OUT }}
            className="h-px bg-gradient-to-r from-crimson/60 via-crimson/20 to-transparent mt-3 origin-left"
          />
        </div>

        <Reveal delay={0.2}>
          <a
            href="/resume.pdf"
            download="Evan_Stachowiak_Resume.pdf"
            onClick={() => onResumeDownload?.()}
            className="inline-flex items-center gap-2 font-mono text-sm px-5 py-2.5
                       border border-crimson text-crimson rounded-sm
                       hover:bg-crimson hover:text-background transition-all duration-300"
          >
            <Download size={14} />
            Download PDF
          </a>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <ResumeContent />
      </Reveal>
    </Section>
  );
}
