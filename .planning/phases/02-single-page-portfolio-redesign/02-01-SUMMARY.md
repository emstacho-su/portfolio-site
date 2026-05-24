---
phase: 02-single-page-portfolio-redesign
plan: 01
subsystem: testing
tags: [vitest, jsdom, intersection-observer, base-ui, next-config, test-scaffold, wave-0]

# Dependency graph
requires:
  - phase: 02 (planning)
    provides: VALIDATION.md Wave 0 Requirements, PATTERNS.md T-1/T-2/T-3, REDESIGN-SPEC §4.3/§4.4
provides:
  - Installed node_modules + committed package-lock.json (no version changes)
  - Extended jsdom stubs (IntersectionObserver + HTMLMediaElement play/pause) in src/__tests__/setup.ts
  - Eight runnable Wave 0 test scaffolds (the fixed verification contract for Waves 1-4)
  - Confirmed Base UI dialog import path (@base-ui/react/dialog) for Wave 3
  - Documented pre-existing RED lint baseline (5 errors) routed to 02-06 polish
affects: [02-02, 02-03, 02-04, 02-05, 02-06, 02-07]

# Tech tracking
tech-stack:
  added: []  # No new deps; install resolved already-declared, caret-pinned versions
  patterns:
    - "Wave 0 test-scaffold-first: red-but-runnable tests fix each wave's acceptance target before source is written"
    - "Variable-specifier dynamic import (+ @vite-ignore) in describe.skip blocks so scaffolds targeting not-yet-created modules stay DISCOVERABLE without crashing collection"
    - "fs-based copy sweep with comment-stripping for component source (asserts user-facing copy, not decorative comments)"

key-files:
  created:
    - src/__tests__/lib/redirects.test.ts
    - src/__tests__/data/projects.test.ts
    - src/__tests__/lib/em-dash.test.ts
    - src/__tests__/components/reduced-motion.test.tsx
    - src/__tests__/hooks/use-scrollspy.test.ts
    - src/__tests__/components/project-popout.test.tsx
    - src/__tests__/components/harness.test.tsx
  modified:
    - src/__tests__/setup.ts
    - src/__tests__/lib/analytics.test.ts
    - package-lock.json
    - .planning/phases/02-single-page-portfolio-redesign/deferred-items.md

key-decisions:
  - "Base UI dialog import path is @base-ui/react/dialog (subpath export in @base-ui/react@1.3.0) - resolves RESEARCH A2"
  - "node_modules/next/dist/docs/ DOES exist after install (contrary to RESEARCH assumption); AGENTS.md installed-docs path is directly satisfiable"
  - "Wave 0 lint baseline is intentionally RED (5 pre-existing errors); lint-exits-0 WAIVED for 02-01 per user decision; floor becomes no-NEW-lint-errors; owner 02-06 polish"
  - "em-dash scaffold sweeps data exports AND section-component user-facing copy, with source comments stripped so R-20 governs copy only"
  - "R-31 NOT marked complete: it is the Wave-5 build+lint+Lighthouse gate, which this plan does not satisfy (lint red, Lighthouse manual)"

patterns-established:
  - "Scaffold-first verification contract: each new test is anchored to a requirement and may be red until its owning wave"
  - "describe.skip + variable-specifier dynamic import keeps suites for not-yet-built modules in vitest list without import-resolution crashes"

requirements-completed: []  # plan declares R-31 but R-31 is the Wave-5 verification gate, NOT satisfied here (see decisions)

# Metrics
duration: ~35min
completed: 2026-05-24
---

# Phase 2 Plan 01: Wave 0 Install + Test Scaffold Summary

**Installed dependencies, extended jsdom with IntersectionObserver + media stubs, and laid down eight requirement-anchored Vitest scaffolds (11 intended assertion-reds) that fix the verification contract for Waves 1-4.**

## Performance

