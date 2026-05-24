# Phase 2: Single-Page Portfolio Redesign - Context

**Gathered:** 2026-05-24
**Status:** Ready for planning
**Source:** PRD Express Path — `.planning/REDESIGN-SPEC.md` (approved in brainstorming 2026-05-24, treated as the locked decision set)

<domain>
## Phase Boundary

Convert the existing multi-page portfolio into one scrollable, anchor-navigated page at `/`. The page presents hero, about, projects, harness, resume, and contact as in-page sections. Projects are the centerpiece: vertically stacked full-viewport overview panels with scroll-driven entrance animation, each opening a full-screen, scrollable pop-out case study built from ordered demo sections (placeholder media for now). The harness is distilled from a tabbed, data-dense page into six scannable capability pillars. Tone is retargeted toward AI building, with the QA/operations background reframed as ground-truth understanding rather than auditing.

**In scope:** in-page section architecture; anchor nav + Lenis smooth-scroll + scrollspy; removal of `/interested`; 301 redirects from former routes; section-view analytics (no regression); full-bleed hero grid with idle-clear heat; retargeted hero/about copy (approved); stacked project overview panels; accessible pop-out case studies with placeholder demo media; extended project data model; featured-set swap (Quant Edge Tracker, AI News Agent, EV Trainer); six-pillar harness rewrite; inline resume with PDF download; contact/footer; global em-dash sweep; `prefers-reduced-motion` shims; build/test/lint/Lighthouse verification.

**Out of scope:** real demo videos/screenshots (placeholders ship now), new backends or data sources, resume-PDF auto-generation from data.

**Stack (verify within the phase):** Next.js 16.2.2 App Router, Tailwind v4 (`@theme inline` in `globals.css`, no config file), Motion 12 (`motion/react`), GSAP 3.15 + `@gsap/react`, Lenis 1.3, Supabase `@supabase/ssr` analytics, shadcn base-nova, Vitest 4.1. Per `AGENTS.md`, consult `node_modules/next/dist/docs/` before routing/redirect changes — this Next.js has breaking changes vs. training data.
</domain>

<decisions>
## Implementation Decisions

### Architecture & Navigation
- **D-01:** The site is a single scrollable page at `/`; hero, about, projects, harness, resume, and contact all render as in-page sections rather than separate routes. (R-13)
- **D-02:** The top nav becomes in-page anchor links (About, Projects, Harness, Resume, Contact) that smooth-scroll via Lenis, and the active section is reflected with a scrollspy active state. (R-14)
- **D-03:** The `/interested` route and the Interested CTA/button are removed entirely from the site. (R-15)
- **D-04:** Former routes `/projects`, `/projects/[slug]`, `/resume`, `/harness`, `/interested`, and the legacy `/toolkit` issue 301 redirects to the matching section anchor on `/`. (R-16)
- **D-05:** Supabase `/api/analytics` continues to function; per-route page_view events are replaced with section-view events where appropriate and there is no analytics regression. (R-17)

### Hero
- **D-06:** The thermodynamic hero grid spans the full viewport width rather than being clipped to the 1200px content container. (R-18)
- **D-07:** The grid heat (red squares) clears promptly when the cursor stops moving, cooling to clear at idle with no lingering trail at rest, and re-ignites when the cursor moves again. (R-19)
- **D-08:** The hero tagline and meta line are retargeted to lead with AI building, with the employer kept generic; tagline is "I build AI systems with a ground-truth understanding of how real operations work" and meta is "SYRACUSE IMT '27 / DATA SCIENCE INTERN / AI ENGINEERING". (R-21)

### About
- **D-09:** The about copy replaces both `aboutParagraphs` and `landingAbout` in `src/data/about.ts` with the APPROVED narrative from REDESIGN-SPEC.md section 4.2, verbatim, in a grounded-confident, evidence-backed voice. (R-21, R-21a)
- **D-10:** The about section surfaces the approved pull quote: "The question is never whether I can build it. It is what to build next." (R-21a)

