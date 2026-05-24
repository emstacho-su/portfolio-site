'use client';

import { useEffect, useCallback, useRef } from 'react';
import { getSessionId } from '@/lib/analytics/session';
import type { AnalyticsEvent } from '@/lib/analytics/types';

type EventType = AnalyticsEvent['event_type'];

export function useAnalytics() {
  const sessionIdRef = useRef<string>('');
  const hasFiredPageView = useRef(false);

  // Declared before the mount effect that uses it so the reference is valid at
  // call time (react-hooks/immutability). Stable across renders ([] deps), so
  // including it in the effect deps below keeps the effect mount-once.
  const sendEvent = useCallback(
    (eventType: EventType, eventTarget?: string) => {
      const payload: AnalyticsEvent = {
        event_type: eventType,
        event_target: eventTarget,
        referrer:
          typeof document !== 'undefined' ? document.referrer || undefined : undefined,
        user_agent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        session_id: sessionIdRef.current || 'unknown',
        pathname:
          typeof window !== 'undefined' ? window.location.pathname : undefined,
      };

      // Fire and forget — analytics should never block UI
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Silently fail — analytics is non-critical
      });
    },
    []
  );

  useEffect(() => {
    sessionIdRef.current = getSessionId();

    // Fire page_view once on mount. The ref guard makes this idempotent even if
    // the effect re-runs (sendEvent is stable, so in practice it runs once).
    if (!hasFiredPageView.current) {
      hasFiredPageView.current = true;
      sendEvent('page_view');
    }
  }, [sendEvent]);

  const trackProjectClick = useCallback(
    (projectId: string) => {
      sendEvent('project_click', projectId);
    },
    [sendEvent]
  );

  const trackResumeDownload = useCallback(() => {
    sendEvent('resume_download');
  }, [sendEvent]);

  const trackContactClick = useCallback(
    (contactType: string) => {
      sendEvent('contact_click', contactType);
    },
    [sendEvent]
  );

  const trackSectionView = useCallback(
    (sectionId: string) => {
      sendEvent('section_view', sectionId);
    },
    [sendEvent]
  );

  return {
    trackProjectClick,
    trackResumeDownload,
    trackContactClick,
    trackSectionView,
  };
}
