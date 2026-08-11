import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  hasReducedMotionListener,
  prefersReducedMotion,
} from 'motion-dom';
import { ProjectPanel } from '@/components/projects/project-panel';
import { DemoSection } from '@/components/projects/demo-section';
import { AboutSection } from '@/components/sections/about';
import type { Project, DemoSection as DemoSectionData } from '@/data/projects';

/**
 * R-30 / D-23: Every new animation across the phase short-circuits under
 * `prefers-reduced-motion: reduce`. This audit renders the animated components
 * that carry a React-side reduced-motion gate and asserts each renders its
 * final, visible state with no inline `transition`/transform/opacity animation
 * style and no autoplay-driving behavior.
 *
 * Coverage map (the phase's new animations):
 * - project-panel (Wave 3, 02-05; reveal reworked in 02.1): motion `whileInView`
 *   entrance on the grid container, gated by `useReducedMotion()` (initial=false
 *   / no whileInView under reduce). The inner [data-animate] markers stay plain,
 *   so under reduce no [data-animate] child carries an inline
 *   transform/opacity/transition. ASSERTED HERE.
 * - demo-section (Wave 3/4, 02-05): in-view <video> autoplay via
 *   useInViewVideo; under reduce the `src` is omitted (poster only) and the
 *   IntersectionObserver is never created. ASSERTED HERE.
 * - about SlideBlock (Wave 1/3): scroll-linked motion `style` is set to
 *   `undefined` under reduce. Included as a regression anchor. ASSERTED HERE.
 * - hero compile sequence + harness stagger: gated via the AnimationProvider
 *   MotionConfig / session + matchMedia checks; their final-state behavior is
 *   covered by their own component contracts and the manual Wave 5 gate.
 * - thermodynamic hero grid (interactive-thermodynamic-grid.tsx): its
 *   reduced-motion guard short-circuits the pointer rAF loop. It is a <canvas>
 *   rAF animation and jsdom has no canvas/rAF heat loop, so it is NOT asserted
 *   in this RTL test; its guard is verified by code review (the
 *   `matchMedia('(prefers-reduced-motion: reduce)')` early-return on the
 *   pointer handlers) and the manual Wave 5 visual gate.
 *
 * The mockMatchMedia(reducedMotion) helper below preserves the VERBATIM idiom
 * from src/__tests__/components/ArchitectureTab.test.tsx (deleted in Wave 2),
 * widened to also match the bare `(prefers-reduced-motion)` query that
 * motion/react's `useReducedMotion()` reads (it does NOT use the `: reduce`
 * form). Both forms must report `matches` so the GSAP-gated panel and the
 * motion-gated SlideBlock short-circuit identically. motion caches the
 * preference at module scope on first read, so `resetMotionReducedMotionCache()`
 * runs before each test to force a fresh read against the current spy.
 */
function isReducedMotionQuery(query: string): boolean {
  return query.includes('prefers-reduced-motion');
}