- **Duration:** ~35 min (continuation agent; prior agent did the install)
- **Started:** 2026-05-24 (continuation)
- **Completed:** 2026-05-24T22:33Z
- **Tasks:** 3
- **Files modified:** 11 (7 created, 4 modified)

## Accomplishments
- Committed the install: node_modules populated, package-lock.json committed with NO version changes (`npm run build` exits 0; `npx vitest run` baseline green before scaffolds).
- Extended `src/__tests__/setup.ts` with a global `IntersectionObserver` stub (observe/unobserve/disconnect/takeRecords no-ops, callback stored for manual driving) and `HTMLMediaElement.prototype.play` (resolved Promise) / `pause` (no-op). Existing fast suites run without "IntersectionObserver is not defined".
- Created all eight Wave 0 test files (7 new + analytics extension); 33 cases enumerated by `npx vitest list` with zero import-resolution errors.
- Confirmed the Base UI dialog import path and the presence of installed Next docs for downstream waves.
- Documented the pre-existing RED lint baseline as deferred tech debt for 02-06 polish.

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies + green baseline** - `6deb239` (chore)
2. **Task 2: Extend jsdom stubs in setup.ts** - `fbd58d5` (test)
3. **Task 3: Scaffold all eight Wave 0 test files** - `78fb1e0` (test)

**Plan metadata:** committed with SUMMARY + STATE + ROADMAP (docs).

## Files Created/Modified
- `package-lock.json` - Resolved lockfile for the already-declared dependency tree (no version changes).
- `.planning/phases/02-single-page-portfolio-redesign/deferred-items.md` - Records the pre-existing RED lint baseline (5 errors + 3 warnings) and routing.
- `src/__tests__/setup.ts` - Added IntersectionObserver + HTMLMediaElement.play/pause jsdom stubs (matchMedia unchanged).
- `src/__tests__/lib/redirects.test.ts` - R-16: asserts the six-entry `/?s=<section>` redirect table. RED until Wave 1.
- `src/__tests__/data/projects.test.ts` - R-25/R-26: asserts the new Project model + featured set. RED until Wave 2.
- `src/__tests__/lib/em-dash.test.ts` - R-20/D-22: sweeps data exports AND section-component copy. RED on real offenders.
- `src/__tests__/components/reduced-motion.test.tsx` - R-30: `it.todo` placeholders + verbatim mockMatchMedia helper.
- `src/__tests__/hooks/use-scrollspy.test.ts` - R-14: green sentinel + `describe.skip` body. RED-ready for Wave 1.
- `src/__tests__/components/project-popout.test.tsx` - R-27: green sentinel + skip body. RED-ready for Wave 3.
- `src/__tests__/components/harness.test.tsx` - R-28: six-pillar contract + skip body. RED-ready for Wave 2.
- `src/__tests__/lib/analytics.test.ts` - R-17: `section_view` case skipped (baseline green) + legacy-events guard.

## Decisions Made

