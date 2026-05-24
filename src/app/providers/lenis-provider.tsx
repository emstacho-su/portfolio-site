'use client';

import { useEffect, useRef } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBootReady } from '@/lib/boot-context';

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
  children: React.ReactNode;
}

// Smooth-scroll feel — duration controls weight, easing controls momentum.
// autoRaf:false hands the rAF loop to gsap.ticker so Lenis and ScrollTrigger
// (added in Wave 3) share ONE clock; two rAF loops cause jitter (RESEARCH
// Pattern 1 / anti-pattern). Driving lenis.raf from the ticker is set up in the
// effect below.
const LENIS_OPTIONS = {
  duration: 1.15,
  // ExpoOut: heavy initial movement, smooth tail.
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 1,
  touchMultiplier: 1.4,
  autoRaf: false,
};

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<LenisRef>(null);
  const bootReady = useBootReady();

  // Single shared rAF clock: gsap.ticker drives lenis.raf, and every Lenis
  // scroll updates ScrollTrigger. lagSmoothing(0) keeps the two in lockstep.
  // Under reduced motion the other effect destroys Lenis, so the ticker update
  // guards against a null instance (it would otherwise drive nothing / throw).
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      // Reduced motion may destroy Lenis after this loop is registered.
      const current = lenisRef.current?.lenis;
      if (!current) return;
      current.raf(time * 1000); // gsap.ticker time is seconds; Lenis wants ms.
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, []);

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
