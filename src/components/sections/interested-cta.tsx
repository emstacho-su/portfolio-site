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

// Marquee chase cycle, in seconds. Keep in sync with globals.css keyframes.
const MARQUEE_CYCLE_S = 1.9;

// Bulbs along the curved underside of a semi-circle sign (flat top, arc
// bottom). Evenly distributed across the arc from left endpoint to right.
const ARC_BULB_COUNT = 14;

function buildArcBulbs(count: number): { x: number; y: number }[] {
  // Using a 100x100 viewBox for the arc component; center at (50, 0), radius
  // 46 (horizontal) / 92 (vertical) so the bulb ring is slightly inset from
  // the visible arc edge. Parametrized from α=π (left) to α=0 (right).
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const angle = Math.PI * (1 - t);
    return {
      x: 50 + 46 * Math.cos(angle),
      y: 92 * Math.sin(angle),
    };
  });
}

const ARC_BULB_POSITIONS: readonly { x: number; y: number }[] =
  buildArcBulbs(ARC_BULB_COUNT);

export function InterestedCTA() {
  const reduced = useReducedMotion();

  return (
    <div className="relative w-full flex justify-center py-14 md:py-20">
      <div className="relative">
        {/* Left marquee arc — upper-left, tilted clockwise, chase flows
            down-right toward the button */}
        <div
          aria-hidden="true"
          className="hidden sm:block pointer-events-none absolute right-full mr-6 md:mr-10 -top-20 md:-top-24"
          style={{ transformOrigin: 'bottom right' }}
        >
          <MarqueeArc variant="left" />
        </div>

        {/* Right marquee arc — mirror of the left */}
        <div
          aria-hidden="true"
          className="hidden sm:block pointer-events-none absolute left-full ml-6 md:ml-10 -top-20 md:-top-24"
          style={{ transformOrigin: 'bottom left' }}
        >
          <MarqueeArc variant="right" />
        </div>

        {/* Button — no hover interactions, tap scale only */}
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
    </div>
  );
}

/* ---------- Vegas marquee arc ---------- */

interface MarqueeArcProps {
  variant: 'left' | 'right';
}

/**
 * Semi-circle marquee sign: flat edge on top, curved arc on bottom, chasing
 * tungsten bulbs along the arc. Tilted diagonally so it "aims down" at the
 * button below.
 *
 * Left variant tilts clockwise, right variant is mirrored via scaleX(-1)
 * (which also reverses the visual chase direction — both signs end up
 * flowing bulbs toward the button).
 */
function MarqueeArc({ variant }: MarqueeArcProps) {
  const tilt = variant === 'left' ? 18 : -18;
  // Right sign: scaleX flips the geometry horizontally AND reverses the
  // chase direction in DOM order.
  const transform =
    variant === 'left'
      ? `rotate(${tilt}deg)`
      : `scaleX(-1) rotate(${-tilt}deg)`;

  return (
    <div
      className="relative w-[130px] md:w-[160px] aspect-[2/1]"
      style={{ transform, transformOrigin: 'bottom center' }}
    >
      {/* Sign backing — SVG for the semi-circle shape (flat top, arc bottom).
          viewBox 0 0 100 50, arc drawn from (0,0) → (100,0) curving down. */}
      <svg
        viewBox="0 0 100 50"
        className="absolute inset-0 w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`arc-body-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A1A1E" />
            <stop offset="60%" stopColor="#321016" />
            <stop offset="100%" stopColor="#1F070B" />
          </linearGradient>
          <linearGradient id={`arc-trim-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E0B266" />
            <stop offset="55%" stopColor="#A47A2E" />
            <stop offset="100%" stopColor="#6B4E1C" />
          </linearGradient>
        </defs>

        {/* Outer brass trim */}
        <path
          d="M 0 0 L 100 0 A 50 25 0 0 1 0 0 Z"
          fill={`url(#arc-trim-${variant})`}
        />
        {/* Inner sign body */}
        <path
          d="M 3 1 L 97 1 A 47 23 0 0 1 3 1 Z"
          fill={`url(#arc-body-${variant})`}
        />
        {/* Pinstripe */}
        <path
          d="M 7 2 L 93 2 A 43 21 0 0 1 7 2 Z"
          fill="none"
          stroke="#B8893C"
          strokeWidth="0.25"
          strokeDasharray="0.8 1.2"
          opacity="0.55"
        />

        {/* Rivets at each end of the flat top edge */}
        {[
          [5, 0.5],
          [95, 0.5],
        ].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx}, ${cy})`}>
            <circle r="1.2" fill="#1A0608" />
            <circle r="0.8" fill="#A47A2E" />
            <circle cx="-0.25" cy="-0.25" r="0.25" fill="#F4D88C" />
          </g>
        ))}
      </svg>

      {/* Bulbs along the arc — HTML divs on top of SVG for rich box-shadow glow */}
      {ARC_BULB_POSITIONS.map((pos, i) => {
        const delay = -(i / ARC_BULB_POSITIONS.length) * MARQUEE_CYCLE_S;
        return (
          <div key={i}>
            <span
              aria-hidden="true"
              className="marquee-bulb-halo absolute rounded-full"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: '14px',
                height: '14px',
                background:
                  'radial-gradient(circle, rgba(255,200,100,0.85) 0%, rgba(255,160,50,0.4) 50%, transparent 75%)',
                filter: 'blur(2.5px)',
                animationDelay: `${delay}s`,
              }}
            />
            <span
              aria-hidden="true"
              className="marquee-bulb absolute rounded-full"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: '6px',
                height: '6px',
                transform: 'translate(-50%, -50%)',
                animationDelay: `${delay}s`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
