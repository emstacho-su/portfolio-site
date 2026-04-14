'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
  // null = deciding; true = show; false = hide
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setShow(false);
      return;
    }
    if (sessionStorage.getItem(SESSION_KEY)) {
      setShow(false);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, '1');
    setShow(true);

    // Auto-dismiss after the full sequence plays
    const totalMs =
      (SCRIPT.length * LINE_STAGGER_S + HOLD_BEFORE_FADE_S) * 1000;
    const timer = window.setTimeout(() => setShow(false), totalMs);
    return () => window.clearTimeout(timer);
  }, []);

  // Skip on first user input
  useEffect(() => {
    if (show !== true) return;
    const skip = () => setShow(false);
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('touchstart', skip, { once: true });
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('touchstart', skip);
    };
  }, [show]);

  if (show === null) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loadup"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_S, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <pre className="font-mono text-xs sm:text-sm text-text-primary leading-6 w-full max-w-[520px] px-8">
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
