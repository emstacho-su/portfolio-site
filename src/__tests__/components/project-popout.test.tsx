import { describe, it, expect, vi } from 'vitest';

/**
 * R-27 / D-16: The project pop-out is an accessible Base UI Dialog:
 * opens on trigger, ESC closes, `onOpenChange` fires, and focus returns to the
 * trigger on close.
 *
 * The component (`@/components/projects/project-popout`) is created in Wave 3
 * and does not exist yet, so a static import would crash collection. The real
 * assertions live in a `describe.skip` block that dynamically imports the
 * component (never evaluated while skipped), keeping the Wave 0 baseline GREEN
 * and the suite discoverable via `npx vitest list`. Wave 3 flips
 * `describe.skip` -> `describe` once the component lands. Confirmed Base UI
 * import scope for Wave 3: `@base-ui/react/dialog` (resolved A2 at install).
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

describe('ProjectPopout (R-27)', () => {
  it('is enumerated by vitest list even before the component exists', () => {
    expect(true).toBe(true);
  });
});

// Unskip in Wave 3 once src/components/projects/project-popout.tsx exists, and
// replace the indirected import below with a real static
// `import { ProjectPopout } from '@/components/projects/project-popout'`.
// NOTE: the specifier is held in a variable (not a string literal) so Vite's
// transform-time import analysis does NOT resolve the not-yet-created module;
// a plain `await import('@/components/projects/project-popout')` crashes
// COLLECTION, not just the test, defeating `describe.skip`. The block is
// skipped, so this runtime import never executes in Wave 0.
const POPOUT_MODULE = '@/components/projects/project-popout';
describe.skip('ProjectPopout dialog a11y (Wave 3)', () => {
  it('opens on trigger, closes on ESC, fires onOpenChange, returns focus', async () => {
    const { render, screen, fireEvent, waitFor } = await import('@testing-library/react');
    const { ProjectPopout } = (await import(/* @vite-ignore */ POPOUT_MODULE)) as {
      ProjectPopout: (props: { onOpenChange: (open: boolean) => void }) => JSX.Element;
    };

    const onOpenChange = vi.fn();
    render(
      // Wave 3 wires the real props (project payload, open, onOpenChange).
      // The flow mirrors ArchitectureTab.test.tsx:78-86:
      //   click trigger -> waitFor aria-expanded/open
      //   fireEvent.keyDown(dialog, { key: 'Escape' }) -> waitFor closed
      //   expect(onOpenChange).toHaveBeenCalled()
      //   expect(document.activeElement).toBe(trigger)  // focus-return
      <ProjectPopout onOpenChange={onOpenChange} />
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    expect(document.activeElement).toBe(trigger);
  });
});
