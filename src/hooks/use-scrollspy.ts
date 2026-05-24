'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks which in-page section is currently active and returns its id, for the
 * anchor-nav active state (R-14 / D-02). It is layout-driven (IntersectionObserver
 * over the section elements), so it needs NO reduced-motion gate.
 *
 * The default rootMargin (`-45% 0px -45% 0px`) shrinks the observation band to a
 * thin strip across the vertical center, so "active" means "this section crosses
 * the middle of the viewport," which feels correct for full-viewport sections.
 *
 * @param ids        section element ids to observe, in DOM order
 * @param rootMargin IntersectionObserver rootMargin (override for tuning)
 * @returns the id of the most-intersecting section (defaults to the first id)
 */
export function useScrollspy(
  ids: string[],
  rootMargin = '-45% 0px -45% 0px'
): string {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  // ids is an array literal from the caller; join into a stable dependency so
  // the observer is rebuilt only when the id set actually changes.
  const key = ids.join(',');

  useEffect(() => {
    if (ids.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the intersecting entry with the highest visible ratio. If none
        // intersect (e.g. between sections), keep the last active id.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 1] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rootMargin]);

  return active;
}
