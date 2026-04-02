import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { analyticsEventSchema } from '@/lib/analytics/types';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { error: 'Analytics not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = analyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid event data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // No-op for API routes — we don't need to set cookies for analytics
        },
      },
    });

    const { error } = await supabase.from('page_events').insert({
      event_type: parsed.data.event_type,
      event_target: parsed.data.event_target ?? null,
      referrer: parsed.data.referrer ?? null,
      user_agent: parsed.data.user_agent ?? null,
      session_id: parsed.data.session_id,
      pathname: parsed.data.pathname ?? null,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to log event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
