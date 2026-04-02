import { describe, it, expect } from 'vitest';
import { analyticsEventSchema } from '@/lib/analytics/types';

describe('analyticsEventSchema', () => {
  it('accepts a valid page_view event', () => {
    const result = analyticsEventSchema.safeParse({
      event_type: 'page_view',
      session_id: 'abc-123',
      pathname: '/',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid project_click event with target', () => {
    const result = analyticsEventSchema.safeParse({
      event_type: 'project_click',
      event_target: 'gto-poker-trainer',
      session_id: 'abc-123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an unknown event_type', () => {
    const result = analyticsEventSchema.safeParse({
      event_type: 'unknown_event',
      session_id: 'abc-123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a missing session_id', () => {
    const result = analyticsEventSchema.safeParse({
      event_type: 'page_view',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty session_id', () => {
    const result = analyticsEventSchema.safeParse({
      event_type: 'page_view',
      session_id: '',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid event types', () => {
    const types = ['page_view', 'project_click', 'resume_download', 'contact_click'];
    for (const type of types) {
      const result = analyticsEventSchema.safeParse({
        event_type: type,
        session_id: 'test-session',
      });
      expect(result.success).toBe(true);
    }
  });

  it('allows optional fields to be omitted', () => {
    const result = analyticsEventSchema.safeParse({
      event_type: 'page_view',
      session_id: 'test-session',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.event_target).toBeUndefined();
      expect(result.data.referrer).toBeUndefined();
      expect(result.data.user_agent).toBeUndefined();
      expect(result.data.pathname).toBeUndefined();
    }
  });
});
