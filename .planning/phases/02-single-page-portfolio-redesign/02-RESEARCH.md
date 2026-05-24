# Phase 2: Single-Page Portfolio Redesign - Research

**Researched:** 2026-05-24
**Domain:** Next.js 16 App Router single-page architecture; scroll-driven motion (GSAP ScrollTrigger + Lenis); accessible full-screen modal; IntersectionObserver (scrollspy, section-view analytics, video autoplay); Tailwind v4 full-bleed; redirect strategy
**Confidence:** HIGH (external APIs verified via Context7 against the exact installed versions; codebase read directly)

## Summary

This is a refactor of an existing, well-structured Next.js 16.2.2 + React 19.2.4 portfolio. The motion stack the spec calls for is already installed and partially wired: Lenis is mounted as `ReactLenis root` in `layout.tsx` via `src/app/providers/lenis-provider.tsx`, Motion 12 drives section reveals, and a canvas-based thermodynamic grid already exists (`src/components/ui/interactive-thermodynamic-grid.tsx`, used by the hero) alongside a second DOM-based grid (`src/components/fx/hero-grid.tsx`, currently unused by the hero). GSAP 3.15 + `@gsap/react` are in `package.json` but no GSAP code exists yet, so the ScrollTrigger work is greenfield-on-top-of-existing-Lenis. The accessible pop-out maps almost 1:1 onto Base UI's `Dialog` (the project's shadcn `base-nova` style sits on `@base-ui/react`), which provides focus trap, ESC, scroll-lock, and focus-return natively, removing the need to hand-roll any of it.

Two findings change the plan materially. First, **`node_modules` is not installed in this working tree** (verified: `node_modules` directory absent; `node v24.15.0`, `npm 11.12.1` present). This is why the `AGENTS.md`-mandated path `node_modules/next/dist/docs/` does not exist and cannot be read. Execution must begin with `npm install` (Wave 0), and the Next-docs mandate is satisfied here via Context7 pinned to `/vercel/next.js/v16.2.2` (the exact installed version). Second, in Next 16.2.2 a config redirect with `permanent: true` returns **HTTP 308, not 301** [CITED: github.com/vercel/next.js/blob/v16.2.2/docs/01-app/02-guides/redirecting.mdx]. To emit a literal 301 you must use the `statusCode: 301` option instead of `permanent`. Both 301 and 308 are permanent and SEO-safe; the requirement language ("301") should be read as "a permanent redirect," and the planner should pick `permanent: true` (308) unless a literal 301 is explicitly required.

The analytics contract is a fixed Zod enum (`page_view | project_click | resume_download | contact_click`); adding section-view events means extending that enum and the DB-insert path, which is a one-line, backward-compatible change with an accompanying test update. The biggest QA surface is motion feel (GSAP entrances, video autoplay timing, scrollspy accuracy) plus Lighthouse, all of which are manual/visual; the deterministic surfaces (data model, redirect table, analytics event shape, reduced-motion short-circuit) are unit-testable.

**Primary recommendation:** Keep the existing Lenis provider but switch it to `autoRaf: false` and drive `lenis.raf` from `gsap.ticker` so ScrollTrigger and Lenis share one clock; build the pop-out on Base UI `Dialog` (not hand-rolled); use `next.config.ts` `redirects()` (not middleware) for all six legacy routes; extend the analytics Zod enum for `section_view`; and route every new animation through a single `useReducedMotion()`/`matchMedia` gate that already exists as a convention in this repo.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Legacy-route 301/308 redirects | Frontend Server (Next config) | — | `redirects()` runs at the routing layer before render; no client involvement, survives JS-off |
| Anchor smooth-scroll + scrollspy | Browser/Client | — | Requires live scroll position and `IntersectionObserver`; client-only |
| Project overview panel entrances | Browser/Client | — | GSAP ScrollTrigger is a client-runtime, DOM-measuring effect |
| Pop-out case-study modal | Browser/Client | — | Focus trap, scroll-lock, portal all require the DOM |
| Scroll-into-view video autoplay | Browser/Client | — | Media element + IntersectionObserver, gated by browser autoplay policy |
| Section-view analytics events | Browser/Client (detect) -> API (persist) | Database (Supabase) | IO fires client-side; existing `/api/analytics` route persists to `page_events` |
| Project / about / resume content | Database-of-record is the `src/data/*.ts` files (build-time) | — | Static content; no runtime fetch. Page is RSC shell + client islands |
| Hero thermodynamic grid | Browser/Client (canvas) | — | Pointer-driven canvas rAF loop; client-only, `aria-hidden` |
| Full-bleed grid layout | CSS (build-time) | — | Pure layout via viewport-width breakout; no JS |

---

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Single scrollable page at `/`; hero, about, projects, harness, resume, contact render as in-page sections, not routes. (R-13)
- **D-02:** Top nav becomes in-page anchor links (About, Projects, Harness, Resume, Contact) that smooth-scroll via Lenis, with a scrollspy active state. (R-14)
- **D-03:** `/interested` route and the Interested CTA/button are removed entirely. (R-15)
- **D-04:** Former routes `/projects`, `/projects/[slug]`, `/resume`, `/harness`, `/interested`, `/toolkit` issue 301 redirects to the matching section anchor on `/`. (R-16)
- **D-05:** Supabase `/api/analytics` keeps working; per-route `page_view` replaced with section-view events where appropriate; no analytics regression. (R-17)
- **D-06:** Thermodynamic hero grid spans the full viewport width, not clipped to the 1200px container. (R-18)
- **D-07:** Grid heat clears promptly when the cursor stops (cool to clear at idle, no lingering trail), re-ignites on movement. (R-19)
- **D-08:** Hero tagline = "I build AI systems with a ground-truth understanding of how real operations work"; meta = "SYRACUSE IMT '27 / DATA SCIENCE INTERN / AI ENGINEERING". (R-21)
- **D-09:** About copy replaces both `aboutParagraphs` and `landingAbout` in `src/data/about.ts` with the APPROVED narrative from REDESIGN-SPEC.md §4.2, verbatim. (R-21, R-21a)
- **D-10:** About surfaces the pull quote: "The question is never whether I can build it. It is what to build next." (R-21a)
- **D-11:** Projects render as vertically stacked full-viewport overview panels with GSAP scroll-driven entrance animation; each panel is a scroll destination. (R-22)
- **D-12:** Clicking a project opens a full-screen scrollable pop-out case study composed of ordered demo sections; each demo section is a scroll destination that plays a short muted clip on scroll-into-view or shows a screenshot plus text. (R-23)
- **D-13:** Demo media uses swappable placeholders (image slot + video slot) replaceable with real assets with no code change. (R-24)
- **D-14:** Featured set becomes Quant Edge Tracker, AI News Agent, EV Trainer; prior set (GTO Poker, Algo Trading, SchoolworkTrack) and the `/projects/[slug]` MDX route are retired. (R-25)
- **D-15:** `src/data/projects.ts` model extended to: id, slug, title, hook, overview, tech, status, links, heroImage, and an ordered `demos` array (type, src, poster, caption, body). (R-26)
- **D-16:** Pop-out is accessible: focus trap, ESC to close, background scroll lock, focus return to trigger on close, reduced-motion fallback (poster/screenshot, no autoplay). (R-27)
- **D-17:** Quant Edge Tracker and EV Trainer soften the gambling angle, framed around statistics, data analytics, modeling, game theory. (R-21b)
- **D-18:** Harness distilled to six pillar cards (Second Brain as RAG, GSD Workflow, Multi-Agent Research, Sub-Agent Execution, Context Engineering, Guardrails); tabbed UI and `harness.ts` dump removed/trimmed drastically. (R-28)
- **D-19:** Resume renders inline, reflects Data Science Intern role, rebuilds projects subsection to match featured set with softened framing, retains PDF download. (R-29)
- **D-20:** Employer names generic on public site; specific names + phone appear only on the downloadable PDF. (R-21b)
- **D-21:** Persistent contact section is the final scroll target: Emstacho@syr.edu, LinkedIn, GitHub; no phone anywhere on public site. (R-21b)
- **D-22:** No em dashes anywhere in copy or data files; use periods, commas, colons, parentheses; applied as a global sweep. (R-20)
- **D-23:** Every new animation (grid, panels, pop-out, scrollspy) short-circuits under `prefers-reduced-motion`. (R-30)
- **D-24:** Verification: `next build`, vitest, lint pass cleanly; harness-tab tests updated as that UI changes; Lighthouse performance >= 95, accessibility = 100. (R-31)

