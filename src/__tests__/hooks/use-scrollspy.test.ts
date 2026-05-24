import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollspy } from '@/hooks/use-scrollspy';

/**
 * R-14 / D-02: useScrollspy returns the active section id derived from
 * IntersectionObserver entries.
 *
 * jsdom has no real IntersectionObserver; setup.ts installs a stub whose
 * `observe`/`disconnect` are no-ops and which stores the callback on the
 * instance. Here we additionally spy on the constructor so the test can grab the
 * instance the hook builds and drive synthetic entries through its callback,
 * then assert the hook's returned active id reflects the highest-ratio
 * intersecting entry.
 *
 * The mockMatchMedia helper is copied VERBATIM from the (now deleted)
 * ArchitectureTab.test.tsx and retained per the Wave 0 contract. The hook is
 * layout-driven and does not gate on reduced motion, but the helper is kept for
 * parity with the other section tests.
 */
function mockMatchMedia(reducedMotion: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string): MediaQueryList =>
      ({
        matches: reducedMotion && query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList
  );
}
void mockMatchMedia;

interface CapturedObserver {
  callback: IntersectionObserverCallback;
}

// Wrap the global IntersectionObserver (the setup.ts stub) so each test can grab
// the instance the hook constructs and drive entries through its callback. The
// replacement must be a real constructor (callable with `new`), so it is a class
// extending the stub, not an arrow function.
function captureObserver(): { current: CapturedObserver | null } {
  const ref: { current: CapturedObserver | null } = { current: null };
  const RealIO = globalThis.IntersectionObserver;
  class CapturingObserver extends RealIO {
    constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
      super(cb, opts);
      ref.current = this as unknown as CapturedObserver;
    }
  }
  vi.stubGlobal('IntersectionObserver', CapturingObserver);
  return ref;
}

// Build a minimal IntersectionObserverEntry for an id with a given ratio.
function entryFor(id: string, ratio: number): IntersectionObserverEntry {
  const target = document.createElement('section');
  target.id = id;
  return {
    target,
    isIntersecting: ratio > 0,
    intersectionRatio: ratio,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: 0,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useScrollspy (R-14)', () => {
  it('defaults to the first id before any intersection', () => {
    captureObserver();
    const { result } = renderHook(() =>
      useScrollspy(['about', 'projects', 'harness'])
    );
    expect(result.current).toBe('about');
  });

  it('sets the active id to the most-intersecting section', () => {
    const observer = captureObserver();
    const { result } = renderHook(() =>
      useScrollspy(['about', 'projects', 'harness'])
    );

    expect(observer.current).not.toBeNull();
    const io = observer.current!;

    act(() => {
      io.callback(
        [
          entryFor('about', 0.2),
          entryFor('projects', 0.8),
          entryFor('harness', 0.1),
        ],
        io as unknown as IntersectionObserver
      );
    });

    expect(result.current).toBe('projects');
  });

  it('updates the active id as a later section dominates the viewport', () => {
    const observer = captureObserver();
    const { result } = renderHook(() =>
      useScrollspy(['about', 'projects', 'harness'])
    );
    const io = observer.current!;

    act(() => {
      io.callback(
        [entryFor('projects', 0.6)],
        io as unknown as IntersectionObserver
      );
    });
    expect(result.current).toBe('projects');

    act(() => {
      io.callback(
        [entryFor('harness', 0.9)],
        io as unknown as IntersectionObserver
      );
    });
    expect(result.current).toBe('harness');
  });
});
