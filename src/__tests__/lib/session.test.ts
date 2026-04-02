import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSessionId } from '@/lib/analytics/session';

describe('getSessionId', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('generates a new session ID when none exists', () => {
    const id = getSessionId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('returns the same session ID on subsequent calls', () => {
    const first = getSessionId();
    const second = getSessionId();
    expect(first).toBe(second);
  });

  it('stores the session ID in sessionStorage', () => {
    const id = getSessionId();
    expect(sessionStorage.getItem('portfolio_session_id')).toBe(id);
  });
});