### Claude's Discretion
- Redirect mechanism: choose between `next.config.ts` `redirects()` and middleware (research below recommends `redirects()`).
- Exact per-project hook and overview-line wording (softened statistics/analytics/game-theory framing, no em dashes).
- Section-view analytics event shape, naming, and intersection-trigger thresholds, as long as the existing `/api/analytics` contract is preserved.
- Component decomposition, file organization, GSAP ScrollTrigger configuration, Lenis wiring details.
- Placeholder asset paths, dimensions, and poster handling.
- Whether section components are reused/refactored in place or restructured, as long as section IDs and anchors match the nav.

### Deferred Ideas (OUT OF SCOPE)
- Real demo videos and screenshots (placeholders ship now; real media dropped in later with no code change).
- New backends or data sources.
- Resume PDF auto-generation from data (stays manual).

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| R-13 | Single scrollable page; all sections on `/` | Q-Architecture: compose sections in `src/app/page.tsx`; existing `Section` primitive already emits `id=`. Retire route pages. |
| R-14 | Anchor nav + Lenis smooth-scroll + scrollspy | Q4 (scrollspy via IntersectionObserver) + Q2 (`lenis.scrollTo('#id')`). Navbar `NAV_LINKS` href must change from routes to hashes. |
| R-15 | Remove `/interested` + CTA | Delete `src/app/interested/`, `src/components/sections/interested-cta.tsx`, and its import in `page.tsx`. |
| R-16 | 301 redirects from legacy routes | Q1: `next.config.ts redirects()`; note 308-vs-301 semantics; `[slug]` -> `:slug` wildcard. |
| R-17 | Section-view analytics, no regression | Q6: extend Zod enum + insert path; reuse `useAnalytics`/`getSessionId`; add IO trigger. |
| R-18 | Full-bleed hero grid | Q7: viewport-width breakout in Tailwind v4; current grid clipped by `max-w-[1200px]` wrapper in hero. |
| R-19 | Grid heat clears at idle | Q8: tune `coolingFactor` / add idle-decay in `interactive-thermodynamic-grid.tsx`. |
| R-20 | No em dashes | Global sweep; grep `—` (U+2014) across `src/`. Found in `harness/page.tsx` and elsewhere. |
| R-21 / R-21a | AI-builder copy + narrative About | D-08/D-09/D-10 give verbatim copy; replace `TAGLINE`/`META` in `hero.tsx` and `landingAbout`/`aboutParagraphs` in `about.ts`. |
| R-21b | Generic employers, softened framing, public contact | Copy edits in data files + resume + footer (footer already correct: email/LinkedIn/GitHub, no phone). |
| R-22 | Stacked full-viewport panels + GSAP entrance | Q2 (GSAP ScrollTrigger + `useGSAP`); new `projects` section replaces card grid. |
| R-23 | Scrollable pop-out with demo sections | Q3 (Base UI Dialog) + Q5 (scroll-into-view video). |
| R-24 | Swappable placeholder media | Q5: data-driven `src`/`poster`; reuse `PlaceholderImage`; add a video slot component. |
| R-25 | New featured set | Rewrite `src/data/projects.ts` array. |
| R-26 | Extended data model | Q (data migration): `DemoSection` + `Project` interfaces from REDESIGN-SPEC §4.3. |
| R-27 | Pop-out accessibility | Q3: Base UI Dialog gives focus trap/ESC/scroll-lock/focus-return free; add reduced-motion fallback. |
| R-28 | Six-pillar harness | Q (tests): delete `harness/_components/*`, `harness.ts` dump, related tests; new pillar cards. |
| R-29 | Inline resume + PDF | `resume.tsx` already inline-capable and has PDF link; rebuild projects subsection in `resume-content`. |
| R-30 | Reduced-motion short-circuit | Q9: single `useReducedMotion()`/`matchMedia` gate convention already present. |
| R-31 | Build/test/lint/Lighthouse | Q10 + Validation Architecture; Wave 0 `npm install` is a hard prerequisite. |

---

## Standard Stack

All already in `package.json`. **Nothing new needs to be installed for the locked decisions.** The only optional add is Base UI's Dialog, which is part of the already-declared `@base-ui/react` dependency (no new package).

### Core
| Library | Version (package.json) | Purpose | Why Standard |
|---------|------------------------|---------|--------------|
| next | 16.2.2 | App Router, `redirects()`, RSC | Pinned; redirect API verified against this exact tag |
| react / react-dom | 19.2.4 | Runtime | Installed |
| gsap | ^3.15.0 | ScrollTrigger panel entrances + pop-out demo scroll | Spec-mandated; ScrollTrigger is the industry-standard scroll-driven engine |
| @gsap/react | ^2.1.2 | `useGSAP` hook: scoped animation + automatic cleanup | Official GSAP React adapter; handles `gsap.context` revert on unmount |
| lenis | ^1.3.23 | Smooth scroll + programmatic `scrollTo` for anchors | Already mounted as `ReactLenis root` |
| motion | ^12.38.0 | Existing section reveals, `useReducedMotion`, `MotionConfig` | Already the reduced-motion source of truth (`AnimationProvider`) |
| @base-ui/react | ^1.3.0 | `Dialog` for the accessible pop-out | base-nova shadcn style is built on Base UI; Dialog ships focus trap/scroll-lock/ESC/focus-return |
| @supabase/ssr | ^0.10.0 | Analytics persistence (do not break) | Existing `/api/analytics` contract |
| zod | ^4.3.6 | Analytics event validation | Existing `analyticsEventSchema` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^1.7.0 | Icons (Download, Mail, X, etc.) | Already used in nav/footer/resume |
| class-variance-authority / clsx / tailwind-merge | — | `cn()` styling | Existing `src/lib/utils.ts` |
| vitest | ^4.1.2 | Unit tests | Existing suites |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Base UI `Dialog` | Hand-rolled modal (like `mobile-menu.tsx`) | Hand-rolled gives full control but you re-implement focus trap, ESC, scroll-lock, focus-return, `aria-modal`, inert background. The mobile menu currently does only scroll-lock + `aria-modal` and has no focus trap. Reusing Dialog is strictly safer for R-27. |
| `next.config.ts redirects()` | `middleware.ts` (`NextResponse.redirect`) | Middleware runs on every request (perf + Edge cost) and emits 307/308 by default; config redirects are declarative, static, and the documented choice for "old URL -> new URL" structural moves. Use middleware only if you need request-time logic (none here). |
| GSAP ScrollTrigger for scrollspy | IntersectionObserver | IO is lighter, has zero animation-engine coupling, and is the right tool for "which section is active." Reserve ScrollTrigger for the panel entrance animations. |
| GSAP for panel entrances | Motion (`whileInView`) | Motion already drives reveals and would avoid a second engine. But the spec explicitly mandates GSAP ScrollTrigger and the scroll-driven "entrance as you scroll" with scrub is more idiomatic in ScrollTrigger. Keep Motion for simple reveals, GSAP for scrubbed panel choreography. |

