'use client';

import { useEffect, useRef, useState } from 'react';
import { useBootReady } from '@/lib/boot-context';

// Subtle crimson radial glow that tracks the pointer. Disabled on touch devices
// and when prefers-reduced-motion is set. Pointer-events:none so it never
// interferes with page interaction. Defers mounting until the boot/loadup
// sequence finishes so it doesn't compete for memory during startup.
export function CursorSpotlight() {
  const bootReady = useBootReady();
  const frameRef = useRef<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Device qualification (fine pointer, motion allowed) is synchronous and
  // stable for the component's life, so compute it once in a lazy initializer
  // during render instead of via setState in an effect (react.dev "you might
  // not need an effect"). Guard SSR where matchMedia is absent.
  const [qualifies] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    return !coarse && !reduced;
  });

  // Enabled only once the boot/loadup sequence has handed off AND the device
  // qualifies. Derived in render, so no setState-in-effect is needed.
  const enabled = bootReady && qualifies;

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = requestAnimationFrame(() => {
        if (!divRef.current) return;
        divRef.current.style.background = `radial-gradient(520px circle at ${e.clientX}px ${e.clientY}px, rgba(215, 38, 61, 0.028), transparent 60%)`;
      });
    };

    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={divRef}
      className="pointer-events-none fixed inset-0 z-[5]"
      aria-hidden="true"
    />
  );
}
