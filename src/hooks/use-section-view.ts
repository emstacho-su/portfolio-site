'use client';

import { useEffect, useRef } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

/**
 * Fires a `section_view` analytics event exactly once per section the first time
 * it scrolls into view (R-17 / D-05). It is layout-driven (IntersectionObserver
 * over the section elements by id), mirroring `useScrollspy`, so it needs NO
 * reduced-motion gate.
 *
 * The fire-once guard is a `Set` of already-fired ids held in a ref, mirroring
 * the `hasFiredPageView` idiom in `use-analytics`. A re-intersection of an id
 * that already fired is ignored, so each section emits exactly one event for the
 * lifetime of the mount. The observer is disconnected on cleanup (S-4).
 *
 * Threshold is `0.3`: a section is "viewed" once roughly a third of it is in the
 * viewport, which avoids firing on a 1px sliver while still firing well before
 * the section is fully scrolled past. The shape passes only a short section-id
 * string to `trackSectionView`, preserving the bounded /api/analytics contract.
 *
 * @param ids       section element ids to observe, in DOM order
 * @param threshold IntersectionObserver visibility ratio that counts as "viewed"
 */
export function useSectionView(ids: string[], threshold = 0.3): void {
  const { trackSectionView } = useAnalytics();
  const firedRef = useRef<Set<string>>(new Set());

  // ids is an array literal from the caller; join into a stable dependency so
  // the observer is rebuilt only when the id set actually changes.
  const key = ids.join(',');

  useEffect(() => {
    if (ids.length === 0) return;

    const fired = firedRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !fired.has(id)) {
            fired.add(id);
            trackSectionView(id);
          }
        }
      },
      { threshold }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, threshold]);
}