**Installation (Wave 0, mandatory before anything else):**
```bash
npm install        # node_modules is NOT present in this tree
npm run build      # confirm baseline builds before edits
npx vitest run     # confirm baseline green before edits
```

**Version verification:** Versions are read from `package.json` (the lockfile/registry could not be queried because `node_modules` is absent and no `npm view` was run; the planner should treat the carets as "current minor"). Redirect, GSAP, Lenis, and Base UI APIs below were verified against the exact pinned doc tags (`/vercel/next.js/v16.2.2`, `/greensock/gsap-skills`, `/darkroomengineering/lenis`, `/mui/base-ui/v1.3.0`).

---

## Architecture Patterns

### System Architecture Diagram

```
                          REQUEST to /projects, /resume, /harness,
                          /interested, /toolkit, /projects/<slug>
                                        |
                                        v
                       +-------------------------------------+
                       | next.config.ts  async redirects()   |   <- routing layer, pre-render
                       | permanent:true (308) | statusCode301|
                       +-------------------------------------+
                                        |  Location: /#projects (etc.)
                                        v
   REQUEST to /  ---->  +-------------------------------------+
                        |  app/layout.tsx (RSC shell)         |
                        |   BootProvider                      |
                        |   HeroLoader (cinematic)            |
                        |   LenisProvider (ReactLenis root)   |---- autoRaf:false ----+
                        |     AnimationProvider (MotionConfig)|                       |
                        |       Navbar (anchor links)         |                       v
                        |       app/page.tsx                  |              +------------------+
                        |         <section id=hero>           |              | gsap.ticker      |
                        |         <section id=about>          |              |  -> lenis.raf()  |
                        |         <section id=projects> ------+--+           |  -> ST.update()  |
                        |         <section id=harness>        |  |           +------------------+
                        |         <section id=resume>         |  |                    ^
                        |         <section id=contact/footer> |  | click panel        | scroll events
                        +-------------------------------------+  v                    |
                                  |  scroll                +-----------------+        |
                                  v                        | Base UI Dialog  |        |
                        +------------------+               |  (portal)       |        |
                        | IntersectionObs  |               |  Backdrop       |        |
                        |  - scrollspy ----+--> active nav  |  Viewport(scrl) |        |
                        |  - section_view -+--> analytics    |   Popup         |        |
                        |  - video play   |                 |    demo sections+--------+ (ST scoped
                        +------------------+                 |    <video muted |          to dialog
                                  |                          |     playsinline>|          scroller)
                                  v                          +-----------------+
                        +------------------+                         |
                        | POST /api/       |                         | lenis.stop() on open
                        |  analytics       |<------------------------+ lenis.start() on close
                        | Zod -> Supabase  |
                        | page_events tbl  |
                        +------------------+
```

### Recommended Project Structure
Reuse the existing tree; the deltas are:
```
src/
  app/
    page.tsx                 # compose ALL sections (hero..contact) here
    layout.tsx               # keep providers; LenisProvider gets autoRaf:false + ticker
    interested/              # DELETE
    projects/                # DELETE (page.tsx + [slug]/page.tsx)
    resume/                  # DELETE
    harness/                 # DELETE page + _components/* (distill into a section)
    api/analytics/route.ts   # extend insert to accept section_view
  components/
    sections/
      hero.tsx               # new tagline/meta; full-bleed grid wrapper
      about.tsx              # consume new landingAbout
      projects.tsx           # REWRITE: stacked full-viewport panels (GSAP)
      harness.tsx            # NEW: six pillar cards (replaces app/harness page)
      resume.tsx             # keep; rebuild projects subsection
      contact.tsx            # ensure it is the final scroll target (or fold into footer)
      interested-cta.tsx     # DELETE
    projects/
      project-panel.tsx      # NEW: one full-viewport overview panel
      project-popout.tsx     # NEW: Base UI Dialog case study
      demo-section.tsx       # NEW: video/image demo block w/ scroll-into-view autoplay
      project-card.tsx       # DELETE or repurpose (current grid card)
    fx/
      hero-grid.tsx          # unused duplicate; delete or ignore (hero uses ui/ version)
  hooks/
    use-analytics.ts         # add trackSectionView
    use-scrollspy.ts         # NEW: IntersectionObserver active-section hook
    use-section-view.ts      # NEW: fire-once-per-section analytics IO hook
    use-in-view-video.ts     # NEW: muted autoplay/pause IO hook
  data/
    projects.ts              # REWRITE shape + featured set
    about.ts                 # REWRITE landingAbout + aboutParagraphs
    resume.ts                # update role + projects subsection
    harness.ts               # TRIM to six pillars (or delete + inline)
  lib/
    animation.ts             # add GSAP ease/duration tokens alongside Motion tokens
```

### Pattern 1: Lenis + GSAP ScrollTrigger shared ticker (replaces current autoRaf)
**What:** The current `LenisProvider` lets Lenis run its own rAF (`autoRaf` defaults to true). For ScrollTrigger to stay in sync, Lenis must (a) drive `lenis.raf` from `gsap.ticker` and (b) call `ScrollTrigger.update` on every Lenis scroll. Disable `autoRaf` so there is exactly one rAF loop.
**When to use:** Whenever any ScrollTrigger exists on the page (projects panels + pop-out demos).
**Example:**
```tsx
// Source: github.com/darkroomengineering/lenis/blob/main/packages/react/README.md
//       + github.com/greensock/gsap-skills (ScrollTrigger integration)
'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    lenis.on('scroll', ScrollTrigger.update);
    const update = (time: number) => lenis.raf(time * 1000); // s -> ms
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, /* keep existing duration/easing */ }}>
      {children}
    </ReactLenis>
  );
}
```
Keep the repo's existing boot-gating (`lenis.stop()` until `bootReady`) and the reduced-motion `lenis.destroy()` branch. Note: if reduced-motion destroys Lenis, the ticker loop has nothing to drive; guard the `update` fn with `if (!lenisRef.current?.lenis) return;` or skip the ticker wiring entirely under reduced motion.

