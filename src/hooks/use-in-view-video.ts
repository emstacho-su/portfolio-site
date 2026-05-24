'use client';

import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';

interface UseInViewVideoOptions {
  // The scrollable container the video lives in (the Dialog.Viewport). When
  // null/undefined the observer falls back to the viewport (window) root.
  scroller?: Element | null;
  // Fraction of the video that must be visible before it plays.
  threshold?: number;
}

/**
 * Plays a muted <video> when it scrolls into view and pauses it on exit
 * (RESEARCH Pattern 5). Designed for the pop-out demo sections.
 *
 * - Reduced motion (D-23 / S-3): the observer is never created, so the poster
 *   stays put with no autoplay.
 * - The play() promise is always .catch()'d: browser autoplay policy may block
 *   playback (the poster then remains), and that must not throw.
 * - IntersectionObserver root is the provided scroller so visibility is measured
 *   against the native Dialog scroll container, not the window.
 * - The observer is disconnected on cleanup (S-4).
 */
export function useInViewVideo(
  ref: RefObject<HTMLVideoElement | null>,
  { scroller, threshold = 0.5 }: UseInViewVideoOptions = {}
): void {
  const reduce = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    // Reduced motion -> no observer, poster only (D-23).
    if (!video || reduce) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Autoplay may be blocked; the poster stays and we swallow the error.
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { root: scroller ?? null, threshold }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [ref, reduce, scroller, threshold]);
}