- **Base UI dialog import path (resolves RESEARCH A2):** `@base-ui/react/dialog`. Confirmed via the package exports map (`@base-ui/react@1.3.0` exposes `.`, `./dialog`, `./alert-dialog`; the `dialog` subpath dir exists). Wave 3 (`project-popout.tsx`) imports from `@base-ui/react/dialog`.
- **node_modules/next/dist/docs/ exists:** Contrary to RESEARCH.md's assumption that docs are not shipped in the tarball, the directory IS present after install. The AGENTS.md "read installed Next docs before routing/redirect/MDX" directive is therefore directly satisfiable from disk; Context7 pinned to next 16.2.2 remains a fallback.
- **em-dash scaffold coverage:** Sweeps (a) every string value exported from `src/data/*.ts` (recursive walk) AND (b) the source text of `src/components/sections/*.tsx`. Source comments (line `//`, block, and JSX comment wrappers) are stripped before scanning, and CRLF is normalized, so the assertion governs user-facing copy only - not decorative comments. hero.tsx + harness.tsx are both in scope when present.
- **Lint baseline waiver:** Per user decision, the Task 1 "npm run lint exits 0" criterion is waived for 02-01. The 5 pre-existing `react-hooks` errors predate this plan and live in files 02-01 does not modify; the verification floor for this phase is "no NEW lint errors introduced." Verified: ESLint on all 11 new/modified files reports zero errors and zero warnings.
- **R-31 not marked complete:** The plan declares `requirements: [R-31]`, but R-31 is the Wave-5 verification gate ("build, tests, and lint pass; Lighthouse >= 95 / a11y = 100"). This plan deliberately leaves lint red (waived) and does not run Lighthouse, so marking R-31 complete would be a false claim. R-31 is owned by 02-06/02-07.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Variable-specifier dynamic imports so skipped scaffolds do not crash collection**
- **Found during:** Task 3 (first `npx vitest list`)
- **Issue:** Vite's transform-time import analysis resolves even `await import('@/...')` specifiers when they are string literals, so the `describe.skip` blocks for not-yet-created modules (use-scrollspy, harness, project-popout) crashed COLLECTION with "Failed to resolve import" - violating the acceptance criterion that reds must fail for "not implemented", not import-resolution errors.
- **Fix:** Held each missing module specifier in a `const` variable (e.g. `const HARNESS_MODULE = '@/components/sections/harness'`) and imported via `await import(/* @vite-ignore */ VAR)`. Vite no longer statically resolves these; the import only runs at test time, and the block is skipped, so it never executes in Wave 0.
- **Files modified:** src/__tests__/hooks/use-scrollspy.test.ts, src/__tests__/components/harness.test.tsx, src/__tests__/components/project-popout.test.tsx
- **Verification:** `npx vitest list` enumerates all 8 files (33 cases), zero resolution errors.
- **Committed in:** 78fb1e0 (Task 3)

**2. [Rule 1 - Bug] em-dash section scan over-caught comments; CRLF defeated comment stripping; wrong offender label**
- **Found during:** Task 3 (em-dash test reds)
- **Issue:** (a) The section-component scan flagged em dashes in code/JSX comments, which are not user-facing copy R-20 governs (scope creep that would force downstream waves to strip comment dashes). (b) The line-comment regex `/\/\/.*$/` failed to strip Windows-checked-out `// ...` lines because the trailing `\r` blocked the match. (c) The offender label used the raw en-dash char variable instead of the `'U+2013'` string.
- **Fix:** Added a `stripComments()` pass (normalize CRLF->LF, then remove block + JSX + line comments) before scanning section source; fixed the offender code label; removed the now-unused `EN_DASH` constant.
- **Files modified:** src/__tests__/lib/em-dash.test.ts
- **Verification:** about.tsx (comment-only dash) now PASSES; hero.tsx red narrows to line 10 TAGLINE (the intended target); interested-cta.tsx red narrows to its line 33 aria-label (real JSX copy). harness.ts/resume.ts data reds unchanged.
- **Committed in:** 78fb1e0 (Task 3)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes were necessary to meet the plan's own acceptance criteria (discoverable scaffolds; reds for the right reasons; R-20 governs copy not comments). No scope creep - both stayed inside the test files this plan owns.

## Intentionally-Red Scaffolds (downstream acceptance targets)

11 assertion-reds total, all in 3 scaffold files; none are syntax/import errors. Baseline otherwise green (43 passed, 5 skipped, 4 todo).

