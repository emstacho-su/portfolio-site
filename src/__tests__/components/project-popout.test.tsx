import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectPopout } from '@/components/projects/project-popout';

/**
 * R-27 / D-16: The project pop-out is an accessible Base UI Dialog:
 * opens on trigger, ESC closes, `onOpenChange` fires, and focus returns to the
 * trigger on close.
 *
 * Wave 3 landed src/components/projects/project-popout.tsx, so this flips from
 * the Wave 0 describe.skip scaffold to a real, executing assertion. The pop-out
 * runs uncontrolled here (no `open` prop), so it renders its own Dialog.Trigger
 * button; Base UI provides the focus trap, ESC handling, scroll lock, and focus
 * return natively.
 *
 * The mockMatchMedia helper is copied VERBATIM from the deleted
 * ArchitectureTab.test.tsx and retained per the Wave 0 contract.
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

describe('ProjectPopout (R-27)', () => {
  it('is enumerated by vitest list even before the component exists', () => {
    expect(true).toBe(true);
  });
});

describe('ProjectPopout dialog a11y (Wave 3)', () => {
  it('opens on trigger, closes on ESC, fires onOpenChange, returns focus', async () => {
    const onOpenChange = vi.fn();
    render(<ProjectPopout onOpenChange={onOpenChange} />);

    const trigger = screen.getByRole('button', { name: /see more/i });
    fireEvent.click(trigger);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));

    // The dialog is now open and focus has moved inside it. ESC closes it.
    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: 'Escape',
    });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));

    // Base UI restores focus to the element that opened the dialog (D-16).
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
