---
phase: 02-single-page-portfolio-redesign
plan: 05
subsystem: projects
tags: [gsap, scrolltrigger, base-ui-dialog, lenis, intersection-observer, reduced-motion, accessibility, wave-3]

# Dependency graph
requires:
  - phase: 02-02
    provides: Lenis on the shared gsap.ticker (autoRaf:false), projects anchor stub
  - phase: 02-03
    provides: extended Project model with ordered demos[] (REDESIGN-SPEC 4.3)
  - phase: 02-04
    provides: page.tsx mounting useSectionView across six ids and the real ProjectsSection
  - phase: 02-01
    provides: jsdom IntersectionObserver + HTMLMediaElement stubs; confirmed @base-ui/react/dialog import path
provides:
  - Stacked full-viewport GSAP scroll-driven project panels (ProjectPanel)
  - Accessible Base UI Dialog case-study pop-out with Lenis pause (ProjectPopout)
  - Data-driven demo sections with scroll-into-view muted video and poster fallback (DemoSection)
  - Reusable in-view muted autoplay/pause IntersectionObserver hook (useInViewVideo)
affects: [02-06, 02-07]

# Tech tracking
tech-stack:
  added: []  # all libraries already installed in Wave 0
  patterns:
    - "useGSAP({ scope, dependencies:[reduce, bootReady] }) scoped ScrollTrigger entrance with reduced-motion early-return"
    - "Base UI Dialog dual-mode component: controlled (open/project/onOpenChange) for the section, uncontrolled (own Dialog.Trigger) for the a11y test"
    - "onOpenChange wrapper strips the Base UI eventDetails arg so it fires with just the boolean"
    - "Dialog.Viewport ref captured into state and threaded as the IntersectionObserver scroller for in-dialog video autoplay"

key-files:
  created:
    - src/components/projects/project-panel.tsx
    - src/components/projects/project-popout.tsx
    - src/components/projects/demo-section.tsx
    - src/hooks/use-in-view-video.ts
  modified:
    - src/components/sections/projects.tsx
    - src/__tests__/components/project-popout.test.tsx
  deleted:
    - src/components/projects/project-card.tsx

key-decisions:
  - "ProjectPopout is dual-mode: controlled by the section (open/project/onOpenChange) and uncontrolled in standalone/test use where it renders its own Dialog.Trigger and Base UI manages open/close/focus-return"
  - "onOpenChange is wrapped to call the caller with only the boolean (Base UI passes (open, eventDetails)); this satisfies the R-27 toHaveBeenCalledWith(true|false) assertions"
  - "page.tsx required NO change: 02-04 already imported and rendered the real ProjectsSection, so useSectionView and the id=projects anchor are preserved untouched (D-01/D-02)"
  - "ScrollTrigger.refresh() is invoked at three layout-settle moments: after bootReady in each panel's useGSAP, after document.fonts.ready, and on dialog open inside a requestAnimationFrame (Pitfall 3)"
  - "Dialog.Viewport element is the native scroll container and is passed as the IntersectionObserver root for demo video autoplay so visibility is measured against the scroller, not the window (Pattern 3/5)"

requirements-completed: [R-22, R-23, R-24, R-27]

# Metrics
duration: ~20min
completed: 2026-05-24
---

# Phase 2 Plan 05: Projects System (Wave 3) Summary

**Stacked full-viewport GSAP project panels open an accessible Base UI Dialog case study composed of data-driven demo sections with scroll-into-view muted video and poster fallbacks, with Lenis paused while the pop-out is open and reduced-motion short-circuits throughout.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-05-24
- **Tasks:** 3
- **Files:** 6 changed (4 created, 2 modified, 1 deleted)

## Accomplishments

- **ProjectPanel (Task 1):** a `min-h-screen` full-viewport overview panel rendering each project's status badge, external repo/live links (`rel="noopener noreferrer"`, S-6 / T-02-11), title, hook, overview, tech badges, and an "Open case study" trigger. Entrance is a `useGSAP`-scoped `gsap.from([data-animate], { y, autoAlpha, stagger, scrollTrigger })`. Under `useReducedMotion()` the effect returns early so content stays in its final visible state (D-23). `gsap.registerPlugin(ScrollTrigger, useGSAP)` at module scope.
- **projects.tsx rewrite (Task 1):** keeps the "Projects" heading and animated rule, replaces the card grid with a vertical stack of one `<ProjectPanel>` per project, lifts `open`/`activeProject` state, renders one shared `<ProjectPopout>`, and fires `onProjectClick(project.id)` on open (S-5). The section keeps `id="projects"` as the single scroll/section-view anchor.
- **ProjectPopout (Task 2):** a single controlled `Dialog.Root` from `@base-ui/react/dialog` with `Portal > Backdrop > Viewport > Popup`, an sr-only `Dialog.Title`, and a `Dialog.Close` (`aria-label="Close case study"`). `modal` defaults to `true`, giving native focus trap, ESC, background scroll lock, and focus return to the trigger (R-27 / D-16) with no hand-rolled code. The component is dual-mode: controlled for the section, uncontrolled (own `Dialog.Trigger`) for the test.
- **Lenis pause (Task 2):** `onOpenChange(true)` calls `lenis.stop()` and `requestAnimationFrame(() => ScrollTrigger.refresh())`; `onOpenChange(false)` calls `lenis.start()` (D-12, Pitfall 5/3).
- **useInViewVideo + DemoSection (Task 3):** an IntersectionObserver hook plays a muted video on intersect, pauses on exit, accepts the Dialog Viewport as the IO `root`, always `.catch()`es the `play()` promise, skips the observer entirely under reduced motion, and disconnects on cleanup (S-4). `DemoSection` renders `<video muted playsInline loop preload="none">` for `type:'video'` (src omitted under reduced motion so only the poster shows) and a screenshot `<img>` for `type:'image'`, each in an `aspect-video` frame and each its own scroll destination with caption + body.
- **project-popout.test.tsx (Task 2):** flipped from the Wave 0 `describe.skip` scaffold to a real static-import test. It is GREEN: opens on trigger, ESC fires `onOpenChange(false)`, and focus returns to the trigger.

