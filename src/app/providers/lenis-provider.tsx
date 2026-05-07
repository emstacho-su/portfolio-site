'use client';

import { useEffect, useRef } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { useBootReady } from '@/lib/boot-context';

interface LenisProviderProps {
  children: React.ReactNode;
}

// Smooth-scroll feel — duration controls weight, easing controls momentum.
const LENIS_OPTIONS = {
  duration: 1.15,
  // ExpoOut: heavy initial movement, smooth tail.
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 1,
  touchMultiplier: 1.4,
};

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<LenisRef>(null);
  const bootReady = useBootReady();

  // Gate: while loader runs, scroll is locked at top. After hand-off, start.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    if (bootReady) {
      lenis.start();
    } else {
      lenis.stop();
      window.scrollTo(0, 0);
    }
  }, [bootReady]);

  // Reduced motion → drop Lenis entirely, native scroll takes over.
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) lenisRef.current?.lenis?.destroy();
  }, []);

  return (
    <ReactLenis ref={lenisRef} root options={LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
