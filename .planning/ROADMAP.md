# Portfolio Roadmap

**Owner:** Evan Stachowiak
**Repo:** portfolio (Next 16.2.2 / App Router / Tailwind v4 / Motion + GSAP + Lenis / Supabase analytics)
**Initialized:** 2026-05-07
**Design spec for Milestone 2:** `.planning/REDESIGN-SPEC.md`
**History:** the earlier multi-page editorial direction lives in `REDESIGN_ROADMAP.md` at the repo root and is superseded by Milestone 2 below.

---

## Milestone 1 — Harness Page (`/harness`)

### Phase 1: Harness Page Build
**Status:** DONE (shipped on `feat/harness-page`; merged to `master`)
**Goal:** Production-grade `/harness` page documenting the Claude Code harness with an interactive architecture diagram. Replaced placeholder `/toolkit`.
**Requirement IDs:** R-1 through R-12 (see `requirements.md`).

> Note: Milestone 2 condenses this standalone page into a distilled six-pillar section on the single page. The redirect and content rework are part of Phase 2 below.

---

## Milestone 2 — Single-Page Redesign

Convert the multi-page site into one scrollable page that showcases real projects (each an animated full-viewport overview that opens a scrollable case-study pop-out) and a distilled view of the AI-engineering harness. Retarget tone toward AI building. Full design in `.planning/REDESIGN-SPEC.md`.

**Stack constraints (verify within the phase):** Next.js 16.2.2 App Router, Tailwind v4 (`@theme inline`, no config file), Motion 12 (`motion/react`), GSAP 3.15 + `@gsap/react`, Lenis 1.3, Supabase `@supabase/ssr` analytics (do not break), Vitest 4.1.

**Global convention:** no em dashes in any copy or data file.

---

### Phase 2: Single-Page Portfolio Redesign
**Status:** PLANNED
**Suggested branch:** `feat/single-page-redesign` (off `master`)
**Depends on:** none
**Goal:** Convert the multi-page site into one scrollable, anchor-navigated page that showcases real projects (animated full-viewport overviews that open scrollable case-study pop-outs) and a distilled view of the AI-engineering harness, with retargeted AI-builder tone. This is a single phase, organized into the work areas below; it can be executed in waves.

**Scope / deliverables (by area):**

*Architecture & navigation*
- Render hero, about, projects, harness, resume, and contact as in-page sections on `/`; nav links become anchors with Lenis smooth-scroll and scrollspy active state.
- Remove the `/interested` route and the Interested CTA/button.
- 301-redirect former routes (`/projects`, `/projects/[slug]`, `/resume`, `/harness`, `/interested`, `/toolkit`) to the matching anchor.
- Keep Supabase `/api/analytics` working; move to section-view events; no regression.

*Hero & landing content*
- Thermodynamic grid spans full viewport width; heat clears promptly when the cursor stops and re-ignites on movement.
- Retarget hero tagline + meta line (employer generic) and the about copy to the APPROVED narrative in REDESIGN-SPEC.md section 4.2. No em dashes.

*Projects system*
- Stacked full-viewport overview panels with GSAP scroll-driven entrance animation; each is a scroll destination.
- Click a panel to open a full-screen, scrollable pop-out case study built from ordered demo sections (muted clip on scroll-into-view or screenshot plus text); placeholder media swappable later with no code change.
- Featured set: Quant Edge Tracker, AI News Agent, EV Trainer (softened stats/analytics framing); retire prior projects and the `/projects/[slug]` MDX route.
- Extend the project data model; pop-out accessibility (focus trap, ESC, scroll lock, focus return, reduced-motion fallback).

*Harness & resume sections*
- Harness: six distilled pillars (Second Brain as RAG, GSD Workflow, Multi-Agent Research, Sub-Agent Execution, Context Engineering, Guardrails); remove the tabbed/data-dense components and the `harness.ts` inventory; update related tests.
- Resume: inline; current Data Science Intern role (employer generic on the page; full names and phone only on the PDF); rebuild the projects subsection to match the featured set; retain PDF download.

*Polish, accessibility & verification*
- Global em-dash sweep across all copy and data; motion polish; `prefers-reduced-motion` shims for every new animation (grid, panels, pop-out, scrollspy); scrollspy correctness; semantic HTML (single h1, landmarks); alt text.
- Verify: `next build`, vitest, lint clean; Lighthouse performance >= 95 and accessibility = 100; visual QA in the Vercel preview.

**Requirement IDs:** R-13 through R-31 (see `requirements.md`).

**Plans:** 7 plans (across 6 execution waves, Wave 0 through Wave 5)
- [x] 02-01-PLAN.md (Wave 0) — Foundation: npm install, jsdom IO/media stubs, scaffold all Wave 0 test files, green baseline.
- [x] 02-02-PLAN.md (Wave 1) — Architecture & routing: compose all sections on `/`, Lenis+GSAP shared ticker, hash-anchor navbar + scrollspy, six redirects to `?s=`, delete legacy routes + Interested CTA.
- [ ] 02-03-PLAN.md (Wave 2) — Content & data: extended project model + featured set, verbatim about narrative, retargeted hero copy, inline resume rebuild, em-dash sweep over data.
- [ ] 02-04-PLAN.md (Wave 2) — Harness & analytics: six-pillar harness section wired into the page, section_view analytics + use-section-view hook, delete broken tab tests, Supabase column verify.
- [ ] 02-05-PLAN.md (Wave 3) — Projects system: stacked GSAP panels, accessible Base UI Dialog pop-out (Lenis pause), scroll-into-view demo video/image, wired into the page.
- [ ] 02-06-PLAN.md (Wave 4) — Hero grid & polish: full-bleed grid breakout, idle-clear heat tuning, delete dead duplicate grid, reduced-motion audit test.
- [ ] 02-07-PLAN.md (Wave 5) — Verification gate: build/test/lint green, Vercel preview, Lighthouse perf >= 95 / a11y = 100, manual QA of redirects/analytics/scroll feel (blocking human checkpoint).

**Success criteria:**
- One-page scroll with working anchor-nav + scrollspy; `/interested` gone; old routes redirect; analytics intact.
- Hero grid is full-bleed width and clears at rest; tone retargeted; About matches the approved copy.
- Three project overview panels animate on scroll; pop-out opens and closes accessibly with placeholder demo sections.
- Harness reads as six scannable pillars; resume inline with current role and rebuilt projects; PDF link works.
- No em dashes anywhere; `next build`, vitest, and lint pass; Lighthouse performance >= 95 and accessibility = 100.

---

## Out of scope for Milestone 2
- Real demo videos and screenshots (placeholders ship now; real media added later).
- New backends or data sources.
- Resume PDF auto-generation from data.
