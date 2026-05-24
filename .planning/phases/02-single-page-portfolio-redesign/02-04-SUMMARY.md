---
phase: 02-single-page-portfolio-redesign
plan: 04
subsystem: harness-and-analytics
tags: [harness, analytics, section-view, intersection-observer, em-dash]
requires:
  - "02-02: page.tsx composition (six sections in scroll order) and the harness inline stub"
  - "02-02: Wave 0 test scaffolds (harness.test.tsx, analytics.test.ts, IntersectionObserver setup stub)"
provides:
  - "Six-pillar harness section (src/components/sections/harness.tsx)"
  - "section_view analytics event (eventTypes tuple + trackSectionView + use-section-view hook)"
  - "useSectionView mounted live on page.tsx across all six section ids"
affects:
  - "02-07: live section_view emission enables manual preview check 7 (Supabase section_view rows)"
tech-stack:
  added: []
  patterns:
    - "IntersectionObserver fire-once-per-id hook (Set ref guard), mirroring useScrollspy"
    - "staggerContainer/staggerItem grid that short-circuits under prefers-reduced-motion (D-23)"
    - "backward-compatible Zod enum extension with a bounded event_target (V5)"
key-files:
  created:
    - "src/hooks/use-section-view.ts"
    - "src/__tests__/hooks/use-section-view.test.ts"
  modified:
    - "src/data/harness.ts"
    - "src/components/sections/harness.tsx"
    - "src/app/page.tsx"
    - "src/lib/analytics/types.ts"
    - "src/hooks/use-analytics.ts"
    - "src/__tests__/components/harness.test.tsx"
    - "src/__tests__/lib/analytics.test.ts"
decisions:
  - "Supabase page_events.event_type is free-text (no repo-level CHECK/enum DDL); section_view is a code-only change, NO migration."
  - "Pillar data lives in a trimmed src/data/harness.ts (single six-entry array), not inlined."
  - "useSectionView mounted directly in page.tsx (already a 'use client' host), not in a new client child."
  - "IntersectionObserver threshold = 0.3 for section_view firing."
metrics:
  duration: "~13 min"
  completed: "2026-05-24"
  tasks: 3
  files_created: 2
  files_modified: 7
---

# Phase 2 Plan 04: Harness & Analytics Summary

Distilled the harness into six scannable capability pillars, extended analytics with a backward-compatible `section_view` event, and mounted a fire-once IntersectionObserver hook across all six live section ids so the page emits `section_view` events on scroll.

## What Was Built

### Task 1: Six-pillar harness section (commit `ff1bf55`)
- Replaced the entire `src/data/harness.ts` inventory dump (layers, inventory, hookEvents, stats, skills, plugins, marketplaces, gsdPhases, colophon) with a single six-entry `pillars` array. The six headlines and one-to-two-sentence one-liners are sourced verbatim from REDESIGN-SPEC section 4.4: Second Brain as RAG, GSD Workflow, Multi-Agent Research, Sub-Agent Execution, Context Engineering, Guardrails. The rewrite is em-dash clean (D-22), which turned the last `em-dash.test.ts` failure GREEN.
- Rewrote `src/components/sections/harness.tsx` (previously a Wave 1 placeholder stub) as a `'use client'` `<Section id="harness">` rendering six pillar cards in a `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` `staggerContainer`/`staggerItem` grid. Uses the hairline card frame (`border border-hairline rounded-md p-6 bg-background`). The shared stagger variants already short-circuit under `prefers-reduced-motion` via the AnimationProvider MotionConfig gate (S-3 / D-23). The component exports both `Harness` (the name the Wave 0 test imports) and `HarnessSection` (the name page.tsx imports).
- `page.tsx` already imported and rendered `<HarnessSection/>` (composed by 02-02); that import now resolves to the real six-pillar section, so the stub body is replaced without a page.tsx edit in Task 1.
- Flipped `harness.test.tsx` from a `describe.skip` block with an indirected dynamic import to a real static `import { Harness }` with the six-headline assertions active. Removed the now-dead `void mockMatchMedia;` (the helper is genuinely used). Adjusted the intro paragraph copy (removed the literal words "context" and "guardrails") so `getByText(/Guardrails/i)` matches only the pillar headline, not body text.

### Task 2: section_view analytics + use-section-view hook (commit `7ecddb1`)
- Added `'section_view'` to the `eventTypes` tuple in `src/lib/analytics/types.ts` as a backward-compatible enum extension (D-05). All four legacy events still validate.
- Bounded `event_target` to 100 chars (`z.string().max(100)`) as a V5 hardening step (threat T-02-08) so oversized/junk targets are rejected before reaching Supabase.
- Added and exported `trackSectionView(sectionId)` in `use-analytics.ts`, calling `sendEvent('section_view', sectionId)`, mirroring `trackProjectClick`.
- Created `src/hooks/use-section-view.ts`: `useSectionView(ids: string[], threshold = 0.3)` builds one IntersectionObserver over the section elements (by `getElementById`), fires `trackSectionView(id)` exactly once per id on first intersection using a `Set` ref guard (mirroring the `hasFiredPageView` idiom), and disconnects on cleanup (S-4). Keyed on `ids.join(',')` for a stable effect dependency.
- `route.ts` unchanged (see Supabase finding below).
- Extended `analytics.test.ts`: unskipped the `section_view` acceptance case, added an over-length `event_target` rejection case and a normal-length `section_view` acceptance case.

