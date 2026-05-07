import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ArchitectureDiagram } from '@/app/harness/_components/ArchitectureDiagram';
import { layers } from '@/data/harness';

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

// The aside that hosts the active layer's description is decorated with
// Tailwind's `hidden md:block`. jsdom does not evaluate media queries, so the
// aside is permanently `display: none` in tests. RTL hides display:none from
// queries by default — pass `hidden: true` to include it.
function getDetailsAside(): HTMLElement {
  return screen.getByRole('region', { name: 'Layer details', hidden: true });
}

describe('ArchitectureDiagram', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('with default motion settings', () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it('renders all 10 layers from the data model', () => {
      render(<ArchitectureDiagram layers={layers} />);
      // getAllByRole('listitem') would include badge <li> children inside
      // each layer; filter to layer rows by their aria-label pattern.
      const items = screen.getAllByLabelText(/^Layer \d+:/);
      expect(items).toHaveLength(10);
    });

    it('gives each layer an aria-label matching the "Layer N: name" pattern', () => {
      render(<ArchitectureDiagram layers={layers} />);
      const labelled = screen.getAllByLabelText(/^Layer \d+:/);
      expect(labelled).toHaveLength(10);
      expect(
        screen.getByLabelText(`Layer ${layers[0].index}: ${layers[0].name}`)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(
          `Layer ${layers[layers.length - 1].index}: ${
            layers[layers.length - 1].name
          }`
        )
      ).toBeInTheDocument();
    });

    it('starts with no layer marked aria-current="true"', () => {
      render(<ArchitectureDiagram layers={layers} />);
      const items = screen.getAllByRole('listitem');
      for (const item of items) {
        expect(item.getAttribute('aria-current')).not.toBe('true');
      }
    });

    it('marks a layer aria-current="true" after focus and reveals its description', async () => {
      render(<ArchitectureDiagram layers={layers} />);
      const target = layers[3];
      const item = screen.getByLabelText(`Layer ${target.index}: ${target.name}`);

      fireEvent.focus(item);

      await waitFor(() => {
        expect(item.getAttribute('aria-current')).toBe('true');
      });

      // The aside content swaps from hint → layer details via AnimatePresence;
      // wait for the swap to settle, then assert the layer's one-liner is
      // present in the aside's text content.
      const aside = getDetailsAside();
      await waitFor(() => {
        expect(aside.textContent ?? '').toContain(target.oneLiner);
      });
    });
  });

  describe('with prefers-reduced-motion: reduce', () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it('reveals the description without inline transition/transform styles on the motion container', async () => {
      render(<ArchitectureDiagram layers={layers} />);
      const target = layers[2];
      const item = screen.getByLabelText(`Layer ${target.index}: ${target.name}`);

      fireEvent.focus(item);

      const aside = getDetailsAside();
      await waitFor(() => {
        expect(aside.textContent ?? '').toContain(target.oneLiner);
      });

      // Reduced-motion path: Motion's `transition: { duration: 0 }` should
      // remove the CSS transition declaration entirely. (We don't assert on
      // `transform` — Motion uses transforms for resting position too, not
      // only animation.)
      const motionChild = aside.querySelector('div');
      const inlineStyle = motionChild?.getAttribute('style') ?? '';
      expect(inlineStyle).not.toMatch(/transition\s*:/i);
    });
  });
});
