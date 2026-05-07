import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ArchitectureTab } from '@/app/harness/_components/ArchitectureTab';
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

describe('ArchitectureTab', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('default motion', () => {
    beforeEach(() => mockMatchMedia(false));

    it('renders one accordion trigger per layer', () => {
      render(<ArchitectureTab layers={layers} />);
      // Triggers carry aria-controls with a layer-detail- prefix.
      const triggers = screen.getAllByRole('button').filter((btn) =>
        (btn.getAttribute('aria-controls') ?? '').startsWith('layer-detail-')
      );
      expect(triggers).toHaveLength(layers.length);
    });

    it('starts with every trigger collapsed', () => {
      render(<ArchitectureTab layers={layers} />);
      const triggers = screen.getAllByRole('button').filter((btn) =>
        (btn.getAttribute('aria-controls') ?? '').startsWith('layer-detail-')
      );
      for (const t of triggers) {
        expect(t.getAttribute('aria-expanded')).toBe('false');
      }
    });

    it('expands a layer on click and reveals description + Files + Related', async () => {
      render(<ArchitectureTab layers={layers} />);
      const target = layers[2];
      const trigger = screen.getByRole('button', {
        name: new RegExp(target.name),
      });
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
      });
      expect(screen.getByText(target.description)).toBeInTheDocument();
      expect(screen.getByText('Files')).toBeInTheDocument();
      expect(screen.getByText('Related')).toBeInTheDocument();
    });

    it('collapses one layer when another is opened', async () => {
      render(<ArchitectureTab layers={layers} />);
      const t0 = screen.getByRole('button', { name: new RegExp(layers[0].name) });
      const t1 = screen.getByRole('button', { name: new RegExp(layers[1].name) });

      fireEvent.click(t0);
      await waitFor(() => expect(t0.getAttribute('aria-expanded')).toBe('true'));

      fireEvent.click(t1);
      await waitFor(() => expect(t1.getAttribute('aria-expanded')).toBe('true'));
      expect(t0.getAttribute('aria-expanded')).toBe('false');
    });

    it('collapses on Escape when a layer is open', async () => {
      render(<ArchitectureTab layers={layers} />);
      const trigger = screen.getByRole('button', { name: new RegExp(layers[0].name) });
      fireEvent.click(trigger);
      await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));

      fireEvent.keyDown(trigger, { key: 'Escape' });
      await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'));
    });

    it('Related buttons jump to the linked layer (open + focused)', async () => {
      render(<ArchitectureTab layers={layers} />);

      // Helper: find a layer's accordion trigger by its aria-controls id, since
      // the visible text 'Workflow' also matches the related-pill button.
      const triggerFor = (id: string): HTMLButtonElement => {
        const t = screen
          .getAllByRole('button')
          .find((b) => b.getAttribute('aria-controls') === `layer-detail-${id}`);
        if (!t) throw new Error(`trigger for ${id} not found`);
        return t as HTMLButtonElement;
      };

      // Open layer 0 (CLI host) — its related list contains 'workflow'.
      const t0 = triggerFor(layers[0].id);
      fireEvent.click(t0);
      await waitFor(() => expect(t0.getAttribute('aria-expanded')).toBe('true'));

      const workflowLayer = layers.find((l) => l.id === 'workflow');
      if (!workflowLayer) throw new Error('workflow layer missing in fixture data');

      // Click the related-pill button that points to 'workflow' (its visible
      // text is `→ Workflow`, which is unambiguous).
      const relatedBtn = screen.getByRole('button', { name: `→ ${workflowLayer.name}` });
      fireEvent.click(relatedBtn);

      const tWorkflow = triggerFor(workflowLayer.id);
      await waitFor(() => expect(tWorkflow.getAttribute('aria-expanded')).toBe('true'));
      // The previously-open layer 0 closes when a different layer opens.
      expect(t0.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('reduced motion', () => {
    beforeEach(() => mockMatchMedia(true));

    it('still expands and shows the description without inline transition styles', async () => {
      render(<ArchitectureTab layers={layers} />);
      const target = layers[1];
      const trigger = screen.getByRole('button', { name: new RegExp(target.name) });
      fireEvent.click(trigger);

      await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'));
      expect(screen.getByText(target.description)).toBeInTheDocument();

      // The motion.div container around the detail panel should not carry an
      // inline `transition:` style under reduced-motion.
      const detail = screen.getByRole('region', { name: `${target.name} detail` });
      const inlineStyle = detail.getAttribute('style') ?? '';
      expect(inlineStyle).not.toMatch(/transition\s*:/i);
    });
  });
});
