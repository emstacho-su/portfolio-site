'use client';

import { useCallback, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useLenis } from 'lenis/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';
import { DemoSection } from '@/components/projects/demo-section';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/projects';

interface ProjectPopoutProps {
  // Controlled open state. When omitted the dialog is uncontrolled and renders
  // its own trigger button (used by the a11y test and as a standalone usage).
  open?: boolean;
  // The case-study payload. May be null while the shared dialog is closed.
  project?: Project | null;
  // Fires with just the next open boolean (the Base UI eventDetails arg is
  // dropped) so callers and the R-27 test can assert toHaveBeenCalledWith(true).
  onOpenChange?: (open: boolean) => void;
  // Label for the built-in trigger when running uncontrolled.
  triggerLabel?: string;
}

/**
 * Accessible full-screen case-study pop-out (R-27 / D-16). Built on Base UI
 * Dialog so focus trap, ESC, background scroll lock, and focus return to the
 * trigger come for free (modal defaults to true). NOT hand-rolled: the
 * mobile-menu pattern lacks a focus trap and would fail R-27.
 *
 * Lenis is paused on open and resumed on close (D-12 / Pitfall 5) so the smooth
 * scroll engine does not fight the body scroll lock. The Dialog.Viewport is the
 * native scroll container; its element is handed to each DemoSection as the
 * ScrollTrigger / IntersectionObserver `scroller` so in-dialog autoplay measures
 * against the scrollable viewport rather than the window (Pattern 3/5).
 */
export function ProjectPopout({
  open,
  project,
  onOpenChange,
  triggerLabel = 'Open case study',
}: ProjectPopoutProps) {
  const lenis = useLenis();
  // The scrollable Dialog.Viewport element, captured once it mounts so demo
  // sections can observe visibility against it.
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);

  const isControlled = open !== undefined;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      // Strip Base UI's eventDetails arg so onOpenChange fires with only the
      // boolean (the R-27 test asserts toHaveBeenCalledWith(true|false)).
      onOpenChange?.(nextOpen);

      if (nextOpen) {
        // Pause Lenis while the modal owns scroll (Pitfall 5). Refresh after the
        // dialog layout settles so in-dialog ScrollTriggers measure correctly
        // (Pitfall 3); rAF defers until the popup has painted.
        lenis?.stop();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      } else {
        lenis?.start();
      }
    },
    [lenis, onOpenChange]
  );

  const rootProps = isControlled
    ? { open, onOpenChange: handleOpenChange }
    : { onOpenChange: handleOpenChange };

  return (
    <Dialog.Root {...rootProps}>
      {!isControlled && (
        <Dialog.Trigger
          className={cn(
            'inline-flex items-center gap-2 rounded-md border border-crimson/40 px-5 py-2.5',
            'font-mono text-sm text-crimson transition-colors hover:bg-crimson/10'
          )}
        >
          {triggerLabel}
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-background/85 backdrop-blur-sm" />
        <Dialog.Viewport
          ref={setScroller}
          // data-lenis-prevent: Lenis intercepts wheel events at the window and
          // preventDefaults them, which blocked wheel scrolling INSIDE this
          // dialog (native scrollTop worked, wheel did nothing). This attribute
          // tells Lenis to ignore wheel events originating in the viewport so
          // the case study scrolls natively while the page stays locked.
          data-lenis-prevent
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
        >
          <Dialog.Popup className="min-h-screen w-full bg-background outline-none">
            <Dialog.Title className="sr-only">
              {project ? `${project.title} case study` : 'Project case study'}
            </Dialog.Title>

            <Dialog.Close
              aria-label="Close case study"
              className={cn(
                'fixed top-5 right-6 z-10 rounded-md p-2 text-foreground/70',
                'transition-colors hover:text-crimson focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-crimson/50'
              )}
            >
              <X size={22} />
            </Dialog.Close>

            <div className="mx-auto w-full max-w-[1100px] px-6 pt-24 pb-16">
              {project && (
                <header className="mb-16">
                  <h2 className="font-mono text-3xl md:text-4xl text-crimson font-semibold">
                    {project.title}
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-foreground/80 leading-relaxed max-w-2xl">
                    {project.overview}
                  </p>
                </header>
              )}

              {project?.demos.map((demo, index) => (
                <DemoSection
                  key={`${demo.caption}-${index}`}
                  demo={demo}
                  scroller={scroller}
                />
              ))}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
