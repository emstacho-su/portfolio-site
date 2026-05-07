import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { HarnessTabs, TAB_DEFS } from '@/app/harness/_components/HarnessTabs';

// Render helper that supplies a minimal panel for every tab id.
function renderWithStubs() {
  const panels = Object.fromEntries(
    TAB_DEFS.map((t) => [
      t.id,
      <div key={t.id} data-testid={`panel-${t.id}`}>
        {t.label} body
      </div>,
    ])
  ) as Parameters<typeof HarnessTabs>[0]['panels'];
  return render(<HarnessTabs panels={panels} />);
}

describe('HarnessTabs', () => {
  beforeEach(() => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string): MediaQueryList =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all 6 tabs in order', () => {
    renderWithStubs();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(TAB_DEFS.length);
    TAB_DEFS.forEach((def, i) => {
      expect(tabs[i]).toHaveTextContent(def.label);
    });
  });

  it('makes the first tab (arch) active by default', () => {
    renderWithStubs();
    const archTab = screen.getByRole('tab', { name: /Architecture/ });
    expect(archTab.getAttribute('aria-selected')).toBe('true');
    expect(archTab.getAttribute('tabindex')).toBe('0');

    // Architecture panel visible; others hidden.
    const archPanel = screen.getByTestId('panel-arch').closest('[role="tabpanel"]');
    expect(archPanel?.hasAttribute('hidden')).toBe(false);

    const hooksPanel = screen.getByTestId('panel-hooks').closest('[role="tabpanel"]');
    expect(hooksPanel?.hasAttribute('hidden')).toBe(true);
  });

  it('switches the active tab on click', () => {
    renderWithStubs();
    const hooksTab = screen.getByRole('tab', { name: /Hooks Pipeline/ });
    fireEvent.click(hooksTab);

    expect(hooksTab.getAttribute('aria-selected')).toBe('true');
    expect(hooksTab.getAttribute('tabindex')).toBe('0');

    const archTab = screen.getByRole('tab', { name: /Architecture/ });
    expect(archTab.getAttribute('aria-selected')).toBe('false');
    expect(archTab.getAttribute('tabindex')).toBe('-1');

    // Hooks panel visible; arch hidden.
    const hooksPanel = screen.getByTestId('panel-hooks').closest('[role="tabpanel"]');
    expect(hooksPanel?.hasAttribute('hidden')).toBe(false);
    const archPanel = screen.getByTestId('panel-arch').closest('[role="tabpanel"]');
    expect(archPanel?.hasAttribute('hidden')).toBe(true);
  });

  it('cycles forward with ArrowRight', () => {
    renderWithStubs();
    const archTab = screen.getByRole('tab', { name: /Architecture/ });
    archTab.focus();
    fireEvent.keyDown(archTab, { key: 'ArrowRight' });

    const hooksTab = screen.getByRole('tab', { name: /Hooks Pipeline/ });
    expect(hooksTab.getAttribute('aria-selected')).toBe('true');
  });

  it('cycles backward with ArrowLeft (wraps from first to last)', () => {
    renderWithStubs();
    const archTab = screen.getByRole('tab', { name: /Architecture/ });
    archTab.focus();
    fireEvent.keyDown(archTab, { key: 'ArrowLeft' });

    const lastTab = screen.getByRole('tab', { name: /GSD Workflow/ });
    expect(lastTab.getAttribute('aria-selected')).toBe('true');
  });

  it('Home/End jump to the first/last tab', () => {
    renderWithStubs();
    const archTab = screen.getByRole('tab', { name: /Architecture/ });
    archTab.focus();

    fireEvent.keyDown(archTab, { key: 'End' });
    expect(screen.getByRole('tab', { name: /GSD Workflow/ }).getAttribute('aria-selected')).toBe(
      'true'
    );

    const gsdTab = screen.getByRole('tab', { name: /GSD Workflow/ });
    fireEvent.keyDown(gsdTab, { key: 'Home' });
    expect(screen.getByRole('tab', { name: /Architecture/ }).getAttribute('aria-selected')).toBe(
      'true'
    );
  });

  it('renders the count badge from TAB_DEFS', () => {
    renderWithStubs();
    const archTab = screen.getByRole('tab', { name: /Architecture/ });
    expect(within(archTab).getByText('10 layers')).toBeInTheDocument();
  });
});
