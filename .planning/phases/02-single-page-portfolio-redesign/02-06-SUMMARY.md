---
phase: 02-single-page-portfolio-redesign
plan: 06
subsystem: hero-grid-and-polish
tags: [thermodynamic-grid, full-bleed, idle-clear, reduced-motion, rtl-audit, lint-cleanup, set-state-in-effect, wave-4]

# Dependency graph
requires:
  - phase: 02-03
    provides: retargeted hero.tsx that renders the canvas ThermodynamicGrid + bootReady gate + compile sequence
  - phase: 02-05
    provides: the animated components the reduced-motion audit asserts over (ProjectPanel GSAP entrance, DemoSection in-view video, useInViewVideo)
  - phase: 02-01
    provides: Wave 0 reduced-motion.test.tsx scaffold with the verbatim mockMatchMedia helper; jsdom IntersectionObserver + HTMLMediaElement stubs; the intentionally-RED lint baseline owned by this plan
provides:
  - Full-bleed thermodynamic hero grid (w-screen breakout) with no horizontal scrollbar (D-06)
  - Idle-clear heat tuning so the grid cools to clear promptly at rest and re-ignites on move (D-07/R-19)
  - Cross-cutting reduced-motion RTL audit over every new phase animation (R-30/D-23)
  - A clean lint gate (npm run lint exits 0, zero errors, zero warnings) for the 02-07 verification wave
affects: [02-07]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tailwind v4 full-bleed breakout: absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen overflow-hidden, paired with body overflow-x:hidden to avoid a horizontal scrollbar / CLS"
    - "Idle-clear canvas heat: track lastMoveTs; after IDLE_MS stop injecting and switch to an aggressive IDLE_COOLING multiplier so heat clears at rest; rAF loop stops when fully cool and re-arms on the next pointer move"
    - "Reduced-motion RTL audit: widen mockMatchMedia to match motion/react's bare '(prefers-reduced-motion)' query and reset motion-dom's module-cached preference per test so the spy is honored"
    - "react.dev 'you might not need an effect': compute synchronous reduced-motion + sessionStorage decisions in a useState lazy initializer; keep storage writes / markReady / timer-driven setState in effects so render stays pure"

key-files:
  created: []
  modified:
    - src/components/sections/hero.tsx
    - src/components/ui/interactive-thermodynamic-grid.tsx
    - src/app/globals.css
    - src/__tests__/components/reduced-motion.test.tsx
    - src/components/sections/harness.tsx
    - src/hooks/use-analytics.ts
    - src/__tests__/lib/session.test.ts
    - src/hooks/use-typing-animation.ts
    - src/components/fx/cursor-spotlight.tsx
    - src/components/fx/hero-loader.tsx
    - src/components/fx/loadup-sequence.tsx
  deleted:
    - src/components/fx/hero-grid.tsx

key-decisions:
  - "Grid idle-clear tuned with IDLE_MS=90ms and IDLE_COOLING=0.72 (vs base coolingFactor lowered 0.94->0.90); the stationary-mouse re-injection bug is fixed by gating injectHeat on an idle flag so cooling can win at rest"
  - "Full-bleed breakout uses w-screen (not 100vw) + body overflow-x:hidden so the scrollbar gutter does not produce a horizontal scrollbar (T-02-15 mitigation)"
  - "The canvas thermodynamic grid is excluded from the RTL reduced-motion audit (jsdom has no canvas rAF heat loop); its matchMedia guard is verified by code review + the Wave 5 manual gate, documented in the test header"
  - "All four set-state-in-effect lint errors fixed via lazy initializers without behavior change; flagged for Wave 02-07 manual QA because they touch the boot/compile/loader animation and have no automated visual coverage"

metrics:
  duration: ~30min
  tasks: 2 plan tasks + 1 authorized lint-cleanup task (3 cleanup commits)
  files_changed: 12 (11 modified, 1 deleted)
  completed: 2026-05-24
