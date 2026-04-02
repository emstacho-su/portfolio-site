import { z } from 'zod';

export const eventTypes = [
  'page_view',
  'project_click',
  'resume_download',
  'contact_click',
] as const;

export const analyticsEventSchema = z.object({
  event_type: z.enum(eventTypes),
  event_target: z.string().optional(),
  referrer: z.string().optional(),
  user_agent: z.string().optional(),
  session_id: z.string().min(1),
  pathname: z.string().optional(),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