### Projects
- **D-11:** Projects render as vertically stacked full-viewport overview panels with GSAP scroll-driven entrance animation, and each panel is itself a scroll destination. (R-22)
- **D-12:** Clicking a project opens a full-screen, scrollable pop-out case study composed of ordered demo sections, where each demo section is a scroll destination that plays a short muted clip on scroll-into-view or shows a screenshot plus explanatory text. (R-23)
- **D-13:** Demo media uses swappable placeholders (an image slot and a video slot) that can be replaced with real assets without any code change. (R-24)
- **D-14:** The featured project set becomes Quant Edge Tracker, AI News Agent, and EV Trainer; the prior set (GTO Poker, Algo Trading, SchoolworkTrack) and the `/projects/[slug]` MDX route are retired. (R-25)
- **D-15:** The project data model in `src/data/projects.ts` is extended to support id, slug, title, hook, overview, tech, status, links, heroImage, and an ordered demos array of demo sections with type, src, poster, caption, and body. (R-26)
- **D-16:** The pop-out is accessible: focus trap while open, ESC to close, background scroll lock, focus return to the trigger on close, and a reduced-motion fallback that shows the poster or screenshot with no autoplay. (R-27)
- **D-17:** Quant Edge Tracker and EV Trainer soften the gambling angle and are framed around statistics, data analytics, modeling, and game theory rather than betting or poker. (R-21b)

### Harness
- **D-18:** The harness section is distilled to six capability pillars (Second Brain as RAG, GSD Workflow, Multi-Agent Research, Sub-Agent Execution, Context Engineering, Guardrails), each rendered as a card with a short headline plus one to two sentences, and the prior tabbed data-dense UI is removed along with the `harness.ts` data dump (trimmed drastically or deleted). (R-28)

### Resume & Contact
- **D-19:** The resume renders inline on the single page, reflects the current Data Science Intern role, rebuilds the projects subsection to match the featured set with the softened framing, and retains a PDF download. (R-29)
- **D-20:** Employer names are kept generic on the public site, and specific employer names plus the phone number appear only on the downloadable resume PDF. (R-21b)
- **D-21:** A persistent contact section is the final scroll target and shows Emstacho@syr.edu, LinkedIn, and GitHub, with no phone number anywhere on the public site. (R-21b)

### Polish, Accessibility & Verification
- **D-22:** No em dashes appear anywhere in site copy or data files; periods, commas, colons, or parentheses are used instead, applied as a global sweep across all copy and data. (R-20)
- **D-23:** Every new animation, covering the hero grid, project panels, the pop-out, and scrollspy, short-circuits under `prefers-reduced-motion`. (R-30)
- **D-24:** Verification requires that next build, vitest, and lint pass cleanly, the harness-tab tests are updated as that UI changes, and Lighthouse performance is at least 95 with accessibility at 100. (R-31)

### Claude's Discretion
- Redirect mechanism: choose between Next.js config `redirects()` and middleware based on phase research of the installed Next 16 App Router redirect APIs (`next.config.ts` already exists).
- Exact per-project hook and overview-line wording, within the softened statistics/analytics/game-theory framing and the no-em-dash convention.
- Section-view analytics event shape, naming, and intersection-trigger thresholds, as long as the existing `/api/analytics` contract is preserved.
- Component decomposition, file organization, GSAP ScrollTrigger configuration, and Lenis wiring details.
- Placeholder asset paths, dimensions, and poster handling.
- Whether section components are reused/refactored in place or restructured, as long as the section IDs and anchors match the nav.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design contract and requirements
- `.planning/REDESIGN-SPEC.md` — full design spec: section designs (4.1-4.6), approved hero/about copy, project data model, motion/interaction rules (5), technical constraints (6), out-of-scope (7), and open items (9).
- `.planning/requirements.md` — Milestone 2 requirements R-13 through R-31 with work-area grouping.
- `.planning/ROADMAP.md` — Phase 2 scope by area, success criteria, and global conventions (no em dashes; stack constraints).

