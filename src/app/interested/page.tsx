'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { useAnalytics } from '@/hooks/use-analytics';
import { EASE } from '@/lib/animation';

interface Option {
  href: '/projects' | '/resume';
  label: string;
  blurb: string;
  meta: string;
}

const OPTIONS: readonly Option[] = [
  {
    href: '/projects',
    label: 'Projects',
    blurb:
      'Case studies on algorithmic trading, poker game theory, document automation, and the workflow tools I built for school.',
    meta: '4 builds · read the problem, approach, and outcome',
  },
  {
    href: '/resume',
    label: 'Resume',
    blurb:
      'The full version: ISO 9001 auditing, two QA internships, Syracuse IMT coursework, and the stack I work in today.',
    meta: 'PDF download · auto-generated from source data',
  },
];

export default function InterestedPage() {
  // Fire page_view on mount (same pattern as other route pages)
  useAnalytics();

  return (
    <main
      id="main-content"
      className="flex-1 pt-20 md:pt-24 pb-16 px-6 max-w-[1400px] mx-auto w-full"
    >
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mt-14 md:mt-20">
        {OPTIONS.map((opt, i) => (
          <PreviewCard key={opt.href} option={opt} index={i} />
        ))}
      </div>
    </main>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE.OUT }}
      className="text-center max-w-2xl mx-auto"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-crimson mb-4">
        Pick your path
      </p>
      <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight">
        What are you here for?
      </h1>
      <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
        Either answer is fine. Both preview live below.
      </p>
      <div className="h-[2px] bg-crimson mt-6 mx-auto w-24" />
    </motion.div>
  );
}

interface PreviewCardProps {
  option: Option;
  index: number;
}

function PreviewCard({ option, index }: PreviewCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 + index * 0.12, ease: EASE.OUT }}
    >
      <Link
        href={option.href}
        aria-label={`Open ${option.label} page`}
        className="group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {/* Card frame */}
        <motion.div
          whileHover={reduced ? undefined : { y: -4 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="relative border border-hairline bg-surface overflow-hidden shadow-[0_8px_24px_-16px_rgba(0,0,0,0.18)] group-hover:border-crimson group-hover:shadow-[0_20px_40px_-20px_rgba(179,45,58,0.45)] transition-[border-color,box-shadow] duration-300"
        >
          {/* Window chrome strip — mono terminal vibe */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-hairline bg-background/60 font-mono text-[10px] uppercase tracking-[0.18em] text-tertiary">
            <span className="inline-block h-2 w-2 rounded-full bg-crimson/70" />
            <span className="inline-block h-2 w-2 rounded-full bg-tertiary/40" />
            <span className="inline-block h-2 w-2 rounded-full bg-tertiary/40" />
            <span className="ml-auto">
              stachowiak.dev{option.href}
            </span>
          </div>

          {/* Iframe preview — pointer-events disabled so the whole card is clickable */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
            <div className="absolute inset-0 origin-top-left scale-[0.55] w-[182%] h-[182%]">
              <iframe
                src={option.href}
                title={`${option.label} preview`}
                loading="lazy"
                aria-hidden="true"
                tabIndex={-1}
                className="w-full h-full pointer-events-none border-0"
              />
            </div>

            {/* Hover tint + scan line for extra polish */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30 pointer-events-none" />
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 h-[2px] bg-crimson/30 pointer-events-none"
              initial={{ y: '-10%', opacity: 0 }}
              whileHover={reduced ? undefined : { y: '110%', opacity: 1 }}
              transition={{ duration: 1.1, ease: 'linear' }}
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-7 border-t border-hairline bg-background">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h2 className="font-sans text-2xl md:text-3xl text-foreground tracking-tight">
                {option.label}
              </h2>
              <span
                aria-hidden="true"
                className="font-mono text-sm text-crimson transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </div>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              {option.blurb}
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-tertiary">
              {option.meta}
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
