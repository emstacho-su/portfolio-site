'use client';

import { Children, useRef, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';

interface HorizontalGalleryProps {
  children: ReactNode;
}

// How far (in slide units) the track drifts while "holding" on a centered
// slide before the shoot fires. ~7vw of visible lean, enough to telegraph
// that scrolling does something without ever reading as an off-center rest.
const DRIFT = 0.07;
// Width of the shoot band as a fraction of one slide-to-slide segment. The
// remaining (1 - BAND) is split evenly into the hold phases either side.
const BAND_FRAC = 0.16;

// Apple-style horizontal scroll gallery with SNAP ZONES (Evan's ruling,
// 2026-08-12: panels snap in and center; only slight movement before shooting
// in or out — a panel must never rest half-way between positions). The
// section pins while vertical scroll drives the slides horizontally; the
// vertical gesture is never hijacked — the track is a transform driven by
// window scrollY, the same touch-safe primitive as the About SlideBlocks.
//
// Motion mapping: raw pin progress runs through a piecewise "snap" transform
// into slide units (0..n-1). Within each slide-to-slide segment the output
// holds near the centered slide with a small DRIFT lean for the first 42%,
// shoots across the narrow mid-segment band (BAND_FRAC), then settles into
// the next centered slide for the last 42%. A spring smooths the sharp
// piecewise output, so the shoot lands with physical weight instead of a
// teleport. Every resting scroll position therefore shows a centered panel.
//
// - Wrapper height = n × 100svh (svh, not vh: iOS URL-bar collapse must not
//   change the pin length mid-gesture).
// - The sticky viewport is overflow-hidden, so offscreen slides never widen
//   the page (the About audit's horizontal-overflow lesson).
// - Adjacent slides carry a slight scale/opacity falloff for the Apple depth
//   read, derived from the SAME sprung snap position as the track so the
//   dim/undim stays in phase with the shoot.
// - Reduced motion (or a single slide): plain vertical stack, no pin, no
//   transforms — same contract as ProjectPanel / SlideBlock (S-3).

// Piecewise breakpoints for the snap mapping, in raw-progress space. For each
// of the n-1 segments: [start → hold to +DRIFT by 42%] [shoot across the 16%
// mid band] [settle from -DRIFT to centered by the end]. Inputs are strictly
// increasing and span [0, 1].
function snapBreakpoints(n: number): { inputs: number[]; outputs: number[] } {
  const seg = 1 / (n - 1);
  const hold = (1 - BAND_FRAC) / 2; // fraction of a segment on each side
  const inputs: number[] = [];
  const outputs: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const start = i * seg;
    inputs.push(start, start + hold * seg, start + (hold + BAND_FRAC) * seg);
    outputs.push(i, i + DRIFT, i + 1 - DRIFT);
  }
  inputs.push(1);
  outputs.push(n - 1);
  return { inputs, outputs };
}

export function HorizontalGallery({ children }: HorizontalGalleryProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const slides = Children.toArray(children);
  const n = slides.length;

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  // Raw progress → sharp snap position (slide units), then one shared spring:
  // the track and every slide's depth falloff read the same smoothed value,
  // so they can never drift out of phase.
  const { inputs, outputs } = snapBreakpoints(Math.max(n, 2));
  const snappedRaw = useTransform(scrollYProgress, inputs, outputs, {
    clamp: true,
  });
  const position = useSpring(snappedRaw, {
    stiffness: 160,
    damping: 28,
    mass: 0.6,
  });
  const x = useTransform(position, (v) => `${-v * 100}vw`);

  if (reduce || n < 2) {
    return <div>{children}</div>;
  }

  return (
    <div ref={wrapRef} style={{ height: `${n * 100}svh` }} className="relative">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ x }} className="flex h-full">
          {slides.map((child, i) => (
            <Slide key={i} index={i} position={position}>
              {child}
            </Slide>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

interface SlideProps {
  children: ReactNode;
  index: number;
  position: MotionValue<number>;
}

function Slide({ children, index, position }: SlideProps) {
  // Distance of this slide from viewport center, in slide units: 0 when
  // centered, 1 when a full slide away. Reads the sprung snap position, so
  // the depth falloff fires with the shoot rather than with raw scroll.
  const scale = useTransform(position, (p) => {
    const d = Math.abs(p - index);
    return 1 - Math.min(d, 1) * 0.06;
  });
  const opacity = useTransform(position, (p) => {
    const d = Math.abs(p - index);
    return 1 - Math.min(d, 1) * 0.3;
  });

  // m-auto centers content that fits; overflow-y-auto lets a panel taller
  // than a small phone viewport scroll within its slide instead of clipping
  // (flex centering alone would crop the top edge of overflowing content).
  // Padding keeps a tall panel's first line clear of the fixed navbar plus
  // the pinned collapsed-header bar (top) and the contact ribbon (bottom) —
  // without it the panel title reads clipped under the crimson bar on small
  // viewports (viewport audit 2026-08-12).
  return (
    <motion.div
      style={{ scale, opacity }}
      className="flex h-full w-screen shrink-0 overflow-y-auto"
    >
      <div className="m-auto w-full pt-28 pb-12">{children}</div>
    </motion.div>
  );
}
