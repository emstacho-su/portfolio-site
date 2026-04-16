'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';

export function InterestedCTA() {
  const reduced = useReducedMotion();

  return (
    <div className="flex justify-center py-16 md:py-24">
      <Link
        href="/interested"
        aria-label="Interested — see projects and resume"
        className="group relative inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm"
      >
        {/* Outer pulsing halo — big diffused glow that breathes */}
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute -inset-8 rounded-md bg-crimson/35 blur-3xl pointer-events-none"
            animate={{
              opacity: [0.35, 0.7, 0.35],
              scale: [0.9, 1.08, 0.9],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Inner tight glow — crisper halo hugging the edge */}
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute -inset-1 rounded-sm bg-crimson/50 blur-md pointer-events-none"
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Button surface */}
        <motion.span
          className="relative z-10 inline-flex items-center gap-3 px-10 py-4 bg-crimson text-background overflow-hidden rounded-sm shadow-[0_8px_24px_-8px_rgba(179,45,58,0.55)] group-hover:shadow-[0_12px_40px_-6px_rgba(179,45,58,0.85)] transition-shadow duration-300"
          whileHover={reduced ? undefined : { scale: 1.04 }}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        >
          {/* Subtle inner flicker — tracks the outer pulse for unity */}
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 bg-white pointer-events-none"
              animate={{ opacity: [0, 0.09, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Shimmer sweep on hover — diagonal light band wipes across */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none"
          />

          {/* Animated corner brackets — CLI/terminal motif */}
          <span
            aria-hidden="true"
            className="absolute left-2 top-1 h-2 w-2 border-l border-t border-background/0 group-hover:border-background/70 transition-colors duration-300"
          />
          <span
            aria-hidden="true"
            className="absolute right-2 bottom-1 h-2 w-2 border-r border-b border-background/0 group-hover:border-background/70 transition-colors duration-300"
          />

          <span className="relative font-sans text-lg font-medium tracking-[0.04em] group-hover:tracking-[0.14em] transition-all duration-300">
            Interested?
          </span>
          <span
            aria-hidden="true"
            className="relative text-lg font-light transition-transform duration-300 group-hover:translate-x-1.5"
          >
            →
          </span>
        </motion.span>
      </Link>
    </div>
  );
}