### Existing source to read/modify (verify exact contents during planning)
- `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/template.tsx` — current `/` composition and providers.
- `src/data/about.ts`, `src/data/projects.ts`, `src/data/resume.ts`, `src/data/harness.ts` — data layer to retarget/extend/trim.
- `src/components/sections/` — `hero.tsx`, `about.tsx`, `about-skills.tsx`, `projects.tsx`, `resume.tsx`, `contact.tsx`, `interested-cta.tsx` (last to be removed).
- `src/components/navigation/` — `navbar.tsx`, `mobile-menu.tsx`, `footer.tsx` (anchor nav + scrollspy).
- `src/components/fx/hero-grid.tsx` — thermodynamic grid (full-bleed + idle-clear changes).
- `src/components/projects/project-card.tsx` — current project rendering (overview panels + pop-out).
- `src/app/harness/_components/*` — tabbed harness UI (`HarnessTabs.tsx`, `InventoryTable.tsx`, etc.) to be removed/distilled into six pillars.
- `src/app/api/analytics/route.ts`, `src/hooks/use-analytics.ts`, `src/lib/analytics/` — analytics contract (do not break; move to section-view events).
- `src/app/interested/`, `src/app/projects/[slug]/`, `src/app/resume/`, `src/app/harness/` — routes to consolidate + redirect.
- `next.config.ts` — redirect configuration entry point.
- `src/app/globals.css` — Tailwind v4 `@theme inline` tokens and aesthetic.
- `src/lib/animation.ts`, `src/hooks/use-typing-animation.ts` — existing motion helpers and reduced-motion patterns.
- `src/__tests__/` — Vitest suites (components, hooks, lib) that must stay green; harness-tab tests to update.

### Platform docs (per AGENTS.md, mandatory before routing/redirect work)
- `node_modules/next/dist/docs/` — installed Next.js 16.2.2 guides; read the relevant guide before writing routing/redirect/MDX code.
</canonical_refs>

<specifics>
## Specific Ideas

- Scroll order and nav (REDESIGN-SPEC.md section 3): `Nav: ES_ | About · Projects · Harness · Resume · Contact`; `Scroll: Hero -> About -> Projects -> Harness -> Resume -> Contact (footer)`.
- Approved About copy is final and verbatim in REDESIGN-SPEC.md section 4.2 (do not invent or paraphrase the locked beats).
- Six harness pillars with one-liners are tabulated in REDESIGN-SPEC.md section 4.4; the story to land is "I engineer the system around the AI (retrieval, orchestration, context, guardrails)," not "I use AI."
- Project data model target shape (`DemoSection`, `Project` interfaces) is specified in REDESIGN-SPEC.md section 4.3.
- Featured project framings (REDESIGN-SPEC.md section 4.3): Quant Edge Tracker (sports analytics + edge modeling; React 19 + TS + Vite, Tailwind v4, shadcn/ui, Supabase, Recharts, Vercel), AI News Agent (autonomous daily briefing; FastAPI, Claude API, Resend, Fly.io; later Claude Code Routines + Resend MCP), EV Trainer (game-theory decision-modeling trainer; TS + React + Supabase).
- Motion: Lenis smooth scroll; GSAP ScrollTrigger for panel entrances and pop-out demo sections; clips autoplay muted on scroll-into-view and pause when out of view; scrollspy drives active nav.
- Public contact: Emstacho@syr.edu, LinkedIn, GitHub. Phone only on the downloaded resume PDF.
</specifics>

<deferred>
## Deferred Ideas

- Real demo videos and screenshots — placeholders (image + video slots) ship now; real media dropped in later with no code change.
- New backends or data sources — none in this phase.
- Resume PDF auto-generation from data — stays manual unless raised later.
</deferred>

---

*Phase: 02-single-page-portfolio-redesign*
*Context gathered: 2026-05-24 via PRD Express Path (`.planning/REDESIGN-SPEC.md`)*
