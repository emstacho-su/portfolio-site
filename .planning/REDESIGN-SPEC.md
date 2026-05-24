# Single-Page Portfolio Redesign — Design Spec

**Owner:** Evan Stachowiak
**Created:** 2026-05-24
**Status:** Approved in brainstorming; ready for GSD planning (`/gsd-plan-phase` per phase)
**Supersedes:** the multi-page direction in `REDESIGN_ROADMAP.md` (kept for history)
**Source:** brainstorming session 2026-05-24 (decisions captured below)

---

## 1. Goal & audience

Rebuild the portfolio as a single scrollable page that showcases real projects and the AI-engineering system used to build them. Audience is potential recruiters and employers. The site is itself a project on display, so build quality and polish are part of the message.

Positioning: an AI builder whose edge is a ground-truth understanding of how real businesses and manufacturing actually operate, currently a Data Science Intern at E.C. Styberg Engineering. The QA / ISO / process background is framed as that ground-truth understanding, not as "auditing."

---

## 2. Audience, tone & content conventions

**Primary audience:** the CEO / founding-engineer track at Arzana (a soft offer is in play), then AI, software, and data-science recruiters generally. Write to a sharp technical reader who can tell substance from fluff.

**Voice:** grounded confidence with a warm but technical assertiveness, plus a bit of dry wit. Self-assured, but every claim is backed by evidence. Never narcissistic or self-aggrandizing. Demonstrate intelligence and learning speed through the record; do not assert them flatly. First person; he/him; name shown as "Evan Stachowiak."

**Positioning throughline:** an unusually fast, curious problem-solver who builds reliable systems with AI. The differentiator is the combination of a QA/operations heritage (analytical, critical, knows how a real business runs), a genuine passion for statistics, and IMT coursework, which together make him good at building with AI and keeping it reliable. Lead with building; the operations/QA background is supporting proof, never the headline.

**Privacy / sharing line (from the user):**
- Hometown and family/background may be hinted at, kept tasteful, not sappy or overly emotional.
- Keep employers generic on the public site ("a manufacturing company," "manufacturing operations"). Specific employer names may appear only on the downloadable resume PDF.
- Soften the gambling angle on Quant Edge and EV Trainer: frame them around statistics, data analytics, modeling, and game theory, not betting/poker.
- Public contact: Emstacho@syr.edu, LinkedIn, GitHub. Phone number only on the downloaded resume.

**Conventions:**
- No em dashes anywhere in site copy or data files. Use periods, commas, colons, or parentheses.
- Keep the warm paper + crimson editorial aesthetic and the existing design tokens.

### Proposed copy candidates (final wording in section 4)
- Tagline: "I build AI systems with a ground-truth understanding of how real operations work."
- Meta line: `SYRACUSE IMT '27 / DATA SCIENCE INTERN / AI ENGINEERING` (employer kept generic)

---

## 3. Information architecture

One scrollable page at `/`. The navbar becomes an in-page anchor menu; clicking a link smooth-scrolls to that section and the active section is reflected via scrollspy.

Scroll order and nav:

```
Nav:  ES_ | About · Projects · Harness · Resume · Contact
Scroll: Hero -> About -> Projects -> Harness -> Resume -> Contact (footer)
```

Routing changes:
- All primary content renders as sections on `/`.
- Remove `/interested` route and the Interested CTA entirely.
- Former routes (`/projects`, `/projects/[slug]`, `/resume`, `/harness`, `/interested`, and the legacy `/toolkit`) issue 301 redirects to the matching anchor on `/` so inbound links and SEO survive.
- Supabase `/api/analytics` continues to work. Replace per-route `page_view` with section-view events where appropriate. No analytics regression.

---

## 4. Section designs

### 4.1 Hero
- Keep the compile sequence and name treatment.
- Thermodynamic grid spans the **full viewport width** rather than being clipped to the 1200px content container.
- The grid heat (red squares) **clears promptly when the cursor stops moving** (cool to clear on idle; no lingering trail at rest). When the cursor moves again it re-ignites.
- Retarget tagline + meta line per section 2.

### 4.2 About (more personal, confidence-forward)
Longer and more narrative than the current condensed version. Lands one confident throughline: with this background, this way of thinking, and how fast he learns, he can build anything he can conceptualize. Evidence-backed, never boastful.

