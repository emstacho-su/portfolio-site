import { describe, it, expect, vi } from 'vitest';

/**
 * R-28 / D-18: The Harness section renders six capability pillars (replacing the
 * old tab UI) per REDESIGN-SPEC §4.4.
 *
 * The section (`@/components/sections/harness`) is created in Wave 2 and does
 * not exist yet, so a static import would crash collection. The real assertions
 * live in a `describe.skip` block that dynamically imports the section (never
 * evaluated while skipped), keeping the Wave 0 baseline GREEN and the suite
 * discoverable via `npx vitest list`. Wave 2 flips `describe.skip` -> `describe`
 * once the section lands and (per VALIDATION.md) the old HarnessTabs.test.tsx /
 * ArchitectureTab.test.tsx are deleted.
 *
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

const SIX_PILLARS = [
  'Second Brain as RAG',
  'GSD Workflow',
  'Multi-Agent Research',
  'Sub-Agent Execution',
  'Context Engineering',
  'Guardrails',
];

describe('Harness section (R-28)', () => {
  it('expects exactly six pillars', () => {
    // Pins the contract for Wave 2 even before the component exists.
    expect(SIX_PILLARS).toHaveLength(6);
  });
});

// Unskip in Wave 2 once src/components/sections/harness.tsx exists, and replace
// the indirected imports below with a real static
// `import { Harness } from '@/components/sections/harness'`.
// NOTE: the specifier is held in a variable (not a string literal) so Vite's
// transform-time import analysis does NOT resolve the not-yet-created module;
// a plain `await import('@/components/sections/harness')` crashes COLLECTION,
// not just the test, defeating `describe.skip`. The block is skipped, so this
// runtime import never executes in Wave 0.
const HARNESS_MODULE = '@/components/sections/harness';
describe.skip('Harness renders six pillars (Wave 2)', () => {
  it('renders each of the six pillar headlines', async () => {
    mockMatchMedia(false);
    const { render, screen } = await import('@testing-library/react');
    const { Harness } = (await import(/* @vite-ignore */ HARNESS_MODULE)) as {
      Harness: () => JSX.Element;
    };

    render(<Harness />);
    for (const pillar of SIX_PILLARS) {
      expect(screen.getByText(new RegExp(pillar, 'i'))).toBeInTheDocument();
    }
  });

  it('does not render the old tab UI', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { Harness } = (await import(/* @vite-ignore */ HARNESS_MODULE)) as {
      Harness: () => JSX.Element;
    };

    render(<Harness />);
    // No accordion/tab triggers from the retired ArchitectureTab UI.
    const tabTriggers = screen
      .queryAllByRole('button')
      .filter((b) => (b.getAttribute('aria-controls') ?? '').startsWith('layer-detail-'));
    expect(tabTriggers).toHaveLength(0);
  });
});
