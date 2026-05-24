import { describe, it, vi } from 'vitest';

/**
 * R-30 / D-23: Animated components render their final state (no inline
 * `transition:` style, no autoplay) under `prefers-reduced-motion: reduce`.
 *
 * The components this asserts over (project-panel, project-popout, demo-section,
 * hero grid, harness) are built in Waves 3-4 and do not exist yet. To keep the
 * Wave 0 baseline GREEN (Task 1's green-baseline assertion), the concrete cases
 * are `it.todo` placeholders documenting the contract; the suite is discoverable
 * via `npx vitest list` and turns red only when a wave wires real assertions.
 *
 * The mockMatchMedia(reducedMotion) helper below is copied VERBATIM from
 * src/__tests__/components/ArchitectureTab.test.tsx (which is DELETED in Wave 2),
 * so the reduced-motion idiom is preserved here for the new tests.
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

// Referenced so the verbatim helper is retained and lint does not flag it as
// unused while the concrete cases are still `it.todo`.
void mockMatchMedia;

describe('reduced-motion short-circuit (R-30)', () => {
  it.todo(
    'project-panel renders final state with no inline transition under reduce (Wave 3)'
  );
  it.todo(
    'project-popout demo entrance short-circuits under reduce (Wave 3)'
  );
  it.todo(
    'demo-section shows poster and does not autoplay under reduce (Wave 4)'
  );
  it.todo(
    'hero grid skips animation under reduce (Wave 4)'
  );
});