Locked beats (all user-sourced; do not invent):
1. Builder thesis up front, not the degree.
2. Cross-section origin: mother holds a doctorate in nursing education (education emphasis); father ran manufacturing companies (business/operations emphasis). Childhood split between the suburbs and a horse rescue in Wisconsin; manual labor and building/fixing alongside his father.
3. Earliest build: a horse shelter, measured from the existing one, every input and joint understood, turned into a buildable plan. That understand-the-inputs-then-build loop stuck.
4. Turning point at 13: spotted an inefficient gutter method, proposed a cleaner one, it worked. Realized he can see how things should work once he understands why they work.
5. Engine: relentless curiosity about why and how; understanding the why means he retains the concept.
6. Learning style + speed: decomposes a subject to fundamentals, builds bottom-up, learns by doing. Proof: taught himself to ski and snowboard in a day each (then instructed); taught himself the stack and shipped EV Trainer in under a week.
7. Differentiator: QA/operations heritage + statistics + IMT = building with AI and keeping it reliable. As a data science intern, flagged multiple costing-model errors in week one and automated documentation worth a small team's week of effort.
8. Close: capable problem-solver; the question is never whether he can build it, but what to build next.

Personal angles (music, poker/EV thinking, gym discipline, design taste) are woven through the copy rather than listed, per user direction.

Replaces both `aboutParagraphs` and `landingAbout` in `src/data/about.ts`. Final copy (APPROVED 2026-05-24):

> I'm Evan Stachowiak, and I build things. I grew up between two worlds: a mother with a doctorate in nursing education and a father who ran manufacturing companies. One side gave me a deep respect for understanding how things actually work; the other gave me an early, hands-on feel for how a business runs on the floor. My childhood was split between the suburbs and a horse rescue in Wisconsin, which mostly meant manual labor and weekends building and fixing things next to my dad.
>
> One of those projects was a horse shelter. We built it by measuring the old one, working out every material and how the pieces fit, and turning that into a plan we could actually execute. That loop, understand the inputs, understand how it works, then build it, has never left me. A few years later, at 13, I watched my dad run gutters in a way that made no sense to me, suggested a cleaner method, and it worked. That was when I realized I had a knack for seeing how things should work, as long as I understood why they work first.
>
> That curiosity runs through everything, not just code. I started college on a vocal performance scholarship, which is where I learned to drill a hard skill until it becomes automatic, before the build instinct won and I moved into tech. I learn the same way regardless of the subject: break it down to fundamentals, build a working understanding from the bottom up, then get hands on and learn the rest by making mistakes fast. It is how I taught myself to ski and snowboard in a day each and ended up instructing, and how I taught myself the stack for my EV Trainer and shipped it in under a week.
>
> My edge is where that curiosity meets discipline. I came up through quality and operations work in manufacturing, which made me genuinely analytical and critical about how things get built. Pair that with a real passion for statistics, the kind that has me thinking in expected value at the poker table as readily as in my work, and my information-management coursework, and you get what I actually do well: build with AI and keep it reliable. As a data science intern I put that to work right away, catching several errors in a costing model in my first week and automating documentation that would have cost a small team a week of manual effort.
>
> Everything else I have built came from the same place: sports analytics tools, an autonomous AI agent that researches and writes my morning briefing, decision-modeling trainers. Find the leverage point, learn what I need, and sweat the details until it feels right. I care how things look and not just whether they work, and the same discipline that keeps me consistent in the gym is what keeps me refining a build long after it runs. At this point the question is never whether I can build something. It is what to build next.

> Pull quote: "The question is never whether I can build it. It is what to build next."

### 4.3 Projects (centerpiece)
- The Projects section is a vertical stack of **full-viewport overview panels**, one per project, each with a scroll-driven entrance animation (GSAP + Lenis, both already installed). Each panel is a scroll destination.
- Overview panel content: project title, one-line hook, a large visual (placeholder for now), short overview line, and an affordance to open the case study.
- Clicking a panel opens a **full-screen, scrollable pop-out case study** (modal/overlay). The pop-out is composed of stacked **demo sections**, each a scroll destination that either:
  - plays a short muted video clip on scroll-into-view, or
  - shows a screenshot plus explanatory text.
- Demo media is **placeholder** for V1 (image slot + video slot) and can be swapped for real assets with no code change.
- Featured projects (retire the previous set: GTO Poker, Algo Trading, SchoolworkTrack). Framing softens the gambling angle toward statistics, data analytics, modeling, and game theory:
  1. **Quant Edge Tracker**: a sports analytics and edge-modeling platform. A data pipeline plus modeling layer that turns market lines into fair probabilities, tracks closing-line value and performance, and surfaces statistical edges with charts. React 19 + TypeScript + Vite, Tailwind v4, shadcn/ui, Supabase, Recharts, Vercel. Lead with statistics, data pipelines, and modeling, not betting.
  2. **AI News Agent**: an autonomous daily AI news briefing. FastAPI, Claude API, Resend email, persistent topic memory, hand-rolled agent loop, Fly.io. Dashboard with per-item Q&A, profile editor, and budget tracking. Later rebuilt on Claude Code Routines + Resend MCP.
  3. **EV Trainer**: a decision-modeling trainer built on game theory. Expected-value and decision-tree analysis, range and equity computation, and interactive, voice-enabled training. TypeScript + React + Supabase. Lead with applied game theory, statistics, and decision science, not poker.