## How the scroller is wired and where ScrollTrigger.refresh() runs

Per the plan's output requirement:

- **Dialog Viewport as scroller:** `ProjectPopout` captures the `Dialog.Viewport` DOM element via a ref callback into React state (`setScroller`). That element is passed as the `scroller` prop to each `DemoSection`, which forwards it to `useInViewVideo` as the IntersectionObserver `root`. In-dialog video visibility is therefore measured against the native scrollable Viewport, not the window (Pattern 3/5). Capturing into state (not a plain ref) ensures the demo sections re-render once the Viewport mounts and the scroller becomes available.
- **ScrollTrigger.refresh() invocation points (Pitfall 3):**
  1. **Boot:** inside each `ProjectPanel`'s `useGSAP`, after the entrance is created, when `bootReady` is true (the loader has handed off and layout settled).
  2. **Fonts:** `document.fonts.ready.then(() => ScrollTrigger.refresh())`, also inside the panel `useGSAP`, since the web-font load shifts metrics.
  3. **Dialog open:** in `ProjectPopout.onOpenChange(true)`, inside a `requestAnimationFrame` so the popup has painted before positions are remeasured.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] eslint-disable directive placement for the demo-section `<img>`**
- **Found during:** Task 3 lint check.
- **Issue:** The `type:'image'` branch uses a plain `<img>` (intentional, D-13: swappable placeholder paths that next/image cannot optimize at build time). The initial multi-line `eslint-disable-next-line` comment did not sit on the line immediately preceding the `<img>`, so ESLint reported both an "unused disable directive" warning and the original `@next/next/no-img-element` warning, introducing NEW warnings in a file I own.
- **Fix:** Moved the rationale to a preceding comment and placed a single-line `// eslint-disable-next-line @next/next/no-img-element` directly above the `<img>`.
- **Files modified:** src/components/projects/demo-section.tsx
- **Verification:** `npx eslint` on all six new/modified files now reports zero errors and zero warnings.
- **Committed in:** 8e13918 (Task 3)

### Plan assumption that did not hold (no action needed)

- The plan's Task 1 action said to "replace the projects inline stub in page.tsx with an import and render of `<ProjectsSection/>`." In fact 02-04 already imported and rendered the real `ProjectsSection`, so `page.tsx` needed no edit. Leaving it untouched is the correct outcome and preserves `useSectionView` and the `id="projects"` anchor exactly (D-01/D-02). Recorded as a decision rather than a deviation since no work was added or removed.

## Verification

- `npx vitest run src/__tests__/components/project-popout.test.tsx`: 2 passed (the R-27 a11y case is GREEN and unskipped).
- `npx vitest run` (full suite): 53 passed, 4 todo, 1 file skipped. The 4 todos are the `reduced-motion.test.tsx` placeholders owned by 02-06; no regressions in the previously-green suites.
- `npm run build`: exits 0 (Next 16.2.2 Turbopack, TypeScript clean, all 7 routes generated).
- `npx eslint` on the six new/modified files: 0 errors, 0 warnings (no NEW lint errors; the pre-existing red baseline owned by 02-06 is untouched).

## Task Commits

1. **Task 1: stacked full-viewport project panels with GSAP entrances** - `4ff1100` (feat)
2. **Task 2: accessible Base UI Dialog pop-out with Lenis pause** - `b1753fc` (feat)
3. **Task 3: demo sections with scroll-into-view video and poster fallback** - `8e13918` (feat)

## Known Stubs

The demo media (`src`/`poster` paths under `/projects/...`) are intentional swappable placeholders per D-13: real videos and screenshots drop in at the same paths with no code change. This is an explicitly deferred item (see STATE.md Deferred Items: "Real demo videos/screenshots"), not an incomplete implementation. The components render the real media elements against the data paths, so no code edit is needed when assets land.

## Threat Flags

None. No new network endpoints, auth paths, or schema changes. External repo/live anchors use `rel="noopener noreferrer"` (mitigates T-02-11). Demo media `src`/`poster` are static build-time data paths with no user input (T-02-12 accept). Video uses `preload="none"` and muted single-clip autoplay (T-02-13 accept).

## Next Phase Readiness

- 02-06 (polish + reduced-motion audit): every new animation here is gated behind `useReducedMotion()` (panel entrance early-return; video autoplay skips the observer and omits the video src). The `reduced-motion.test.tsx` todos for project-panel, project-popout demo entrance, and demo-section poster can now be wired against real components.
- 02-06 must also fix the pre-existing RED lint baseline (cursor-spotlight/hero-loader/loadup-sequence) before the 02-07 gate, as flagged in 02-01.

## Self-Check: PASSED

- All 4 created files + 1 rewritten section verified present on disk; `project-card.tsx` confirmed deleted.
- All 3 task commits verified in git log: 4ff1100, b1753fc, 8e13918.
- No unexpected file deletions (only the intentional `project-card.tsx` removal in Task 1).

---
*Phase: 02-single-page-portfolio-redesign*
*Completed: 2026-05-24*
