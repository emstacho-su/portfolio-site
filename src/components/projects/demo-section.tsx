'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useInViewVideo } from '@/hooks/use-in-view-video';
import { cn } from '@/lib/utils';
import type { DemoSection as DemoSectionData } from '@/data/projects';

interface DemoSectionProps {
  demo: DemoSectionData;
  // The Dialog.Viewport scroll container, threaded through to the in-view video
  // hook so visibility is measured against the pop-out scroller (Pattern 3/5).
  scroller?: Element | null;
}

/**
 * One scroll destination inside the pop-out case study (D-12). Data-driven from
 * a single DemoSection entry so real media drops in at the same src/poster paths
 * with no code change (D-13).
 *
 * - type 'video': muted, inline, looping clip that autoplays on scroll-into-view
 *   and pauses on exit (via useInViewVideo). preload="none" keeps the Lighthouse
 *   budget bounded. Under reduced motion the src is omitted so only the poster
 *   shows and nothing autoplays (D-23 / D-16).
 * - type 'image': the screenshot rendered in the same aspect-video frame, with
 *   the poster as a graceful fallback.
 */
export function DemoSection({ demo, scroller }: DemoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  // Only the video branch observes; the hook itself no-ops under reduced motion.
  useInViewVideo(videoRef, { scroller });

  return (
    <section
      aria-label={demo.caption}
      className="min-h-[60vh] flex flex-col justify-center gap-6 py-16 border-t border-border first:border-t-0"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border border-border bg-surface aspect-video'
        )}
      >
        {demo.type === 'video' ? (
          <video
            ref={videoRef}
            // Omit the source under reduced motion so the poster shows and no
            // network fetch / autoplay happens (D-23).
            src={reduce ? undefined : demo.src}
            poster={demo.poster}
            muted
            playsInline
            loop
            preload="none"
            className="h-full w-full object-cover"
            aria-label={demo.caption}
          />
        ) : (
          // Swappable placeholder path (D-13): not a build-time-known asset, so
          // next/image optimization does not apply. Plain <img> is intentional.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={demo.src}
            alt={demo.caption}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="max-w-2xl">
        <h3 className="font-mono text-sm text-crimson/90">{demo.caption}</h3>
        <p className="mt-2 text-sm md:text-base text-foreground/75 leading-relaxed">
          {demo.body}
        </p>
      </div>
    </section>
  );
}