### Pattern 2: Panel entrance with `useGSAP` (scoped, auto-cleanup)
**What:** Scroll-driven entrance per project panel using `useGSAP` so the animation is scoped to the panel ref and reverted on unmount.
**When to use:** Each full-viewport project overview panel (R-22).
**Example:**
```tsx
// Source: github.com/greensock/gsap-skills (useGSAP scoped animations)
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ProjectPanel({ project }) {
  const panel = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useGSAP(() => {
    if (reduce) return; // R-30 short-circuit; content stays in final state
    gsap.from(panel.current!.querySelectorAll('[data-animate]'), {
      y: 60, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: panel.current, start: 'top 70%', end: 'top 30%', toggleActions: 'play none none reverse' },
    });
  }, { scope: panel, dependencies: [reduce] });

  return <section ref={panel} className="min-h-screen ...">{/* data-animate elements */}</section>;
}
```

### Pattern 3: Accessible pop-out via Base UI Dialog (do not hand-roll)
**What:** A single controlled Dialog rendered once, opened with the clicked project's payload. Base UI provides focus trap, ESC close, background scroll-lock, focus return, and `aria-modal` out of the box (R-27). Use `Dialog.Viewport` as the scroll container so the case study is scrollable.
**When to use:** Project case-study pop-out (R-23, R-27).
**Example:**
```tsx
// Source: github.com/mui/base-ui/blob/v1.3.0/docs/.../dialog/page.mdx
'use client';
import { Dialog } from '@base-ui/react/dialog';

export function ProjectPopout({ open, project, onOpenChange }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-foreground/40" />
        <Dialog.Viewport className="fixed inset-0 overflow-y-auto">  {/* scroll container */}
          <Dialog.Popup className="min-h-screen w-full bg-background">
            <Dialog.Title className="sr-only">{project?.title}</Dialog.Title>
            <Dialog.Close aria-label="Close case study" className="fixed top-4 right-4 z-10">×</Dialog.Close>
            {project?.demos.map((d, i) => <DemoSection key={i} demo={d} scroller={/* the Viewport el */} />)}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```
Pair the dialog with Lenis pause: on `onOpenChange(true)` call `lenis.stop()`, on `false` call `lenis.start()` (Source: Lenis modal example). Base UI already locks the body scroll; pausing Lenis prevents the smooth-scroll engine from fighting the locked body. The Dialog's `Viewport` becomes a *native* scroll container (Lenis only owns the root), so demo-section ScrollTriggers inside the dialog must set `scroller: viewportEl` rather than the default window.

### Pattern 4: Scrollspy via IntersectionObserver (not ScrollTrigger)
**What:** Track the active section id and reflect it in the nav underline.
**When to use:** R-14 active-nav state. Works with Lenis (IO observes layout, not scroll velocity) and degrades cleanly under reduced motion.
**Example:**
```tsx
// Pattern (IntersectionObserver) - standard, framework-agnostic
'use client';
import { useEffect, useState } from 'react';

export function useScrollspy(ids: string[], rootMargin = '-45% 0px -45% 0px') {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 1] }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids.join(','), rootMargin]);
  return active;
}
```
The `-45% 0px -45% 0px` rootMargin makes "active" mean "crosses the vertical center," which feels correct for full-viewport sections. Nav links call `lenis.scrollTo('#id', { offset: -64 })` (offset = navbar height) on click.

### Pattern 5: Scroll-into-view muted video (swappable placeholder)
**What:** Data-driven `demo.type === 'video'` plays muted on intersection, pauses on exit; `image` shows the screenshot. Reduced motion or `demo.poster` shows the still with no autoplay.
**When to use:** R-23, R-24, R-27, R-30.
**Example:**
```tsx
// Source: developer.chrome.com/blog/autoplay + IO play/pause pattern (web search)
'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

export function DemoVideo({ src, poster, scroller }: { src: string; poster?: string; scroller?: Element | null }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const v = ref.current; if (!v || reduce) return; // reduced motion -> poster only, no observer
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {/* autoplay blocked: poster stays */});
      else v.pause();
    }, { root: scroller ?? null, threshold: 0.5 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, scroller]);
  return <video ref={ref} src={reduce ? undefined : src} poster={poster} muted playsInline loop preload="none" />;
}
```
`muted` + `playsInline` are mandatory (Safari requires `playsinline`; unmuted autoplay is blocked). Always `.catch()` the `play()` promise. `preload="none"` protects the Lighthouse budget. When the demo lives inside the Dialog, pass the Dialog `Viewport` element as `root` so visibility is measured against the scroll container, not the window.

### Pattern 6: Full-bleed inside a centered container (Tailwind v4)
**What:** Break the hero grid out to full viewport width while the hero text stays in the 1200px column. The hero currently wraps the grid in `max-w-[1200px] mx-auto`, which clips it.
**When to use:** R-18.
**Example:**
```tsx
// CSS-only breakout; no JS, no layout shift
<div
  aria-hidden="true"
  className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen overflow-hidden pointer-events-none"
>
  <ThermodynamicGrid resolution={18} coolingFactor={0.90} interactive={...} />
</div>
```
`left-1/2 -translate-x-1/2 w-screen` re-centers a child against the viewport regardless of the parent's max-width. Use `w-screen` (not `100vw`) so it accounts for the scrollbar gutter and does not introduce horizontal overflow; ensure an ancestor has `overflow-x: hidden` (the `body`/`html` already behave under Lenis root). The grid's own `ResizeObserver` will re-measure to the new width automatically.

### Anti-Patterns to Avoid
- **Two rAF loops (Lenis autoRaf + GSAP ticker):** causes jitter and double-stepping. Set `autoRaf: false`. [CITED: lenis react README]
- **Server 301 to a hash (`/#projects`):** the hash is never sent to the server, so a redirect's `Location: /#projects` works only because the *browser* keeps the fragment, but you cannot *match* on a fragment server-side. Redirect to the path (`/`) and let the fragment ride along, or use a query (`/?s=projects`) + client scroll. See Q1.
- **Hand-rolling the modal:** re-implements four accessibility behaviors Base UI already ships. The existing `mobile-menu.tsx` is missing a focus trap and would fail R-27 if copied.
- **GSAP ScrollTrigger for scrollspy:** over-couples nav state to the animation engine; IO is the right tool.
- **ScrollTrigger inside the Dialog using the default (window) scroller:** demo animations won't fire because the dialog scrolls its own container. Set `scroller` to the Dialog Viewport.
- **`w-screen` without `overflow-x-hidden` ancestor:** introduces a horizontal scrollbar and a Lighthouse CLS hit.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible modal (focus trap, ESC, scroll-lock, focus-return, aria-modal) | Custom overlay div | Base UI `Dialog` (already a dependency) | Four a11y behaviors, each with edge cases (focus restoration, inert background, nested focusables). R-27 demands all of them. |
| Smooth scroll + anchor navigation | Custom `scrollTo` with easing | Lenis `lenis.scrollTo('#id')` (already mounted) | Lenis already owns scroll; a second smooth-scroll implementation would fight it. |
| Scroll-position sync for animations | Manual scroll listeners + math | GSAP ScrollTrigger + Lenis ticker | ScrollTrigger handles refresh, pin, scrub, resize; manual listeners drift and miss refresh-on-layout. |
| Active-section detection | Scroll math against `offsetTop` | IntersectionObserver | IO is declarative, threshold-aware, and cheap; manual math breaks with dynamic heights. |
| Video play/pause on scroll | Scroll listeners | IntersectionObserver | IO fires exactly at visibility thresholds without scroll-event throttling. |
| Permanent redirects | Client-side `router.replace` | `next.config.ts redirects()` | Client redirects lose SEO and flash; config redirects are emitted at the routing layer. |
| Event validation | Manual `typeof` checks | Existing Zod `analyticsEventSchema` | Already the contract; extend the enum, keep validation centralized. |

