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
const MAGNETIC_PULL_X = 10; // max horizontal drift in px
const MAGNETIC_PULL_Y = 7; // max vertical drift in px

export function InterestedCTA() {
  const reduced = useReducedMotion();
  const linkRef = useRef<HTMLAnchorElement>(null);

  // --- Magnetic pull: track cursor relative to button center, spring-smooth ---
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

  // --- Scramble: cycle chars, resolve left-to-right over SCRAMBLE_DURATION_MS ---
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
    <div className="flex justify-center py-16 md:py-24">
      <Link
        ref={linkRef}
        href="/interested"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Interested — see projects and resume"
        className="group relative inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm"
      >
        {/* Outer breathing halo — big diffuse bloom */}
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

        {/* Button surface — magnetic pull applied via spring-smoothed translate */}
        <motion.span
          style={reduced ? undefined : { x: springX, y: springY }}
          className="relative z-10 inline-flex items-center gap-3 px-10 py-4 bg-crimson text-background overflow-hidden rounded-sm shadow-[0_8px_24px_-8px_rgba(179,45,58,0.55)] group-hover:shadow-[0_14px_44px_-6px_rgba(179,45,58,0.9)] transition-shadow duration-300"
          whileHover={reduced ? undefined : { scale: 1.04 }}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        >
          {/* Subtle inner flicker synced to outer pulse */}
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 bg-white pointer-events-none"
              animate={{ opacity: [0, 0.09, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Diagonal shimmer sweep on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none"
          />

          {/* Animated corner brackets — CLI terminal motif */}
          <span
            aria-hidden="true"
            className="absolute left-2 top-1 h-2 w-2 border-l border-t border-background/0 group-hover:border-background/70 transition-colors duration-300"
          />
          <span
            aria-hidden="true"
            className="absolute right-2 bottom-1 h-2 w-2 border-r border-b border-background/0 group-hover:border-background/70 transition-colors duration-300"
          />

          {/*
            Label renders displayText (scrambles on hover, resolves L→R).
            font-variant-numeric + tabular-nums prevents width wobble as
            characters cycle through different glyph widths.
          */}
          <span
            aria-live="off"
            className="relative font-sans text-lg font-medium tracking-[0.04em] group-hover:tracking-[0.14em] transition-[letter-spacing] duration-300 tabular-nums"
          >
            {displayText}
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