#### Project data model (target shape for `src/data/projects.ts`)
```ts
interface DemoSection {
  type: 'video' | 'image';
  src: string;        // placeholder path for now
  poster?: string;    // shown under reduced-motion / before play
  caption: string;    // short label
  body: string;       // explanatory text
}
interface Project {
  id: string;
  slug: string;
  title: string;
  hook: string;          // one line for the overview panel
  overview: string;      // short paragraph
  tech: string[];
  status: 'shipped' | 'in-progress';
  links: { repo?: string; live?: string };
  heroImage: string;     // placeholder
  demos: DemoSection[];  // ordered demo sections in the pop-out
}
```

#### Pop-out accessibility
- Focus trap while open; ESC closes; background scroll locked; focus returns to the trigger on close.
- Reduced-motion: no autoplay; show poster/screenshot; entrance animations short-circuit.

### 4.4 Harness (distilled rewrite)
Replace the tab-heavy, data-dense page with a scannable inline section of **six capability pillars**. Each pillar is a short headline plus one to two sentences. Remove the inventory tables / `harness.ts` data dump (or trim drastically).

| Pillar | One-liner |
|---|---|
| Second Brain as RAG | A git-versioned Obsidian vault is the retrieval corpus. Routing rules, full-text (FTS5) search, and per-project memory pull relevant prior decisions into context on demand, so outputs are grounded and improve over time. |
| GSD Workflow | Every build runs discuss, plan, execute, verify, driven by machine-readable roadmap, spec, plan, and state artifacts. |
| Multi-Agent Research | A silent gap-check audits real knowledge; genuine gaps spin up a seminar of parallel research agents that investigate, debate, then a fresh agent synthesizes, before any code is written. |
| Sub-Agent Execution | Work is delegated to specialized subagents (planner, executor, reviewer, verifier) running in parallel and in isolation, so large builds parallelize and the main thread stays focused. |
| Context Engineering | context-mode sandboxes raw tool output in an indexed store (only summaries reach the window) and a live monitor hook warns before context fills, so long sessions do not degrade. |
| Guardrails | Lifecycle hooks enforce phase boundaries, scan reads for prompt injection, and validate commits before they run. |

Story to land: not "I use AI," but "I engineer the system around the AI (retrieval, orchestration, context, guardrails) to get reliable output on real projects."

### 4.5 Resume (inline)
- Inline section on the single page (no separate route).
- Reflect the current Data Science Intern role. Keep the employer generic on the page; full employer names and phone number may appear only on the downloadable PDF.
- Rebuild the projects subsection to match the featured set (Quant Edge Tracker, AI News Agent, EV Trainer), with the softened stats/analytics framing.
- Retain a PDF download.
- Remove em dashes.

### 4.6 Contact / footer
- Persistent contact section as the final scroll target.
- Public contact: Emstacho@syr.edu, LinkedIn, GitHub. No phone number on the public site (phone appears only on the downloaded resume PDF).
- Keep the footer structure (contact, currently, colophon).

---

## 5. Motion & interaction
- Smooth scroll via Lenis; scroll-driven animation via GSAP (ScrollTrigger) for the project overview panels and pop-out demo sections.
- Scrollspy drives the active nav state.
- Clips autoplay muted on scroll-into-view; pause when out of view.
- Every animation short-circuits under `prefers-reduced-motion`.

---

## 6. Technical constraints (verify each phase)
- Next.js 16.2.2 App Router. Consult installed Next docs before routing/redirect/MDX changes.
- Tailwind v4 (`@theme inline` in `globals.css`, no `tailwind.config.ts`).
- Motion 12.x (`motion/react`, not framer-motion); GSAP 3.15 + `@gsap/react`; Lenis 1.3.
- Supabase `@supabase/ssr` analytics at `/src/app/api/analytics/route.ts`. Do not break.
- shadcn base-nova via `components.json`.
- Vitest 4.1; existing tests under `src/__tests__/` must stay green (update harness-tab tests as that UI changes).

---

## 7. Out of scope / deferred
- Real demo videos and screenshots (placeholders ship now; real media dropped in later).
- Any new backend or data sources.
- Resume PDF auto-generation from data (kept manual unless raised later).

---

## 8. Phase map
Single phase. See `.planning/ROADMAP.md` (Milestone 2, Phase 2). Requirements R-13 through R-31 in `.planning/requirements.md`.

- Phase 2 — Single-Page Portfolio Redesign. Organized into work areas (Architecture & nav, Hero & landing content, Projects system, Harness & Resume, Polish & verification); executable in waves.

---

## 9. Open items for confirmation during phase planning
- Final hero tagline + meta wording.
- Exact hook + overview line per project.
- Whether the harness pillars render as cards or a short narrative (cards proposed).
- Redirect strategy detail (Next config redirects vs. middleware).