function mockMatchMedia(reducedMotion: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string): MediaQueryList =>
      ({
        matches: reducedMotion && isReducedMotionQuery(query),
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

// motion-dom caches the reduced-motion preference in module-scoped state the
// first time useReducedMotion() runs and never re-reads matchMedia after. Reset
// that cache so each test's mockMatchMedia value is honored on the next render.
function resetMotionReducedMotionCache(): void {
  hasReducedMotionListener.current = false;
  prefersReducedMotion.current = null;
}

const PROJECT_FIXTURE: Project = {
  id: 'rm-fixture',
  slug: 'rm-fixture',
  title: 'Reduced Motion Fixture',
  hook: 'A fixture project for the reduced-motion audit.',
  overview: 'Overview paragraph for the reduced-motion audit fixture project.',
  summary: ['Case-study paragraph for the reduced-motion audit fixture.'],
  period: 'Jan 2026 to Feb 2026',
  tech: ['TypeScript', 'React'],
  status: 'shipped',
  links: { repo: 'https://example.com/repo', live: 'https://example.com' },
  heroImage: '/projects/rm-fixture/hero.png',
  demos: [],
  resumeBullets: ['Compact resume line for the reduced-motion audit fixture.'],
};

const VIDEO_DEMO: DemoSectionData = {
  type: 'video',
  src: '/projects/rm-fixture/demo.mp4',
  poster: '/projects/rm-fixture/poster.png',
  caption: 'Demo clip',
  body: 'Explanatory copy for the demo clip.',
};

// An inline `transition`/transform/opacity style would mean the component is
// animating rather than rendering its committed final state.
function hasInlineMotionStyle(el: HTMLElement): boolean {
  const s = el.style;
  return Boolean(
    s.transition || s.transform || s.opacity || s.animation || s.animationName
  );
}

beforeEach(() => {
  resetMotionReducedMotionCache();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  resetMotionReducedMotionCache();
});

describe('reduced-motion short-circuit (R-30 / D-23)', () => {
  it('project-panel renders final state with no inline transition under reduce', () => {
    mockMatchMedia(true);
    const onOpen = vi.fn();
    const { container } = render(
      <ProjectPanel project={PROJECT_FIXTURE} onOpen={onOpen} />
    );

    // The content is present (final, visible state), not hidden behind an
    // entrance animation.
    expect(
      screen.getByRole('heading', { name: PROJECT_FIXTURE.title })
    ).toBeInTheDocument();
    expect(screen.getByText(PROJECT_FIXTURE.hook)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /see more about the .* case study/i })
    ).toBeInTheDocument();

    // Under reduce, the panel renders without motion (initial=false, no
    // whileInView): no [data-animate] child carries an inline
    // transform/opacity/transition that would imply motion.
    const animated = container.querySelectorAll<HTMLElement>('[data-animate]');
    expect(animated.length).toBeGreaterThan(0);
    for (const el of Array.from(animated)) {
      expect(hasInlineMotionStyle(el)).toBe(false);
    }
  });

  it('demo-section shows poster and omits the video src (no autoplay) under reduce', () => {
    mockMatchMedia(true);
    const { container } = render(<DemoSection demo={VIDEO_DEMO} />);

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    // Under reduce the src is omitted so only the poster shows and nothing
    // autoplays / fetches the clip (D-23 / D-16).
    expect(video?.getAttribute('src')).toBeNull();
    expect(video?.getAttribute('poster')).toBe(VIDEO_DEMO.poster);
    // The in-view autoplay observer is gated off under reduce.
    expect(video?.getAttribute('autoplay')).toBeNull();
    // The caption / body still render their final state.
    expect(screen.getByText(VIDEO_DEMO.caption)).toBeInTheDocument();
    expect(screen.getByText(VIDEO_DEMO.body)).toBeInTheDocument();
  });

  it('about SlideBlock renders content with no inline motion style under reduce (regression anchor)', () => {
    mockMatchMedia(true);
    const { container } = render(<AboutSection />);

    // The About heading is present (final state).
    expect(
      screen.getByRole('heading', { name: /^about$/i })
    ).toBeInTheDocument();

    // SlideBlock sets its motion `style` to undefined under reduce, so no
    // wrapper carries an inline transform/opacity/transition.
    const motionDivs = Array.from(
      container.querySelectorAll<HTMLElement>('div')
    );
    const motionStyled = motionDivs.filter(hasInlineMotionStyle);
    expect(motionStyled).toHaveLength(0);
  });
});

describe('animations remain wired under no-reduce (R-30 control)', () => {
  it('demo-section keeps the video src wired when motion is allowed', () => {
    mockMatchMedia(false);
    const { container } = render(<DemoSection demo={VIDEO_DEMO} />);

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    // Without reduce the real source is wired so the in-view hook can autoplay
    // it (the IntersectionObserver timing itself is not asserted here).
    expect(video?.getAttribute('src')).toBe(VIDEO_DEMO.src);
    expect(video?.getAttribute('poster')).toBe(VIDEO_DEMO.poster);
  });

  it('project-panel still renders all content when motion is allowed', () => {
    mockMatchMedia(false);
    const onOpen = vi.fn();
    const { container } = render(
      <ProjectPanel project={PROJECT_FIXTURE} onOpen={onOpen} />
    );

    // Under no-reduce, motion applies the container's initial { opacity: 0 } and
    // whileInView never fires in jsdom (no IntersectionObserver intersection),
    // so the panel sits faded but its content is still in the DOM. The title
    // appears in both the heading and the placeholder-image label, so target the
    // <h3> directly.
    const heading = container.querySelector('h3');
    expect(heading?.textContent).toBe(PROJECT_FIXTURE.title);
    expect(screen.getByText(/see more/i)).toBeInTheDocument();
  });
});
