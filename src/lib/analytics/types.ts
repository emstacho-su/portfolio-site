import { z } from 'zod';

export const eventTypes = [
  'page_view',
  'project_click',
  'resume_download',
  'contact_click',
  // section_view is a backward-compatible enum extension (D-05): all four
  // legacy events still validate; event_target carries the section id.
  'section_view',
] as const;

// V5 hardening (threat T-02-08): event_target is a short identifier (a section
// id, project slug, or contact type), never free-form user text. Cap its length
// so oversized or junk targets are rejected before they reach Supabase.
const EVENT_TARGET_MAX = 100;

export const analyticsEventSchema = z.object({
  event_type: z.enum(eventTypes),
  event_target: z.string().max(EVENT_TARGET_MAX).optional(),
  referrer: z.string().optional(),
  user_agent: z.string().optional(),
  session_id: z.string().min(1),
  pathname: z.string().optional(),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
