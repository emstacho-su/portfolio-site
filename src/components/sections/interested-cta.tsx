'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';

const LABEL = 'Interested?';

// Octagonal chamfered-corner shape for the button surface + inner glow.
const CHAMFER_CLIP = `polygon(
  10px 0%,
  calc(100% - 10px) 0%,
  100% 10px,
  100% calc(100% - 10px),
  calc(100% - 10px) 100%,
  10px 100%,
  0% calc(100% - 10px),
  0% 10px
)`;

// Siren pulse rhythm — two beats per cycle, slow.
const SIREN_OPACITY = [0.35, 1, 0.5, 1, 0.35];
const SIREN_SCALE = [0.92, 1.12, 0.96, 1.12, 0.92];
const SIREN_TIMES = [0, 0.18, 0.5, 0.72, 1];
const SIREN_DURATION = 3.6;

export function InterestedCTA() {
  const reduced = useReducedMotion();

  return (
    <div className="flex justify-center py-14 md:py-20">
      <Link
        href="/interested"
        aria-label="Interested — see projects and resume"
        className="relative inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        {/* Outer breathing halo pulsed on siren rhythm */}
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute -inset-10 bg-crimson/40 blur-3xl pointer-events-none"
            animate={{ opacity: SIREN_OPACITY, scale: SIREN_SCALE }}
            transition={{
              duration: SIREN_DURATION,
              times: SIREN_TIMES,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Inner tight glow on siren rhythm */}
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute -inset-1.5 bg-crimson/60 blur-md pointer-events-none"
            style={{ clipPath: CHAMFER_CLIP }}
            animate={{ opacity: SIREN_OPACITY }}
            transition={{
              duration: SIREN_DURATION,
              times: SIREN_TIMES,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Button surface — chamfered octagon */}
        <motion.span
          style={{ clipPath: CHAMFER_CLIP }}
          className="relative z-10 inline-flex flex-col items-start gap-1 px-8 py-3 bg-crimson text-background overflow-hidden shadow-[0_10px_30px_-8px_rgba(179,45,58,0.7)]"
          whileTap={reduced ? undefined : { scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        >
          {/* Inner siren flicker */}
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 bg-white pointer-events-none"
              animate={{ opacity: [0, 0.16, 0.04, 0.16, 0] }}
              transition={{
                duration: SIREN_DURATION,
                times: SIREN_TIMES,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Status line — small mono CLI prompt */}
          <span className="relative flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-background/75">
            <span aria-hidden="true">{'>'}</span>
            <span>awaiting_input</span>
            {!reduced && (
              <motion.span
                aria-hidden="true"
                className="inline-block h-[9px] w-[5px] bg-background/85"
                animate={{ opacity: [1, 0, 1] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </span>

          {/* Main label row */}
          <span className="relative flex items-center gap-3">
            <span
              aria-hidden="true"
              className="font-mono text-lg text-background/70"
            >
              [
            </span>

            {/* Label with chromatic aberration ghost layers */}
            <span className="relative inline-block font-sans text-lg font-medium tracking-[0.06em] tabular-nums">
              <span
                aria-hidden="true"
                className="absolute inset-0 text-[#67e8f9]/55 mix-blend-screen translate-x-[1.5px] -translate-y-[0.5px] pointer-events-none"
              >
                {LABEL}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-0 text-[#fbbf24]/55 mix-blend-screen -translate-x-[1.5px] translate-y-[0.5px] pointer-events-none"
              >
                {LABEL}
              </span>
              <span className="relative">{LABEL}</span>
            </span>

            <span
              aria-hidden="true"
              className="font-mono text-lg text-background/70"
            >
              ]
            </span>
          </span>
        </motion.span>
      </Link>
    </div>
  );
}