| File | Reds | Why red | Owning wave |
|------|------|---------|-------------|
| redirects.test.ts | 2 | next.config.ts has only the 1 `/toolkit` entry vs the required 6 | Wave 1 (02-02) |
| projects.test.ts | 5 | data/projects.ts still uses the old model + old featured set | Wave 2 |
| em-dash.test.ts | 1 | hero.tsx:10 TAGLINE em dash (**labeled `[INTENDED RED until 02-03]`**) | **02-03** must retarget TAGLINE (D-08) |
| em-dash.test.ts | 1 | interested-cta.tsx:33 aria-label em dash (real JSX copy) | resolved when interested-cta.tsx is deleted (projects rewrite wave) |
| em-dash.test.ts | 2 | harness.ts (11 string exports) + resume.ts (3 en-dash date ranges) | Wave 2 (data trim/rewrite) |

Skipped/todo (kept baseline green; flip when the wave lands): `analytics.test.ts` section_view case (Wave 2), `use-scrollspy` body (Wave 1), `project-popout` body (Wave 3), `harness` body (Wave 2), `reduced-motion` todos (Waves 3-4).

## Pre-existing RED Lint Baseline (documented, deferred)

`npm run lint` (now runnable post-install) surfaces 5 errors + 3 warnings in code 02-01 does NOT modify. These predate the plan and were unobservable while node_modules was absent. Recorded in `deferred-items.md` and STATE.md blockers.

| Severity | File:Line | Rule |
|----------|-----------|------|
| ERROR | src/components/fx/cursor-spotlight.tsx:23 | react-hooks/set-state-in-effect |
| ERROR | src/components/fx/hero-loader.tsx:52 | react-hooks/set-state-in-effect |
| ERROR | src/components/fx/loadup-sequence.tsx:31 | react-hooks/set-state-in-effect |
| ERROR | src/components/sections/hero.tsx:56 | react-hooks/set-state-in-effect |
| ERROR | src/hooks/use-analytics.ts:19 | react-hooks/immutability |
| warn | src/__tests__/lib/session.test.ts:1 | no-unused-vars (vi) |
| warn | src/hooks/use-analytics.ts:21 | react-hooks/exhaustive-deps |
| warn | src/hooks/use-typing-animation.ts:3 | no-unused-vars (useCallback) |

**Routing:** hero.tsx and use-analytics.ts are touched by later waves (02-03 TAGLINE, Wave 2 analytics) and can be cleaned there. **cursor-spotlight.tsx, hero-loader.tsx, and loadup-sequence.tsx are NOT modified by any other plan in this phase** and need an explicit cleanup task in 02-06 polish BEFORE the 02-07 verification gate (R-31). The lint-exits-0 criterion is WAIVED for 02-01 per user decision; the phase floor is "no NEW lint errors" (verified clean on this plan's files).

## Threat Flags

None - no new network endpoints, auth paths, or trust-boundary changes. Test scaffolds run only under Vitest/jsdom with read-only fs access to the repo's own source (matches the plan's threat register T-02-02 disposition: accept).

## Issues Encountered
- Both deviations above were the only issues; both resolved within the test files and verified before commit.

## User Setup Required
None - no external service configuration required. (The pre-existing lint baseline is dev tech debt, not user setup.)

## Next Phase Readiness
- Install gate cleared: build/test/lint all run; verification floor (green baseline + clearly-labeled intended reds) established for D-24.
- The fixed verification contract is in place: Wave 1 flips redirects + use-scrollspy; Wave 2 flips projects + harness + analytics section_view + data em-dash; 02-03 fixes the hero.tsx TAGLINE em-dash; Waves 3-4 flip project-popout + reduced-motion.
- **Blocker forwarded:** 02-06 polish must add a deliberate lint-cleanup task covering cursor-spotlight.tsx/hero-loader.tsx/loadup-sequence.tsx before the 02-07 gate, since no other plan touches them.

## Self-Check: PASSED

- All 7 created files verified present on disk; both modified files (setup.ts, analytics.test.ts) confirmed changed.
- All 3 task commits verified in git log: 6deb239, fbd58d5, 78fb1e0.
- No unexpected file deletions in any task commit.

---
*Phase: 02-single-page-portfolio-redesign*
*Completed: 2026-05-24*