### Task 3: Live useSectionView mount (commit `3d6e5ea`)
- `page.tsx` now calls `useSectionView(['hero','about','projects','harness','resume','contact'])` in scroll order, so each rendered section emits one `section_view` event on first scroll-into-view. The `?s=` scroll effect, section composition, and the projects stub (02-05's) are untouched.
- Created `src/__tests__/hooks/use-section-view.test.ts`: mocks `useAnalytics` to spy on `trackSectionView`, wraps the IntersectionObserver constructor (per the use-scrollspy.test.ts idiom) to drive synthetic entries, and asserts (a) fire-once per id on first intersection, (b) no refire on re-intersection of the same id, (c) one fire per distinct id across all six, and (d) non-intersecting entries are ignored.

## Supabase Column-Constraint Finding (RESEARCH open question A1)

**Decision: NO DB migration. section_view is a code-only change.**

- There is no repo-level DDL, migration, SQL file, `supabase/` directory, Postgres enum type, or CHECK constraint defining `page_events.event_type` anywhere in the working tree (searched `*.sql`, `**/migrations/**`, `supabase/**`, and full-text for `CREATE TABLE` / `CHECK (` / `create type` / `::event_type`).
- The `page_events` table was created externally (inherited from Phase 1; never authored in these phases). The existing `/api/analytics` route already inserts four distinct `event_type` string values via a plain parameterized `.insert({ event_type: ... })` with no enum cast.
- Only `.env.local.example` exists (placeholder URL/key), so there is no live Supabase project ref or credentials available in this session, and the Supabase MCP has no project to query.
- Per the plan's verify-then-conditionally-migrate contract, a migration is required ONLY if a real DB-level CHECK/enum constraint is found in the repo. None exists, and the repo evidence (no enum-type DDL + an inherited insert path already writing multiple plain string values) is the signature of a free-text/varchar column. The input remains Zod-validated and length-bounded (event_target capped at 100 chars). This was a determination from repo evidence, not a blind guess, so no decision checkpoint was raised. 02-07 manual check 7 (live Supabase rows in the Vercel preview) is the empirical confirmation step.

## Other Decisions

- **Pillar data location:** trimmed `src/data/harness.ts` (single six-entry `pillars` array), not inlined, so the data stays separable and the em-dash sweep over `src/data/*.ts` keeps covering it.
- **Hook mount site:** directly in `page.tsx` (already a `'use client'` host running the `?s=` effect), not a new client child.
- **IntersectionObserver threshold:** `0.3` (a section counts as "viewed" once roughly a third is in the viewport; avoids 1px-sliver firing while firing well before the section is scrolled past).
- **Component export shape:** the harness section exports both `Harness` and `HarnessSection` from one body so the test importer and the page importer stay in sync.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] harness intro copy caused a getByText multiple-match failure**
- **Found during:** Task 1
- **Issue:** The first draft of the harness intro paragraph contained the literal words "context" and "guardrails", so `screen.getByText(/Guardrails/i)` in harness.test.tsx matched two nodes (the pillar headline and the intro body) and threw a multiple-elements error.
- **Fix:** Reworded the intro paragraph to "retrieval, orchestration, and discipline" so each pillar headline regex matches exactly one element.
- **Files modified:** src/components/sections/harness.tsx
- **Commit:** ff1bf55

### Skipped Plan Step (per orchestrator state)
- The plan's Task 1 instructed deleting `HarnessTabs.test.tsx` and `ArchitectureTab.test.tsx`. These were ALREADY DELETED by 02-02 (confirmed absent via glob), so the deletion step was skipped as a no-op per the state-from-prior-waves note. The mockMatchMedia helper was already preserved in harness.test.tsx by the Wave 0 scaffold.

## Pre-existing Issues NOT Fixed (out of scope, deferred to 02-06)
- `src/hooks/use-analytics.ts:19:7` (`sendEvent` accessed before declared / immutability) and `:21:6` (exhaustive-deps warning) are part of the pre-existing red lint baseline deferred to polish/02-06. Verified via `git stash` that the baseline is exactly `10 problems (7 errors, 3 warnings)` both before and after this plan's edits: zero new lint problems were introduced. The `trackSectionView` addition to use-analytics.ts did not naturally resolve the pre-existing ordering error, so it is left for 02-06 per the constraint.

## Verification

- `npx vitest run` (full suite): 10 files passed, 1 skipped; 52 tests passed, 1 skipped (Wave 3 project-popout dialog a11y, owned by 02-05), 4 todo. Zero failures.
- Target tests GREEN: `harness.test.tsx` (3), `analytics.test.ts` (11), `em-dash.test.ts` (fully green incl. harness.ts and harness.tsx sweeps), `use-section-view.test.ts` (4).
- `npm run build`: exits 0 (clean, no imports to deleted harness modules).
- `npm run lint`: 10 problems (7 errors, 3 warnings) = unchanged pre-existing baseline; no NEW lint errors introduced.

## Self-Check: PASSED

All created files exist on disk (src/hooks/use-section-view.ts, src/__tests__/hooks/use-section-view.test.ts) and all modified files are present. All three task commits exist in git history: ff1bf55, 7ecddb1, 3d6e5ea.