**Key insight:** Almost every "build" in this phase has a first-class library already in the dependency list. The phase is integration and content, not invention. The one genuinely custom piece is the thermodynamic grid idle-clear (Q8), which is a tuning change to existing canvas code.

## Runtime State Inventory

> Refactor/rename phase: this section is required.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Supabase `page_events` table stores `event_type` values from a fixed enum. Adding `section_view` writes a NEW enum value into existing rows' column. No existing rows change. If the DB column has a CHECK/enum constraint mirroring the Zod enum, it must be widened. | Verify the `page_events.event_type` column type (free text vs. Postgres enum/CHECK). If constrained, run a migration to allow `section_view`. If free text, code-only change. **Cannot verify the DB schema from this repo (no Supabase access in this session) -> open question.** |
| Live service config | Vercel project: legacy URLs (`/projects`, `/resume`, `/harness`, `/interested`, `/toolkit`, `/projects/[slug]`) may exist as indexed pages / inbound links / OG references. Redirects must be live before deploy to preserve SEO. The existing `/toolkit -> /harness` redirect in `next.config.ts` must be RE-TARGETED to `/#harness` (since `/harness` itself is being removed). | Update `next.config.ts`; verify in Vercel preview that all six sources 30x to `/`. |
| OS-registered state | None. No cron, scheduler, pm2, or systemd state. | None - verified by repo inspection (no infra config files). |
| Secrets / env vars | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` consumed by `/api/analytics/route.ts`. Names unchanged by this phase. | None - code references the same names; no rename. |
| Build artifacts / installed packages | **`node_modules` is absent from the working tree.** No `.next` build cache present either (not checked, but irrelevant pre-install). | `npm install` is a hard Wave 0 prerequisite before build/test/lint/dev. |

**The canonical question:** After every file is updated, what runtime systems still hold the old strings? Answer: (1) the live Vercel routing/SEO surface for the six legacy URLs - handled by `redirects()`; (2) the Supabase `event_type` column constraint - needs verification; (3) `node_modules` - must be installed.

## Common Pitfalls

### Pitfall 1: `permanent: true` returns 308, not 301
**What goes wrong:** Requirement R-16/D-04 say "301." A `next.config.ts` redirect with `permanent: true` emits **308** in Next 16.2.2. A reviewer checking for a literal `301` status will see `308`.
**Why it happens:** Next maps `permanent` to 308 (the modern method-preserving permanent redirect). [CITED: github.com/vercel/next.js/blob/v16.2.2/docs/01-app/02-guides/redirecting.mdx]
**How to avoid:** Decide explicitly. Use `permanent: true` (308) for clean, modern, SEO-equivalent permanence (recommended), OR use `statusCode: 301` (the `redirects()` entry supports `statusCode` for a literal 301; note `permanent` and `statusCode` are mutually exclusive). Document the choice so verification checks the right code.
**Warning signs:** A test asserting `response.status === 301` fails with `308`.

### Pitfall 2: Hash fragment cannot be matched or set reliably server-side
**What goes wrong:** Naively writing `destination: '/#projects'` looks right but the fragment is purely a browser concern. You cannot `source`-match on a fragment, and whether the fragment in `destination` is honored on a 30x is browser-dependent.
**Why it happens:** Per HTTP, the fragment identifier is not sent to the server; browsers attach the destination's fragment to the final URL on most engines, but this is not guaranteed for all 30x flows.
**How to avoid:** Two robust options: (A) redirect to `/` (path only) and accept that the user lands at the top; or (B) redirect to a query like `/?s=projects` and add a tiny client effect on `page.tsx` that reads `?s=` and calls `lenis.scrollTo('#projects')` then cleans the URL. Option B is the recommended approach because it actually delivers the user to the right section (the intent of D-04). Including `destination: '/#projects'` as a best-effort is acceptable as a supplement but should not be the only mechanism.
**Warning signs:** Redirected users land at the top of the page instead of the named section.

### Pitfall 3: ScrollTrigger refresh after the boot loader / dialog open
**What goes wrong:** The hero has a cinematic loader gating layout (`bootReady`). If ScrollTriggers are created before final layout settles (fonts load, loader hands off, dialog mounts), their start/end positions are wrong.
**Why it happens:** ScrollTrigger measures positions at creation; layout shifts invalidate them.
**How to avoid:** Call `ScrollTrigger.refresh()` after `bootReady` flips true and after the Dialog opens/closes (or create dialog ScrollTriggers in a `useGSAP` scoped to the dialog so they mount with it). The fontshare web-font import (`globals.css` line 1) can also shift metrics; `ScrollTrigger.refresh()` after `document.fonts.ready` is a cheap safeguard.
**Warning signs:** Panel animations fire too early/late, or not at all on first load but correctly after a resize.

### Pitfall 4: Two reduced-motion sources of truth
**What goes wrong:** The repo gates reduced motion three different ways: `useReducedMotion()` (Motion, in `about.tsx`/`reveal.tsx`), raw `window.matchMedia('(prefers-reduced-motion: reduce)')` (in `hero.tsx`, `hero-grid.tsx`, `interactive-thermodynamic-grid.tsx`, `lenis-provider.tsx`), and a global CSS `@media (prefers-reduced-motion: reduce)` killswitch in `globals.css`. New code mixing approaches can produce partial short-circuits.
**Why it happens:** Organic growth; no single helper.
**How to avoid:** For React components prefer `useReducedMotion()` (consistent with `AnimationProvider`'s `MotionConfig reducedMotion`). For imperative/canvas/GSAP code use `matchMedia` once and store in a ref (as the grid already does). Both are acceptable; the rule for R-30 is: every new animation must check one of them before animating. The global CSS killswitch is a backstop, not a substitute (it cannot stop JS-driven canvas heat or GSAP timelines).
**Warning signs:** An animation still runs under "reduce" because only the CSS backstop applied, not the JS guard.

### Pitfall 5: Lenis vs. Dialog scroll-lock double-management
**What goes wrong:** Base UI Dialog locks `body` scroll while open; Lenis (root) also manages scroll on the body. If Lenis keeps running, it can fight the lock or the background can still "smooth scroll" behind the modal.
**Why it happens:** Two systems own scroll.
**How to avoid:** `lenis.stop()` on open, `lenis.start()` on close (Lenis modal example). The Dialog's own scroll container (`Viewport`) is native and unaffected.
**Warning signs:** Background scrolls behind the open pop-out, or scroll feels frozen after closing.

### Pitfall 6: Em dash already present in shipped copy
**What goes wrong:** R-20/D-22 forbids em dashes, but they already exist in the codebase (e.g., `src/app/harness/page.tsx` hero copy uses "—", and several harness `_components` likely do too). Since harness is being rewritten the dump goes away, but the sweep must cover all surviving copy and data.
**How to avoid:** Grep `—` (em dash, "—") and `–` (en dash, "–") across `src/` after content edits; a lint check or a Vitest assertion over the `src/data/*.ts` exports can enforce it (see Validation Architecture).
**Warning signs:** A reviewer or grep finds "—" in any rendered copy.

## Code Examples

### Redirect table (next.config.ts) - recommended shape
```ts
// Source: github.com/vercel/next.js/blob/v16.2.2/docs/01-app/.../redirects.mdx
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // permanent:true => 308 (modern permanent; SEO-equivalent to 301)
      { source: '/projects', destination: '/?s=projects', permanent: true },
      { source: '/projects/:slug*', destination: '/?s=projects', permanent: true }, // retire dynamic detail route
      { source: '/resume', destination: '/?s=resume', permanent: true },
      { source: '/harness', destination: '/?s=harness', permanent: true },
      { source: '/interested', destination: '/?s=contact', permanent: true }, // or '/'
      { source: '/toolkit', destination: '/?s=harness', permanent: true },     // RETARGET old /toolkit->/harness
    ];
  },
};
export default nextConfig;
// If a LITERAL 301 is required, replace `permanent: true` with `statusCode: 301` per-entry.
```

### Client scroll-to-section from `?s=` (in page.tsx or a small client child)
```tsx
'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// NOTE: useSearchParams requires a <Suspense> boundary in Next App Router.
export function ScrollFromQuery({ lenis }: { lenis: /* Lenis */ any }) {
  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const s = params.get('s');
    if (!s) return;
    lenis?.scrollTo(`#${s}`, { offset: -64 });
    router.replace('/', { scroll: false }); // clean the URL
  }, [params, lenis, router]);
  return null;
}
```

### Extended analytics enum (backward-compatible)
```ts
// src/lib/analytics/types.ts  (Source: existing repo file, extended)
export const eventTypes = [
  'page_view', 'project_click', 'resume_download', 'contact_click',
  'section_view', // NEW
] as const;
// route.ts already passes event_target through; section_view uses event_target = section id.
```

### Extended project data model
```ts
// src/data/projects.ts  (Source: REDESIGN-SPEC.md §4.3)
export interface DemoSection {
  type: 'video' | 'image';
  src: string;       // placeholder path for now (swappable)
  poster?: string;   // shown under reduced motion / before play
  caption: string;
  body: string;
}
export interface Project {
  id: string; slug: string; title: string;
  hook: string; overview: string;
  tech: string[]; status: 'shipped' | 'in-progress';
  links: { repo?: string; live?: string };
  heroImage: string;
  demos: DemoSection[];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 301 for permanent redirects | `permanent: true` => 308 (method-preserving); `statusCode` for literal 301 | Next.js (long-standing) | "301" in requirements should be read as "permanent redirect"; 308 is the modern default |
| Manual `gsap.context()` + `useEffect` cleanup | `useGSAP` hook from `@gsap/react` (auto-revert, `contextSafe`) | `@gsap/react` 2.x | Cleaner React integration; the repo already depends on it |
| Lenis `autoRaf` self-driving rAF | Drive `lenis.raf` from `gsap.ticker` when ScrollTrigger is present | Lenis 1.x docs | Single rAF loop; required for sync |
| Hand-rolled modals | Base UI `Dialog` (Radix/Floating-UI lineage) | Base UI 1.x | Free, correct a11y; matches base-nova |

**Deprecated/outdated:**
- `framer-motion` import path: the repo correctly uses `motion/react` (Motion 12), not `framer-motion`. New code must keep importing from `motion/react`.
- The unused `src/components/fx/hero-grid.tsx` (DOM-cell grid) is superseded by the canvas `src/components/ui/interactive-thermodynamic-grid.tsx` the hero actually renders. Make idle-clear changes (Q8) in the canvas version; consider deleting the DOM one.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The Supabase `page_events.event_type` column is free text (not a constrained Postgres enum/CHECK), so adding `section_view` is code-only. | Runtime State Inventory / Q6 | If constrained, inserts of `section_view` fail at runtime; needs a DB migration. **Verify via Supabase before relying on it.** |
| A2 | `@base-ui/react` (per package.json) is the correct import scope `@base-ui/react/dialog`. The Context7 v1.3.0 docs use exactly this path. node_modules is absent so this could not be filesystem-verified. | Q3 / Standard Stack | If the published package name differs (e.g. `@base-ui-components/react`), the import path changes. Confirm after `npm install`. |
| A3 | The `redirects()` entry supports a `statusCode` option for a literal 301 at config level (the documented `redirect` shape supports `statusCode` xor `permanent`). | Q1 / Pitfall 1 | If config-level `statusCode` is unsupported in 16.2.2, literal-301 needs middleware. `permanent: true` (308) is unaffected and is the recommended path. |
| A4 | Lighthouse perf >= 95 is achievable with GSAP + Lenis + lazy `preload="none"` videos on this content-light page. | Q10 | If unmet, may require deferring GSAP load or reducing ScrollTrigger count. Measured only at verification time. |
| A5 | No middleware.ts exists today (none found in app/root scan), so adding redirects is purely a `next.config.ts` edit. | Q1 | If a middleware file exists elsewhere, redirect precedence interacts. Low risk; scan found none. |

## Open Questions

1. **Supabase `event_type` column constraint (blocks A1).**
   - What we know: Code validates via Zod; route inserts `event_type` string into `page_events`.
   - What's unclear: Whether the DB column constrains the value set (enum/CHECK).
   - Recommendation: Before the analytics task, inspect the `page_events` schema in Supabase. If constrained, add the migration to the plan as its own task. If free text, no DB work.
2. **301 vs 308 decision (resolves Pitfall 1).**
   - What we know: `permanent: true` = 308; `statusCode: 301` = literal 301.
   - What's unclear: Whether "301" in R-16 is literal or shorthand for "permanent."
   - Recommendation: Default to `permanent: true` (308). Only use `statusCode: 301` if a stakeholder requires the literal code. Either way, document it so verification asserts the chosen code.
3. **Redirect destination granularity.**
   - What we know: Server can redirect to `/` or `/?s=section`; fragments are browser-only.
   - Recommendation: Use `/?s=<section>` + client `lenis.scrollTo` (Pattern in Code Examples) so users land on the right section, satisfying the spirit of D-04.
4. **Contact as section vs. folded into footer.**
   - What we know: Spec wants a "persistent contact section as the final scroll target"; the footer already renders contact links and is the last element.
   - Recommendation: Add an `id="contact"` landing section above/around the footer (so the anchor exists and scrollspy can target it); keep the footer. Cheap, satisfies R-14 and R-21b.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | build/test/dev | ✓ | v24.15.0 | — |
| npm | install/scripts | ✓ | 11.12.1 | — |
| node_modules (installed deps) | build, test, lint, dev, ALL execution | ✗ | — | **None - must `npm install`** |
| `node_modules/next/dist/docs/` (AGENTS.md mandate) | redirect/routing research | ✗ | — | Context7 `/vercel/next.js/v16.2.2` (used here) |
| Supabase project access | verify `page_events` schema (A1) | ✗ (not checked in session) | — | Inspect via Supabase dashboard/MCP during execution |
| git | branching/commits | ✓ | (repo present) | — |

**Missing dependencies with no fallback:**
- `node_modules` is not installed. `npm install` is a hard Wave 0 prerequisite; nothing else (build, vitest, lint, dev server) can run until it completes. This is the single biggest execution gate.

**Missing dependencies with fallback:**
- The AGENTS.md-mandated `node_modules/next/dist/docs/` path does not exist (consequence of the missing install, and these docs are not shipped in the npm tarball regardless). The Next 16.2.2 redirect/routing facts in this document were verified against Context7 pinned to the exact version tag `/vercel/next.js/v16.2.2`, which is the authoritative substitute. After `npm install`, the executor should still confirm there is no shipped docs folder before assuming the AGENTS.md path is readable.

## Validation Architecture

> `.planning/config.json` is absent, so `nyquist_validation` defaults to ENABLED.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 (jsdom, globals on) + @testing-library/react 16 + @testing-library/jest-dom |
| Config file | `vitest.config.ts` (alias `@` -> `src`; setup `src/__tests__/setup.ts`) |
| Quick run command | `npx vitest run src/__tests__/lib` (deterministic units, fast) |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| R-16 | All six legacy sources redirect (correct status + destination) | integration (config assertion) | `npx vitest run src/__tests__/lib/redirects.test.ts` | ❌ Wave 0 (import `nextConfig.redirects()` and assert the array) |
| R-17 | Analytics schema accepts `section_view` + still accepts legacy events | unit | `npx vitest run src/__tests__/lib/analytics.test.ts` | ✅ (extend existing) |
| R-26 | Project data model: every project has required fields + ordered demos with valid `type` | unit | `npx vitest run src/__tests__/data/projects.test.ts` | ❌ Wave 0 |
| R-20 | No em dash (U+2014) in any `src/data/*.ts` export | unit | `npx vitest run src/__tests__/lib/em-dash.test.ts` | ❌ Wave 0 (assert over data exports) |
| R-30 | Reduced-motion short-circuit: animated components render final state, no inline transition, under `matchMedia` reduce | unit (RTL) | `npx vitest run src/__tests__/components/reduced-motion.test.tsx` | ❌ Wave 0 (mock `matchMedia`, pattern exists in `ArchitectureTab.test.tsx`) |
| R-27 | Pop-out focus trap / ESC / focus-return (Base UI behavior + our wiring) | integration (RTL) | `npx vitest run src/__tests__/components/project-popout.test.tsx` | ❌ Wave 0 (assert dialog opens on trigger, ESC closes, `onOpenChange` fires) |
| R-14 | Scrollspy hook sets active id from IO entries | unit (RTL, mock IntersectionObserver) | `npx vitest run src/__tests__/hooks/use-scrollspy.test.ts` | ❌ Wave 0 (jsdom has no real IO; mock it) |
| R-28 | Harness renders six pillars; old tab UI gone | unit (RTL) | `npx vitest run src/__tests__/components/harness.test.tsx` | ❌ Wave 0 (REPLACES `HarnessTabs.test.tsx` + `ArchitectureTab.test.tsx`) |
| R-13/R-22/R-23 | One-page composition; panels animate; pop-out scrolls | manual / visual | Vercel preview + manual QA | manual (GSAP/Lenis feel not jsdom-testable) |
| R-18/R-19 | Full-bleed grid; idle-clear heat | manual / visual | local + preview | manual (canvas rAF + pointer) |
| R-24 | Video autoplay on scroll / pause / poster fallback | manual / visual | preview (real browser autoplay policy) | manual (jsdom has no media playback) |
| R-31 | build + lint + Lighthouse | gate | `npm run build && npm run lint`; Lighthouse in preview | manual for Lighthouse |

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/lib src/__tests__/data` (fast deterministic units)
- **Per wave merge:** `npx vitest run` (full suite) + `npm run lint`
- **Phase gate:** `npm run build` clean, full vitest green, `npm run lint` clean, Lighthouse perf >= 95 / a11y = 100 in Vercel preview, then `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] `npm install` (no `node_modules`) - hard prerequisite for every command above.
- [ ] `src/__tests__/lib/redirects.test.ts` - asserts the six-entry redirect table (R-16).
- [ ] `src/__tests__/data/projects.test.ts` - validates the new model + featured set (R-26, R-25).
- [ ] `src/__tests__/lib/em-dash.test.ts` - enforces R-20 over data exports.
- [ ] `src/__tests__/components/reduced-motion.test.tsx` - R-30 (reuse `matchMedia` mock pattern from `ArchitectureTab.test.tsx`).
- [ ] `src/__tests__/hooks/use-scrollspy.test.ts` - mock `IntersectionObserver` (not in jsdom) in `setup.ts`.
- [ ] `src/__tests__/components/project-popout.test.tsx` - dialog open/close/ESC (R-27).
- [ ] `src/__tests__/components/harness.test.tsx` - six pillars; DELETE `HarnessTabs.test.tsx` + `ArchitectureTab.test.tsx` (they import deleted modules and WILL break - R-28).
- [ ] Add `IntersectionObserver` and (optionally) `HTMLMediaElement.prototype.play/pause` stubs to `src/__tests__/setup.ts` since jsdom lacks both.
- [ ] Extend `src/__tests__/lib/analytics.test.ts` for `section_view` (R-17).

