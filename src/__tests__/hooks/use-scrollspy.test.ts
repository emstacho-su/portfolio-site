import { describe, it, expect, vi } from 'vitest';

/**
 * R-14 / D-02: useScrollspy returns the active section id derived from
 * IntersectionObserver entries.
 *
 * The hook (`@/hooks/use-scrollspy`) is created in Wave 1 and does not exist
 * yet, so a top-level static import would crash collection with an
 * import-resolution error. To keep the Wave 0 baseline GREEN and discoverable
 * (`npx vitest list`), the real assertions live in a `describe.skip` block that
 * dynamically imports the hook (never evaluated while skipped). Wave 1 flips
 * `describe.skip` -> `describe` once the hook lands.
 *
 * The global IntersectionObserver stub from setup.ts exposes the captured
 * `callback`, so the test below drives entries via `io.callback([...], io)`.
 * The mockMatchMedia helper is copied VERBATIM from the soon-deleted
 * ArchitectureTab.test.tsx and retained here per the Wave 0 contract.
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

describe('useScrollspy (R-14)', () => {
  it('is enumerated by vitest list even before the hook exists', () => {
    // Sentinel keeps the suite green and discoverable in Wave 0.
    expect(true).toBe(true);
  });
});

// Unskip in Wave 1 once src/hooks/use-scrollspy.ts exists, and replace the
// indirected import below with a real static
// `import { useScrollspy } from '@/hooks/use-scrollspy'`.
// NOTE: the specifier is held in a variable (not a string literal) so Vite's
// transform-time import analysis does NOT try to resolve the not-yet-created
// module. A plain `await import('@/hooks/use-scrollspy')` crashes COLLECTION
// (not just the test), which would defeat `describe.skip`. The block is
// skipped, so this runtime import never executes in Wave 0.
const SCROLLSPY_MODULE = '@/hooks/use-scrollspy';
describe.skip('useScrollspy active-id behavior (Wave 1)', () => {
  it('sets the active id to the most-intersecting section', async () => {
    const { renderHook } = await import('@testing-library/react');
    const { useScrollspy } = (await import(/* @vite-ignore */ SCROLLSPY_MODULE)) as {
      useScrollspy: (ids: string[]) => string;
    };

    const { result } = renderHook(() => useScrollspy(['about', 'projects', 'harness']));

    // The setup.ts stub stores the latest IntersectionObserver instance's
    // callback; Wave 1 will expose/access it to drive entries, e.g.:
    //   act(() => io.callback([{ target: el, isIntersecting: true, ... }], io));
    // and then assert result.current === 'projects'.
    expect(result.current).toBeDefined();
  });
});
