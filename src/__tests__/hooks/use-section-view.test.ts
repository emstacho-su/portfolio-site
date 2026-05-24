import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

/**
 * R-17 / D-05: useSectionView fires a section_view analytics event exactly once
 * per section the first time it intersects the viewport, and never again on
 * re-intersection. It is layout-driven (IntersectionObserver) and does not gate
 * on reduced motion.
 *
 * jsdom has no real IntersectionObserver; setup.ts installs a stub whose
 * observe/disconnect are no-ops and which stores the callback on the instance.
 * Here we wrap the global constructor (as use-scrollspy.test.ts does) so the
 * test can grab the instance the hook builds and drive synthetic entries through
 * its callback, then assert trackSectionView is called once per id.
 *
 * useAnalytics is mocked so the hook's trackSectionView is a spy we can assert
 * on, decoupling this unit from the real fetch/session machinery.
 */

const trackSectionView = vi.fn();
vi.mock('@/hooks/use-analytics', () => ({
  useAnalytics: () => ({
    trackProjectClick: vi.fn(),
    trackResumeDownload: vi.fn(),
    trackContactClick: vi.fn(),
    trackSectionView,
  }),
}));

// Import AFTER the mock is registered so the hook picks up the mocked module.
const { useSectionView } = await import('@/hooks/use-section-view');

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

// Build a minimal IntersectionObserverEntry for an id with a given visibility.
function entryFor(id: string, intersecting: boolean): IntersectionObserverEntry {
  const target = document.createElement('section');
  target.id = id;
  return {
    target,
    isIntersecting: intersecting,
    intersectionRatio: intersecting ? 0.5 : 0,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: 0,
  };
}

afterEach(() => {
  trackSectionView.mockReset();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useSectionView (R-17 / D-05)', () => {
  it('fires trackSectionView once for an id on first intersection', () => {
    const observer = captureObserver();
    renderHook(() => useSectionView(['hero', 'about', 'harness']));

    expect(observer.current).not.toBeNull();
    const io = observer.current!;

    act(() => {
      io.callback(
        [entryFor('harness', true)],
        io as unknown as IntersectionObserver
      );
    });

    expect(trackSectionView).toHaveBeenCalledTimes(1);
    expect(trackSectionView).toHaveBeenCalledWith('harness');
  });

  it('does not refire when the same id intersects again', () => {
    const observer = captureObserver();
    renderHook(() => useSectionView(['hero', 'about', 'harness']));
    const io = observer.current!;

    act(() => {
      io.callback([entryFor('about', true)], io as unknown as IntersectionObserver);
    });
    // Leaves and re-enters the viewport.
    act(() => {
      io.callback([entryFor('about', false)], io as unknown as IntersectionObserver);
    });
    act(() => {
      io.callback([entryFor('about', true)], io as unknown as IntersectionObserver);
    });

    expect(trackSectionView).toHaveBeenCalledTimes(1);
    expect(trackSectionView).toHaveBeenCalledWith('about');
  });

  it('fires once per distinct id as each section scrolls in', () => {
    const observer = captureObserver();
    renderHook(() =>
      useSectionView(['hero', 'about', 'projects', 'harness', 'resume', 'contact'])
    );
    const io = observer.current!;

    act(() => {
      io.callback(
        [entryFor('hero', true), entryFor('about', true)],
        io as unknown as IntersectionObserver
      );
    });
    act(() => {
      io.callback(
        [entryFor('projects', true)],
        io as unknown as IntersectionObserver
      );
    });

    expect(trackSectionView).toHaveBeenCalledTimes(3);
    expect(trackSectionView.mock.calls.map((c) => c[0])).toEqual([
      'hero',
      'about',
      'projects',
    ]);
  });

  it('ignores non-intersecting entries', () => {
    const observer = captureObserver();
    renderHook(() => useSectionView(['hero', 'about']));
    const io = observer.current!;

    act(() => {
      io.callback(
        [entryFor('hero', false), entryFor('about', false)],
        io as unknown as IntersectionObserver
      );
    });

    expect(trackSectionView).not.toHaveBeenCalled();
  });
});