### Tests that WILL break (must update/delete)
- `src/__tests__/components/HarnessTabs.test.tsx` - imports `@/app/harness/_components/HarnessTabs` (deleted). **Delete.**
- `src/__tests__/components/ArchitectureTab.test.tsx` - imports `@/app/harness/_components/ArchitectureTab` and `@/data/harness` `layers` (deleted/trimmed). **Delete** (keep its `matchMedia` mock pattern as a template for the new reduced-motion test).
- `src/__tests__/lib/analytics.test.ts` - still passes, but should gain a `section_view` case.
- `src/__tests__/lib/session.test.ts`, `src/__tests__/hooks/use-typing-animation.test.ts` - unaffected (session + hero typing survive).

## Security Domain

> `security_enforcement` config absent (= enabled). This phase is a public, read-only marketing site with one POST endpoint.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth on the site |
| V3 Session Management | no | Analytics `session_id` is a client-generated non-security id (`getSessionId`), not an auth session |
| V4 Access Control | no | All content public |
| V5 Input Validation | yes | `/api/analytics` already validates with Zod (`analyticsEventSchema.safeParse`); extend enum, keep validation. New `section_view` `event_target` is a short string id - keep it bounded (it goes to Supabase via parameterized client insert). |
| V6 Cryptography | no | No secrets handled client-side beyond the public anon key (by design) |