---

# Phase 2 Plan 6: Hero Grid Full-Bleed + Reduced-Motion Audit + Lint Cleanup Summary

Made the thermodynamic hero grid full-bleed (w-screen breakout, no horizontal scrollbar) with prompt idle-clear heat, deleted the dead duplicate DOM grid, locked R-30/D-23 with a reduced-motion RTL audit over every new phase animation, and cleared the intentionally-RED Wave 0 lint baseline so `npm run lint` exits 0 ahead of the 02-07 gate.

## What Was Built

### Task 1 - Full-bleed grid + idle-clear heat; delete dead duplicate (commit 0b3a6ca)
- **hero.tsx (D-06):** wrapped the canvas `ThermodynamicGrid` in a full-bleed breakout (`absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen overflow-hidden pointer-events-none`) so the grid spans the full viewport width while the hero text column stays at `max-w-[1200px]`. The clip-path reveal and `interactive={step >= 2}` gating are preserved.
- **globals.css (T-02-15):** added `overflow-x: hidden` to `body` so the `w-screen` breakout cannot introduce a horizontal scrollbar / CLS. Vertical scrolling is unaffected.
- **interactive-thermodynamic-grid.tsx (D-07/R-19):** tuned idle-clear heat. Added `lastMoveTs` tracking; `tick()` now computes an `idle` flag (pointer present but not moved within `IDLE_MS = 90`). While idle, `injectHeat` is skipped (fixing the prior bug where a stationary-but-active pointer re-ignited the same cell every frame, preventing cooling) and `paint()` cools with the aggressive `IDLE_COOLING = 0.72` instead of the base `coolingFactor` (lowered 0.94 -> 0.90). The rAF loop runs while heat remains so the idle decay clears the trail, then stops until the next move re-arms it. The `matchMedia('(prefers-reduced-motion: reduce)')` guard remains the single reduced-motion source for this canvas path (Pitfall 4).
- **Deleted src/components/fx/hero-grid.tsx:** the unused DOM-cell duplicate. Confirmed by grep that nothing imports it (the hero renders the `ui/` canvas version; the only remaining reference was a stale comment in hero-loader.tsx).

### Task 2 - Reduced-motion audit across all new animations (commit 99f5dc9)
Replaced the four `it.todo` placeholders in `reduced-motion.test.tsx` with passing assertions (5 tests, file green; full suite 58/58):
- **project-panel under reduce:** the GSAP entrance early-returns, so every `[data-animate]` child renders with no inline transform/opacity/transition (final state), and the title/hook/button are present.
- **demo-section under reduce:** the `<video>` `src` is omitted (poster only, no autoplay observer wired); caption/body render. A no-reduce control asserts the `src` is wired back.
- **about SlideBlock (regression anchor):** the motion `style` is `undefined` under reduce, so no wrapper carries an inline transform/opacity.
- **Canvas grid excluded** from the RTL test (jsdom has no canvas rAF); rationale documented in the file header. Verified by code review + the Wave 5 manual gate.

Mechanism note: motion/react's `useReducedMotion()` reads the bare `(prefers-reduced-motion)` media query (NOT the `: reduce` form) and caches the preference at module scope on first read. The audit widens `mockMatchMedia` to match both query forms and resets `motion-dom`'s cached preference (`hasReducedMotionListener` / `prefersReducedMotion`) before each test so the spy is honored.

### Authorized lint cleanup (commits d11f6e0, 5b425fe)
Cleared the intentionally-RED Wave 0 lint baseline. `npm run lint` now exits 0 with zero errors and zero warnings.

