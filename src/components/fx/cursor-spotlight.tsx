'use client';

import { useEffect, useRef, useState } from 'react';
import { useBootReady } from '@/lib/boot-context';

// Subtle crimson radial glow that tracks the pointer. Disabled on touch devices
// and when prefers-reduced-motion is set. Pointer-events:none so it never
// interferes with page interaction. Defers mounting until the boot/loadup
// sequence finishes so it doesn't compete for memory during startup.
export function CursorSpotlight() {
  const bootReady = useBootReady();
  const [enabled, setEnabled] = useState(false);
  const frameRef = useRef<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bootReady) return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (coarse || reduced) return;
    setEnabled(true);

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
  }, [bootReady]);

  if (!enabled) return null;

  return (
    <div
      ref={divRef}
      className="pointer-events-none fixed inset-0 z-[5]"
      aria-hidden="true"
    />
  );
}
