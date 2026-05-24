import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Harness } from '@/components/sections/harness';

/**
 * R-28 / D-18: The Harness section renders six capability pillars (replacing the
 * old tab UI) per REDESIGN-SPEC §4.4.
 *
 * Wave 2 flipped this on: `@/components/sections/harness` now exists, so the
 * section is imported statically and the previously-skipped assertions run. The
 * old HarnessTabs.test.tsx / ArchitectureTab.test.tsx were deleted in Wave 1
 * (their mockMatchMedia helper was preserved here per the Wave 0 contract).
 *
 * The mockMatchMedia helper is copied VERBATIM from the deleted
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

describe('Harness renders six pillars (Wave 2)', () => {
  it('renders each of the six pillar headlines', () => {
    mockMatchMedia(false);
    render(<Harness />);
    for (const pillar of SIX_PILLARS) {
      expect(screen.getByText(new RegExp(pillar, 'i'))).toBeInTheDocument();
    }
  });

  it('does not render the old tab UI', () => {
    render(<Harness />);
    // No accordion/tab triggers from the retired ArchitectureTab UI.
    const tabTriggers = screen
      .queryAllByRole('button')
      .filter((b) => (b.getAttribute('aria-controls') ?? '').startsWith('layer-detail-'));
    expect(tabTriggers).toHaveLength(0);
  });
});