### Known Threat Patterns for this stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Analytics endpoint spam / junk events | Tampering / DoS | Zod schema rejects malformed bodies (already present); Supabase anon insert is append-only to `page_events`. Consider (not required this phase) a length cap on `event_target`. |
| Reflected `?s=` query into client scroll | Tampering | `?s=` is used only as `document.getElementById(`#${s}`)` / `lenis.scrollTo` target - never injected into HTML; invalid ids no-op. Do not pass `s` into `innerHTML` or selectors beyond id lookup. |
| External links (LinkedIn/GitHub/repos) | - | `rel="noopener noreferrer"` already applied in footer; apply the same to any new external project links. |
| Open redirect via redirects() | - | All `destination` values are static internal paths; no user input flows into the redirect target. Safe. |

No new attack surface beyond the existing analytics POST. The redirect table is static. Keep Zod validation and `rel="noopener noreferrer"` on external anchors.

## Suggested Wave / Sequencing

A single phase; suggested wave order to keep main green and parallelize safely:

- **Wave 0 - Foundation (blocking, do first):** `npm install`; confirm baseline `next build` + `vitest` + `lint` green; add jsdom stubs (`IntersectionObserver`, media `play/pause`) to `setup.ts`; scaffold the new test files. Nothing else can run until install completes.
- **Wave 1 - Architecture & routing (low-risk, unblocks layout):** Compose all sections into `page.tsx`; switch `LenisProvider` to `autoRaf:false` + GSAP ticker; convert navbar `NAV_LINKS` to hash anchors + `lenis.scrollTo`; add `next.config.ts` redirects (+ test); delete `/interested`, `/projects`, `/resume`, `/harness` route trees and `interested-cta.tsx`; add `?s=` client scroll. Ship the scrollspy hook here too (independent of content).
- **Wave 2 - Content & data (parallelizable, mostly independent files):** Rewrite `src/data/projects.ts` (model + featured set), `about.ts` (verbatim copy), `resume.ts`/resume projects subsection, distill `harness.ts` -> six pillars + new `harness.tsx` section (delete the two harness tests, add the pillar test); hero `TAGLINE`/`META`; global em-dash sweep + test. These touch different files than Wave 1/3 and can run concurrently.
- **Wave 3 - Projects system (highest-risk, depends on Wave 1 motion wiring + Wave 2 data):** Stacked full-viewport panels with `useGSAP` ScrollTrigger entrances; Base UI Dialog pop-out (+ Lenis stop/start); `DemoSection` video/image with IO autoplay; `ScrollTrigger.refresh()` on boot/dialog; pop-out a11y test.
- **Wave 4 - Hero grid & polish:** Full-bleed grid breakout (R-18); idle-clear heat tuning in `interactive-thermodynamic-grid.tsx` (R-19); reduced-motion audit across all new animations (R-30) + test.
- **Wave 5 - Verification gate:** Full `vitest`, `lint`, `build`; Vercel preview; Lighthouse perf >= 95 / a11y = 100; manual QA of scroll feel, video autoplay, pop-out UX; verify all six redirects in preview; confirm Supabase still logging (incl. `section_view`).