**No-behavior cleanup (d11f6e0):**
- harness.tsx: escaped literal quotes in JSX with `&ldquo;`/`&rdquo;` (no em dashes, D-22) - `react/no-unescaped-entities`.
- use-analytics.ts: declared the stable `sendEvent` `useCallback` before the mount effect that calls it and added it to the effect deps - resolves the `react-hooks/immutability` error and the `exhaustive-deps` warning. `page_view` still fires once via the `hasFiredPageView` ref guard.
- session.test.ts: removed unused `vi` import. use-typing-animation.ts: removed unused `useCallback` import.

**Behavior-touching set-state-in-effect fixes (5b425fe):** see "Needs 02-07 manual QA" below.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Stationary-pointer heat re-ignition prevented idle cooling**
- **Found during:** Task 1 (idle-clear tuning).
- **Issue:** `mouse.active` only flips false on leaving the window, so a pointer held still kept `injectHeat` re-adding 0.35 heat to the same cells every frame, so the trail could never cool to clear at rest (the literal D-07 failure).
- **Fix:** track `lastMoveTs`; gate `injectHeat(idle)` and `paint(idle ? IDLE_COOLING : coolingFactor)` on an idle flag.
- **Files:** src/components/ui/interactive-thermodynamic-grid.tsx. **Commit:** 0b3a6ca.

**2. [Rule 3 - Blocking] Reduced-motion audit could not assert the gate without matching motion's query + resetting its cache**
- **Found during:** Task 2.
- **Issue:** motion/react reads `(prefers-reduced-motion)` (not `: reduce`) and caches the result module-scoped, so the verbatim `mockMatchMedia` never made `useReducedMotion()` return true - the GSAP/SlideBlock short-circuit could not be exercised and the assertions failed.
- **Fix:** widen the mock to match both query forms and reset `motion-dom`'s cached preference per test.
- **Files:** src/__tests__/components/reduced-motion.test.tsx. **Commit:** 99f5dc9.

The lint cleanup was an explicitly authorized task (Wave 0 deferred polish), committed separately from the feature work as instructed; it is recorded here rather than as an unplanned deviation.

## Needs 02-07 Manual QA

The four `set-state-in-effect` fixes (commit 5b425fe) touch the boot/compile/loader animation and analytics-adjacent gating and have no automated visual coverage. They were fixed via `useState` lazy initializers (synchronous reduced-motion + sessionStorage reads moved into render init; storage writes, `markReady`, and timer/event-handler setState left in effects so render stays pure). Behavior is intended to be unchanged, but the live preview must confirm:

1. **Hero loader (hero-loader.tsx, LIVE):** the cinematic loader (dark pre-load -> cream sweep -> name stamp -> handoff) still plays on a fresh session and is skipped on reload within the same session and under prefers-reduced-motion. ESC still skips it.
2. **Hero compile sequence (hero.tsx):** the compile/typewriter sequence still plays once per session and shows the static final state on reload / under reduced motion (it must NOT re-type after the loader already stamped the name).
3. **Cursor spotlight (cursor-spotlight.tsx):** the crimson pointer glow still appears after boot on fine-pointer, non-reduced devices and stays absent on touch / reduced-motion.
4. **Analytics (use-analytics.ts):** `page_view` still fires exactly once on load, and the track* callbacks still fire (project_click, section_view, etc.).
5. **loadup-sequence.tsx:** currently unmounted/legacy (not rendered anywhere); fixed for lint completeness only, so it carries no live runtime risk.

Also visual (already on the Wave 5 manual list): the full-bleed grid spans the full viewport width with no horizontal scrollbar, and grid heat clears promptly when the cursor stops and re-ignites on movement.

## Verification

- `npm run lint` exits 0 - zero errors, zero warnings (the 02-07 gate prerequisite).
- `npm run build` exits 0.
- `npx vitest run` green: 11 files, 58 tests (reduced-motion.test.tsx 5/5).

## Self-Check: PASSED

- All modified/created files exist on disk; src/components/fx/hero-grid.tsx confirmed deleted.
- Commits verified: 0b3a6ca (feat), 99f5dc9 (test), d11f6e0 (fix), 5b425fe (fix).
