---
phase: 02-single-page-portfolio-redesign
plan: 03
subsystem: ui
tags: [content, data-model, copy, projects, about, resume, hero, em-dash, vitest, lenis]

# Dependency graph
requires:
  - phase: 02-01
    provides: em-dash.test.ts and projects.test.ts Wave 0 scaffolds (acceptance targets)
  - phase: 02-02
    provides: single-page composition, hash-anchor navbar, shared Lenis/GSAP ticker (#projects anchor + useLenis pattern)
provides:
  - Extended Project + DemoSection data model (REDESIGN-SPEC 4.3) with ordered demos[] for the Wave 3 pop-out
  - Featured project set (Quant Edge Tracker, AI News Agent, EV Trainer) with swappable placeholder media paths
  - Approved verbatim five-paragraph about narrative + pull quote
  - Retargeted employer-generic hero TAGLINE/META (em-dash-free) and a #projects lenis.scrollTo CTA
  - Inline resume rebuilt to the featured set with generic employers and no phone
  - Green em-dash guard over src/data/*.ts (except deferred harness.ts) AND src/components/sections/*.tsx
affects: [02-04, 02-05, 02-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "DemoSection[] ordered media model is the contract the Wave 3 pop-out (02-05) consumes"
    - "Swappable placeholder media paths under /projects/<slug>/ so real assets drop in with no code change (D-13)"
    - "Hero CTA reuses the navbar useLenis() + scrollTo('#id', { offset: -64 }) anchor idiom"

key-files:
  created:
    - .planning/phases/02-single-page-portfolio-redesign/02-03-SUMMARY.md
  modified:
    - src/data/projects.ts
    - src/data/about.ts
    - src/data/resume.ts
    - src/components/sections/hero.tsx
    - src/components/sections/about.tsx
    - src/components/projects/project-card.tsx
    - src/__tests__/data/projects.test.ts

key-decisions:
  - "Adapted project-card.tsx to the new model field names (Rule 3) to keep the build green; Wave 3 (02-05) rewrites it into the panel + pop-out"
  - "Left src/data/harness.ts em dashes untouched (owned by 02-04, which trims it into six pillars); logged to deferred-items.md"
  - "aboutParagraphs and landingAbout.paragraphs both carry the same approved five-paragraph narrative (D-09); pull quote woven in after paragraph 4"
  - "Resume on-page employer set to generic 'A manufacturing company' (D-20); specifics confined to /resume.pdf"

patterns-established:
  - "Ordered DemoSection[] media contract for the pop-out"
  - "Employer-generic public render with PDF-only specifics (T-02-06 mitigation)"

requirements-completed: [R-20, R-21, R-21a, R-21b, R-24, R-25, R-26, R-29]

# Metrics
duration: 13min
completed: 2026-05-24
---

# Phase 2 Plan 03: Content & Data Layer Summary

**Extended the Project/DemoSection data model and swapped to the Quant Edge Tracker / AI News Agent / EV Trainer featured set with ordered demo media, landed the approved verbatim about narrative, retargeted the hero copy employer-generic and em-dash-free, and rebuilt the inline resume to the featured set with generic employers; the em-dash guard over data exports and section components is green except the deferred harness.ts (02-04).**

## Performance

- **Duration:** 13 min
- **Started:** 2026-05-24T22:45:30Z
- **Completed:** 2026-05-24T22:58:43Z
- **Tasks:** 3
- **Files modified:** 7 (incl. one test scaffold strengthened)

## Accomplishments
- Extended `Project` interface to the REDESIGN-SPEC 4.3 shape (id, slug, title, hook, overview, tech[], status shipped|in-progress, links, heroImage) plus a new `DemoSection` interface (type video|image, src, poster?, caption, body), with the three featured projects each carrying an ordered three-section `demos[]`. `projects.test.ts` is green.
- Replaced both `aboutParagraphs` and `landingAbout` with the APPROVED five-paragraph narrative (REDESIGN-SPEC 4.2 verbatim) and the D-10 pull quote; `about.tsx` now renders all five paragraphs (pull quote after paragraph 4) with the SlideBlock reduced-motion gate intact.
- Retargeted the hero `TAGLINE`/`META` to the employer-generic D-08 copy (removing the old em dash) and switched the CTA from a `/projects` route link to a `#projects` anchor driven by `lenis.scrollTo(..., { offset: -64 })`.
- Rebuilt the inline resume: current role is Data Science Intern, the projects subsection is the featured set with softened statistics/analytics/game-theory framing, employers are generic on the page, no phone number, and en-dash date separators are replaced with "to".
- The broadened em-dash guard (data exports + section-component source text, incl. the retargeted hero TAGLINE) is green for every file this plan owns.

## Task Commits

1. **Task 1: Rewrite the project data model and featured set** - `6f881e2` (feat) [tdd: scaffold pre-committed in Wave 0; this is the GREEN implementation]
2. **Task 2: Approved about narrative, retargeted hero copy, em-dash sweep** - `2cee0a2` (feat)
3. **Task 3: Rebuild the inline resume to the featured set** - `e18d924` (feat)

**Plan metadata:** pending (docs commit with SUMMARY/STATE/ROADMAP/REQUIREMENTS)

## Files Created/Modified
- `src/data/projects.ts` - New `DemoSection` + extended `Project` interfaces; three featured projects with hooks, overviews, softened framing, swappable placeholder media, and ordered demos[].
- `src/data/about.ts` - Approved verbatim five-paragraph narrative shared by `aboutParagraphs` and `landingAbout.paragraphs`; D-10 pull quote; `skillCategories` unchanged.
- `src/data/resume.ts` - Data Science Intern current role, featured-set projects subsection, generic employers, no phone, "to" date separators, "Game Theory" interest.
- `src/components/sections/hero.tsx` - Employer-generic em-dash-free TAGLINE/META; `useLenis` import; `#projects` scroll CTA.
- `src/components/sections/about.tsx` - Renders all five paragraphs (slice 0..4, pull quote, then [4]).
- `src/components/projects/project-card.tsx` - Adapted to the new model field names so the build stays green (Rule 3 deviation).
- `src/__tests__/data/projects.test.ts` - Strengthened (non-empty ordered demos, retired-set guard) and fixed the `Record<string, unknown>` cast via `unknown` for the precise interface.

## Placeholder media paths chosen (for Wave 3 / 02-05 demo wiring)
All paths are swappable (D-13): drop real assets at the same path under `public/` with no code change.

| Project | heroImage | demos[] (type, src, poster) |
|---------|-----------|------------------------------|
| Quant Edge Tracker | `/projects/quant-edge-tracker/hero.png` | image `pipeline.png`; image `edge-charts.png`; video `clv-walkthrough.mp4` (poster `clv-walkthrough.png`) |
| AI News Agent | `/projects/ai-news-agent/hero.png` | image `briefing-email.png`; image `dashboard.png`; video `agent-loop.mp4` (poster `agent-loop.png`) |
| EV Trainer | `/projects/ev-trainer/hero.png` | image `decision-tree.png`; image `range-equity.png`; video `voice-drill.mp4` (poster `voice-drill.png`) |

## Per-project hook/overview authored (Claude's Discretion within softened framing)
- **Quant Edge Tracker** (in-progress): hook leads with "sports analytics platform that turns market lines into fair probabilities"; overview frames it as a data pipeline + modeling layer (calibration, sample sizing, closing-line value) rather than betting.
- **AI News Agent** (shipped): hook "an autonomous agent that researches the day and writes my morning briefing"; overview covers the hand-rolled agent loop, persistent topic memory, per-item Q&A, budget tracking, and the Claude Code Routines + Resend MCP rebuild.
- **EV Trainer** (shipped): hook "a game-theory trainer that teaches expected-value thinking through interactive, voice-enabled decision drills"; overview frames it as applied decision science/statistics, shipped in under a week.

## Decisions Made
- Both `aboutParagraphs` and `landingAbout.paragraphs` reference one shared `approvedNarrative` constant so the verbatim copy cannot drift between the two exports (D-09).
- Pull quote placed after the fourth paragraph (the "edge" paragraph) so it lands just before the closing paragraph, which echoes it.
- `skillCategories` left as-is (no em dashes, not required by Task 2); "Poker Theory" softened to "Game Theory" in resume interests for consistency with the project framing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Adapted project-card.tsx to the new Project model**
- **Found during:** Task 1 (model rewrite)
- **Issue:** Replacing the `Project` interface broke `project-card.tsx`, which read the old fields (`imageLabel`, `subtitle`, `description`, `technologies`, `githubUrl`, `detailedDescription`, `status === 'completed'`). `next build` runs TypeScript and would fail, breaking the acceptance "build exits 0".
- **Fix:** Mapped the card to the new field names (`hook`, `overview`, `tech`, `status === 'shipped'`, `links.repo`) and rendered the demo captions/bodies in the expanded detail. Visual behavior preserved; this is NOT the Wave 3 pop-out work (02-05 rewrites this file into the panel + pop-out).
- **Files modified:** src/components/projects/project-card.tsx
- **Verification:** `npm run build` exits 0; `projects.test.ts` green; eslint clean on the file.
- **Committed in:** `6f881e2` (Task 1 commit)

**2. [Rule 1 - Bug] Fixed the projects.test.ts type cast for the precise interface**
- **Found during:** Task 1
- **Issue:** The Wave 0 scaffold cast `project as Record<string, unknown>`, which `tsc` flagged (TS2352) once the loose old interface became the precise new one.
- **Fix:** Cast via `unknown` first (`project as unknown as Record<string, unknown>`). No assertion weakened; also strengthened the suite (non-empty ordered demos, retired-set guard).
- **Files modified:** src/__tests__/data/projects.test.ts
- **Verification:** `projects.test.ts` green.
- **Committed in:** `6f881e2` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug). Both necessary to keep the build/typecheck green for the new model. No scope creep.

## Issues Encountered
- **harness.ts em dashes (out of scope, deferred to 02-04):** the em-dash sweep over `src/data/*.ts` includes `src/data/harness.ts`, which contains 11 em-dash strings from the tab-era data dump. Verified via a clean-tree stash that this is a pre-existing Wave 0 baseline red, NOT introduced by this plan. `harness.ts` is not in this plan's `files_modified`; 02-04 trims/replaces it into the six pillars (D-18) and turns that case green. Logged to `deferred-items.md`. This is the "harness pillars" intended-red the plan's verify step explicitly excludes from the regression bar.
- **harness.test.tsx / project-popout.test.tsx TS2503 (JSX namespace):** pre-existing Wave 0 scaffold reds surfaced only by a full `tsc --noEmit`; `next build` does not surface them. Owned by 02-04/02-05. Logged to `deferred-items.md`.

## Known Stubs
The `demos[]` media `src`/`poster` and project `heroImage` are intentional swappable placeholders (D-13, deferred-media decision in CONTEXT). They are wired into the model now and resolved by dropping real assets at the same paths; the Wave 3 pop-out (02-05) renders them. This is the planned placeholder approach, not an unintended stub.

## Threat Flags
None. The external `links.repo` URLs are data-only; the rendering components (Wave 3 panel/pop-out) enforce `target="_blank" rel="noopener noreferrer"` (S-6). No new network/auth/file surface introduced.

## Verification
- `npx vitest run src/__tests__/data/projects.test.ts` - PASS (7 tests)
- `npx vitest run src/__tests__/lib/em-dash.test.ts` - PASS for hero.tsx, about.ts, about.tsx, projects.ts, resume.ts; only harness.ts fails (deferred 02-04)
- `npx vitest run` (full) - 42 passed, 1 failed (harness.ts em-dash, deferred), 4 skipped, 4 todo (02-05/02-06 scaffolds)
- `npm run build` - exits 0
- `npm run lint` on edited files - only the pre-existing deferred hero.tsx `set-state-in-effect` error (02-06); no NEW lint errors introduced

## Next Phase Readiness
- The `DemoSection[]` model contract is ready for the Wave 3 pop-out (02-05); placeholder media paths are documented above.
- 02-04 should trim/replace `harness.ts` to clear the last em-dash failure and the JSX-namespace test reds.
- `project-card.tsx` is a temporary adapter; 02-05 replaces it with `project-panel.tsx` + `project-popout.tsx` + `demo-section.tsx`.

## Self-Check: PASSED

All claimed files exist and all task commits are present in git history:
- Files: 02-03-SUMMARY.md, projects.ts, about.ts, resume.ts, hero.tsx, about.tsx, project-card.tsx (all FOUND)
- Commits: 6f881e2, 2cee0a2, e18d924 (all FOUND)

---
*Phase: 02-single-page-portfolio-redesign*
*Completed: 2026-05-24*
