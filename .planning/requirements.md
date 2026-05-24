# Requirements

## Milestone 1 — Harness Page (shipped)

| ID | Requirement | Source |
|----|-------------|--------|
| R-1 | A new route `/harness` exists under App Router and renders a Server-Component page. | User prompt |
| R-2 | Page documents the 10-layer Claude Code harness (workflow, persistent memory, auto-memory, context discipline, skill packs, plugins, hook pipeline, MCP servers, storage, CLI host) with name + 1-line purpose + tooling badges per layer. | User prompt |
| R-3 | Page includes the OneDrive → AppData migration narrative (corruption pattern, phantom port 37777, three-config-file fix). | Memory: `project_claude_mem_migration_2026-05-07.md` |
| R-4 | Page includes the chroma orphan reaping bug story (4-deep process chain, detection rule, upstream fix proposal). | Memory: `reference_claude_mem_chroma_leak.md` |
| R-5 | Page includes the localhost inventory table (37778 worker / 37777 phantom / 8765 Atlas) with status + owner-process columns. | `HARNESS-LOCALHOST-INVENTORY.md` |
| R-6 | An interactive architecture diagram acts as the page hero, ported from the IA + SVG/CSS structure of `harness-diagram/index.html`. | User prompt |
| R-7 | Diagram color treatment is monochrome + crimson — no 6-hue subsystem palette. Crimson is the only accent (active/hover states). | Locked decision |
| R-8 | The placeholder `/toolkit` page is deleted; navbar label updates to "Harness" pointing at `/harness`; a permanent 301 redirect exists from `/toolkit` to `/harness`. | Locked decision |
| R-9 | The page achieves Lighthouse perf ≥ 95 (mobile + desktop) and a11y = 100. | User prompt (constraint) |
| R-10 | The architecture diagram is keyboard-navigable: every layer reachable via Tab, has `aria-label`, and the active layer is announced via `aria-current`. | User prompt (a11y) |
| R-11 | All animations short-circuit under `prefers-reduced-motion`. | Existing portfolio convention + user prompt |
| R-12 | An OG image renders at `/harness/opengraph-image` matching the editorial paper + crimson aesthetic. | User prompt |

## Milestone 2 — Single-Page Redesign

All requirements belong to the single **Phase 2 — Single-Page Portfolio Redesign**. The Area column groups them into work areas within that one phase (useful for wave-based execution).

| ID | Requirement | Area |
|----|-------------|------|
| R-13 | Site is a single scrollable page; hero, about, projects, harness, resume, and contact all render as sections on `/`. | Architecture & nav |
| R-14 | Top nav contains anchor links (About, Projects, Harness, Resume, Contact) that smooth-scroll to sections; the active section is reflected via scrollspy. | Architecture & nav |
| R-15 | The `/interested` route and the Interested CTA/button are removed entirely. | Architecture & nav |
| R-16 | Former routes (`/projects`, `/projects/[slug]`, `/resume`, `/harness`, `/interested`, legacy `/toolkit`) issue 301 redirects to the matching section anchor on `/`. | Architecture & nav |
| R-17 | Supabase analytics continues to function; section-view events replace per-route `page_view` where appropriate; no analytics regression. | Architecture & nav |
| R-18 | The hero thermodynamic grid spans the full viewport width, not clipped to the content container. | Hero |
| R-19 | The thermodynamic grid heat (red squares) clears promptly when the cursor stops moving; no lingering trail at rest. | Hero |
| R-20 | No em dashes appear anywhere in site copy or data files. | All / Polish sweep |
| R-21 | Hero and about copy lead with AI-building; QA/process background is reframed as ground-truth understanding of manufacturing and business operations; the current role "Data Science Intern" is surfaced with the employer kept generic on the public site. | Hero & About |
| R-21a | About section is personal and narrative per the locked beats in REDESIGN-SPEC.md section 4.2 (cross-section upbringing, build origin, learning speed, QA+stats=reliable-AI differentiator); voice is grounded-confident and evidence-backed, not narcissistic. | About |
| R-21b | Public site keeps employer names generic and softens the gambling angle on Quant Edge and EV Trainer (statistics/analytics/game-theory framing); public contact is Emstacho@syr.edu, LinkedIn, GitHub; phone only on the resume PDF. | All |
| R-22 | Projects render as vertically stacked full-viewport overview panels with scroll-driven entrance animation. | Projects |
| R-23 | Clicking a project opens a full-screen, scrollable pop-out case study composed of demo sections; each demo section is a scroll destination that plays a short muted clip on scroll-into-view or shows a screenshot plus explanatory text. | Projects |
| R-24 | Demo media uses placeholders (image + video slots) replaceable with real assets without code changes. | Projects |
| R-25 | Featured projects are Quant Edge Tracker, AI News Agent, and EV Trainer; the prior set is retired. | Projects |
| R-26 | The project data model supports slug, hook, overview, ordered demo sections (type, src, caption, body), tech stack, and links. | Projects |
| R-27 | The pop-out is accessible: focus trap, ESC to close, background scroll lock, focus return on close, and reduced-motion fallback (no autoplay; poster/screenshot shown). | Projects |
| R-28 | The harness section is distilled to six capability pillars (Second Brain as RAG, GSD Workflow, Multi-Agent Research, Sub-Agent Execution, Context Engineering, Guardrails), each a short headline plus one to two sentences; the prior data-dense tab UI is removed. | Harness |
| R-29 | The resume section renders inline, reflects the current Data Science Intern role, rebuilds the projects subsection to match the featured set, and retains a PDF download. | Resume |
| R-30 | All animations short-circuit under `prefers-reduced-motion`. | Polish |
| R-31 | Build, tests (vitest), and lint pass; Lighthouse performance >= 95 and accessibility = 100. | Verification |
