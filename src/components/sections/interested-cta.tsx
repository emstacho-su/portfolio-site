'use client';

import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

const LABEL = 'Interested?';
const SCRAMBLE_CHARS = '!@#$%^&*<>/?[]{}|=+-_~';
const SCRAMBLE_DURATION_MS = 520;
const SCRAMBLE_TICK_MS = 38;
const MAGNETIC_PULL_X = 10;
const MAGNETIC_PULL_Y = 7;

// Octagonal chamfered-corner shape used on the button AND on the emanating
// radar rings so they match. 10px cut on each corner.
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

// Siren keyframes: two hard beats per ~0.9s cycle (bee-boo, bee-boo).
const SIREN_OPACITY = [0.35, 1, 0.5, 1, 0.35];
const SIREN_SCALE = [0.92, 1.12, 0.96, 1.12, 0.92];
const SIREN_TIMES = [0, 0.18, 0.5, 0.72, 1];
const SIREN_DURATION = 3.6;
const RADAR_DURATION = 3.2;

export function InterestedCTA() {
  const reduced = useReducedMotion();
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Magnetic pull --------------------------------------------------------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 260, damping: 22, mass: 0.7 });
  const springY = useSpring(mouseY, { stiffness: 260, damping: 22, mass: 0.7 });

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return;
    const rect = linkRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(dx * MAGNETIC_PULL_X);
    mouseY.set(dy * MAGNETIC_PULL_Y);
  };

  const resetMagnet = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Scramble -------------------------------------------------------------
  const [displayText, setDisplayText] = useState(LABEL);
  const scrambleTimerRef = useRef<number | null>(null);

  const stopScramble = () => {
    if (scrambleTimerRef.current !== null) {
      window.clearInterval(scrambleTimerRef.current);
      scrambleTimerRef.current = null;
    }
  };

  const startScramble = () => {
    stopScramble();
    const start = performance.now();
    scrambleTimerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / SCRAMBLE_DURATION_MS, 1);
      const resolvedCount = Math.floor(progress * LABEL.length);

      const next = LABEL.split('')
        .map((ch, i) => {
          if (i < resolvedCount || ch === ' ') return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');
      setDisplayText(next);

      if (progress >= 1) {
        stopScramble();
        setDisplayText(LABEL);
      }
    }, SCRAMBLE_TICK_MS);
  };

  const handleMouseEnter = () => {
    if (reduced) return;
    startScramble();
  };

  const handleMouseLeave = () => {
    resetMagnet();
    stopScramble();
    setDisplayText(LABEL);
  };

  useEffect(() => () => stopScramble(), []);

  return (
    <div className="flex flex-col items-center gap-3 py-8 md:py-12">
      {/* Status decoration above the button — mono CLI prompt vibe */}
      <StatusTag reduced={reduced} />

      <Link
        ref={linkRef}
        href="/interested"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Interested — see projects and resume"
        className="group relative inline-block focus:outline-none"
      >
        {/* Radar rings — three staggered, emanating outward on siren rhythm,
            clipped to the same octagonal shape as the button. */}
        {!reduced && (
          <>
            <RadarRing delay={0} />
            <RadarRing delay={0.6} />
            <RadarRing delay={1.2} />
          </>
        )}

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

        {/* Inner tight glow also on siren rhythm (tighter scale) */}
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

        {/* Button surface — chamfered octagon, magnetic pull applied */}
        <motion.span
          style={{
            clipPath: CHAMFER_CLIP,
            ...(reduced ? {} : { x: springX, y: springY }),
          }}
          className="relative z-10 inline-flex items-center gap-3 px-8 py-3 bg-crimson text-background overflow-hidden shadow-[0_10px_30px_-8px_rgba(179,45,58,0.7)] group-hover:shadow-[0_18px_52px_-6px_rgba(179,45,58,0.95)] transition-shadow duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-background"
          whileHover={reduced ? undefined : { scale: 1.04 }}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        >
          {/* Siren flicker — white flash synced to outer pulse */}
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

          {/* Diagonal shimmer sweep on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none"
          />

          {/* Corner ticks — CLI motif, appear on hover */}
          <span
            aria-hidden="true"
            className="absolute left-2 top-1 h-2 w-2 border-l border-t border-background/0 group-hover:border-background/80 transition-colors duration-300"
          />
          <span
            aria-hidden="true"
            className="absolute right-2 bottom-1 h-2 w-2 border-r border-b border-background/0 group-hover:border-background/80 transition-colors duration-300"
          />

          {/* Opening bracket */}
          <span
            aria-hidden="true"
            className="relative font-mono text-lg text-background/70 group-hover:text-background transition-colors duration-200"
          >
            [
          </span>

          {/* Label with chromatic aberration ghost layers */}
          <span className="relative inline-block font-sans text-lg font-medium tracking-[0.06em] group-hover:tracking-[0.16em] transition-[letter-spacing] duration-300 tabular-nums">
            <span
              aria-hidden="true"
              className="absolute inset-0 text-[#67e8f9]/55 mix-blend-screen translate-x-[1.5px] -translate-y-[0.5px] pointer-events-none"
            >
              {displayText}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 text-[#fbbf24]/55 mix-blend-screen -translate-x-[1.5px] translate-y-[0.5px] pointer-events-none"
            >
              {displayText}
            </span>
            <span className="relative" aria-live="off">
              {displayText}
            </span>
          </span>

          {/* Closing bracket */}
          <span
            aria-hidden="true"
            className="relative font-mono text-lg text-background/70 group-hover:text-background transition-colors duration-200"
          >
            ]
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

/* ---------- Decorative sub-components ---------- */

function StatusTag({ reduced }: { reduced: boolean | null }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-crimson/80">
      <span aria-hidden="true">{'>'}</span>
      <span>awaiting_input</span>
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="inline-block h-2 w-[6px] bg-crimson"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}

function RadarRing({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-0 border-2 border-crimson pointer-events-none"
      style={{ clipPath: CHAMFER_CLIP }}
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: [1, 1.85], opacity: [0.85, 0] }}
      transition={{
        duration: RADAR_DURATION,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}