## Sources

### Primary (HIGH confidence)
- Context7 `/vercel/next.js/v16.2.2` - redirects in `next.config.ts` (`permanent` => 308, `statusCode`, `:slug`/`:slug*` wildcards, `has`/`missing`), `permanentRedirect()`. Files: `docs/01-app/02-guides/redirecting.mdx`, `docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.mdx`.
- Context7 `/greensock/gsap-skills` - `useGSAP` scoped animations + `contextSafe`, `gsap.context()` cleanup, ScrollTrigger integration + `scrollerProxy`, `ScrollTrigger.refresh()` guidance. Files: `skills/gsap-scrolltrigger/SKILL.md`, `skills/gsap-frameworks/SKILL.md`, `README.md`.
- Context7 `/darkroomengineering/lenis` - GSAP ticker integration (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`), `ReactLenis` ref + `autoRaf:false`, `scrollTo('#id', {offset})`, `stop()/start()` modal pattern. Files: `README.md`, `packages/react/README.md`, `llms.txt`.
- Context7 `/mui/base-ui/v1.3.0` - `Dialog` anatomy (Root/Trigger/Portal/Backdrop/Viewport/Popup), controlled `open`/`onOpenChange`, inside/outside scroll, `createHandle`/`payload`, nested dialogs. File: `docs/.../components/dialog/page.mdx`.
- Direct codebase read: `package.json`, `next.config.ts`, `src/app/{page,layout,template}.tsx`, `src/app/providers/{lenis,animation}-provider.tsx`, `src/components/sections/{hero,about,projects,resume}.tsx`, `src/components/navigation/{navbar,mobile-menu,footer}.tsx`, `src/components/ui/interactive-thermodynamic-grid.tsx`, `src/components/fx/hero-grid.tsx`, `src/components/projects/project-card.tsx`, `src/components/ui/{reveal,section}.tsx`, `src/lib/{animation,boot-context}.ts(x)`, `src/lib/analytics/types.ts`, `src/hooks/use-analytics.ts`, `src/app/api/analytics/route.ts`, `src/data/{about,projects}.ts`, `src/app/harness/page.tsx`, `src/__tests__/*`, `src/app/globals.css`, `vitest.config.ts`, `components.json`.
- Shell probes: `node_modules` absent; `node v24.15.0`; `npm 11.12.1`; no `.planning/config.json`; no `.claude/skills` or `.agents/skills`.

### Secondary (MEDIUM confidence)
- Chrome autoplay policy + IntersectionObserver play/pause: muted + `playsInline` required, `.catch()` the `play()` promise. (developer.chrome.com/blog/autoplay; benfrain.com; cloudinary guides - web search 2026-05-24.)

### Tertiary (LOW confidence)
- Supabase `page_events.event_type` column constraint - NOT verified (no DB access this session); flagged as A1 / Open Question 1.

## Metadata

**Confidence breakdown:**
- Redirect API (Next 16.2.2): HIGH - verified against the exact installed version tag.
- GSAP + Lenis integration: HIGH - verified against official GSAP skills and Lenis React docs; matches the repo's existing `ReactLenis` setup.
- Base UI Dialog: HIGH for API shape (v1.3.0 docs); MEDIUM on exact import scope until `npm install` confirms package name (A2).
- Analytics migration: HIGH on code path; LOW on DB constraint (A1).
- Reduced-motion / scrollspy / video patterns: HIGH (standard, plus existing repo conventions).
- Lighthouse achievability: MEDIUM (A4) - measured only at verification.

**Research date:** 2026-05-24
**Valid until:** 2026-06-23 (30 days; stable pinned stack). Re-verify if `package.json` versions change or `node_modules` is installed at a different minor.
