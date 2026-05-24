'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBootMarkReady } from '@/lib/boot-context';

const SCRIPT = [
  'initializing portfolio v2.0',
  'loading editorial theme ............ ok',
  'compiling general sans ............. ok',
  'hydrating motion system ............ ok',
  'warming crimson accent ............. ok',
  'ready.',
] as const;

const LINE_STAGGER_S = 0.11;
const HOLD_BEFORE_FADE_S = 0.25;
const FADE_OUT_S = 0.45;
const SESSION_KEY = 'es-loadup-played-v1';

export function LoadupSequence() {
  const markReady = useBootMarkReady();

  // Decide whether to play in a lazy initializer rather than via setState in an
  // effect (react.dev "you might not need an effect"). The reduced-motion and
  // sessionStorage checks are synchronous reads. null = SSR (renders nothing
  // until the client mounts, avoiding a hydration mismatch); true = play;
  // false = skip. The SESSION_KEY write and markReady() side effects stay in
  // the effect below so render remains pure.
  const [show, setShow] = useState<boolean | null>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return null;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return false;
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    return true;
  });

  useEffect(() => {
    // Skip path (reduced motion or already played this session): just signal
    // boot is ready. No setState here.
    if (show === false) {
      markReady();
      return;
    }
    if (show !== true) return;

    // Play path: mark this session played and auto-dismiss after the sequence.
    // setShow inside the timer callback is asynchronous (not a synchronous
    // setState in the effect body), which is the allowed pattern.
    sessionStorage.setItem(SESSION_KEY, '1');
    const totalMs =
      (SCRIPT.length * LINE_STAGGER_S + HOLD_BEFORE_FADE_S) * 1000;
    const timer = window.setTimeout(() => {
      setShow(false);
      markReady();
    }, totalMs);
    return () => window.clearTimeout(timer);
  }, [show, markReady]);

  // Skip on first user input
  useEffect(() => {
    if (show !== true) return;
    const skip = () => {
      setShow(false);
      markReady();
    };
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('touchstart', skip, { once: true });
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('touchstart', skip);
    };
  }, [show, markReady]);

  if (show === null) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loadup"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_S, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] bg-background flex items-start justify-start"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <pre className="font-mono text-xs sm:text-sm text-text-primary leading-6 pt-6 pl-6 sm:pt-8 sm:pl-8">
            {SCRIPT.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * LINE_STAGGER_S,
                  duration: 0.18,
                  ease: 'easeOut',
                }}
                className="flex gap-2 whitespace-pre"
              >
                <span className="text-crimson select-none">$</span>
                <span className="text-foreground">{line}</span>
                {i === SCRIPT.length - 1 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{
                      delay: i * LINE_STAGGER_S + 0.15,
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: 'loop',
                    }}
                    className="inline-block w-[7px] h-[14px] bg-crimson ml-0.5 align-middle"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            ))}
          </pre>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
