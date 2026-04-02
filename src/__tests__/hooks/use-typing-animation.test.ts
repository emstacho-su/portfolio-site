import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypingAnimation } from '@/hooks/use-typing-animation';

describe('useTypingAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with empty display text', () => {
    const { result } = renderHook(() =>
      useTypingAnimation({ text: 'Hello', startDelay: 0 })
    );
    expect(result.current.displayText).toBe('');
  });

  it('shows full text after typing completes', () => {
    const text = 'Hi';
    const { result } = renderHook(() =>
      useTypingAnimation({ text, speed: 10, startDelay: 0 })
    );

    // Advance past start delay + typing time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.displayText).toBe(text);
    expect(result.current.isComplete).toBe(true);
  });

  it('shows full text immediately when reduced motion is preferred', () => {
    // Mock reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() =>
      useTypingAnimation({ text: 'Full text immediately' })
    );

    expect(result.current.displayText).toBe('Full text immediately');
    expect(result.current.isComplete).toBe(true);

    // Reset matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('toggles cursor visibility', () => {
    const { result } = renderHook(() =>
      useTypingAnimation({ text: 'Test', startDelay: 0 })
    );

    const initialVisibility = result.current.cursorVisible;

    act(() => {
      vi.advanceTimersByTime(530);
    });

    expect(result.current.cursorVisible).toBe(!initialVisibility);
  });
});
