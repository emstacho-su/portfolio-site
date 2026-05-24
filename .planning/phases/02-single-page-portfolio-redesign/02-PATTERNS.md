# Phase 2: Single-Page Portfolio Redesign - Pattern Map

**Mapped:** 2026-05-24
**Files analyzed:** 38 (create / modify / delete)
**Analogs found:** 33 / 38 (5 genuinely novel, see "No Analog Found")

> This is a refactor of an existing Next.js 16.2.2 site. Almost every "new" file has a direct in-repo analog. Verified paths against `git ls-files`. The motion stack (Lenis, Motion 12, GSAP+@gsap/react, Base UI) is already installed; GSAP has no code yet (greenfield). `node_modules` is absent (Wave 0 `npm install` is a hard prerequisite per RESEARCH.md).

---

## File Classification

| Target File | Action | Role | Data Flow | Closest Analog | Match Quality |
|-------------|--------|------|-----------|----------------|---------------|
| `src/app/page.tsx` | rewrite | route (composition) | request-response (RSC shell) | self (current `page.tsx`) + section components | exact |
| `src/app/layout.tsx` | modify | layout/provider host | request-response | self | exact |
| `next.config.ts` | modify | config | request-response (redirect) | self (existing `/toolkit` redirect) | exact |
| `src/app/providers/lenis-provider.tsx` | modify | provider | event-driven (rAF/scroll) | self | exact |
| `src/components/navigation/navbar.tsx` | modify | navigation | event-driven (scroll/click) | self | exact |
| `src/components/navigation/mobile-menu.tsx` | modify | navigation | event-driven | self | exact |
| `src/hooks/use-scrollspy.ts` | create | hook | event-driven (IntersectionObserver) | `interactive-thermodynamic-grid.tsx` (IO/observer cleanup); RESEARCH Pattern 4 | role-match |
| `src/hooks/use-section-view.ts` | create | hook | event-driven -> API | `use-analytics.ts` + IO cleanup pattern | role-match |
| `src/hooks/use-in-view-video.ts` | create | hook | event-driven (IO + media) | IO cleanup in grid; RESEARCH Pattern 5 | partial |
| `src/components/sections/hero.tsx` | modify | component (section) | event-driven (canvas/scroll) | self | exact |
| `src/components/sections/about.tsx` | modify | component (section) | transform (data->DOM) | self | exact |
| `src/components/sections/projects.tsx` | rewrite | component (section) | event-driven (GSAP scroll) | self + `about.tsx` SlideBlock | role-match |
| `src/components/sections/harness.tsx` | create | component (section) | transform (data->cards) | `MemoryTab.tsx` MemoryCard; `contact.tsx` card grid | role-match |
| `src/components/sections/resume.tsx` | modify | component (section) | transform | self | exact |
| `src/components/sections/contact.tsx` | modify | component (section) | transform | self | exact |
| `src/components/sections/interested-cta.tsx` | DELETE | component | - | - | - |
| `src/components/projects/project-panel.tsx` | create | component | event-driven (GSAP ScrollTrigger) | `project-card.tsx`; RESEARCH Pattern 2 | role-match |
| `src/components/projects/project-popout.tsx` | create | component (modal) | event-driven (Dialog/scroll) | `mobile-menu.tsx` (scroll-lock); Base UI Dialog (RESEARCH Pattern 3) | partial |
| `src/components/projects/demo-section.tsx` | create | component | streaming (video on scroll) | `placeholder-image.tsx`; RESEARCH Pattern 5 | partial |
| `src/components/projects/project-card.tsx` | DELETE/repurpose | component | - | - | - |
| `src/components/resume/resume-content.tsx` | modify | component | transform | self | exact |
| `src/data/projects.ts` | rewrite | model/data | static content | self (export shape) | exact |
| `src/data/about.ts` | rewrite | model/data | static content | self | exact |
| `src/data/resume.ts` | modify | model/data | static content | self | exact |
| `src/data/harness.ts` | trim/replace | model/data | static content | self | exact |
| `src/lib/analytics/types.ts` | modify | model (schema) | request-response (validation) | self (Zod enum) | exact |
| `src/hooks/use-analytics.ts` | modify | hook | event-driven -> API | self | exact |
| `src/app/api/analytics/route.ts` | modify | API route | request-response (persist) | self | exact |
| `src/lib/animation.ts` | modify | utility (tokens) | n/a | self (TIMING/EASE tokens) | exact |
| `src/app/interested/` | DELETE | route | - | - | - |
| `src/app/projects/page.tsx` | DELETE | route | - | - | - |
| `src/app/projects/[slug]/page.tsx` | DELETE | route | - | - | - |
| `src/app/resume/page.tsx` | DELETE | route | - | - | - |
| `src/app/harness/page.tsx` + `_components/*` | DELETE | route + components | - | - | - |
| `src/__tests__/lib/redirects.test.ts` | create | test | n/a | `analytics.test.ts` (import-and-assert) | role-match |
| `src/__tests__/data/projects.test.ts` | create | test | n/a | `analytics.test.ts` | role-match |
| `src/__tests__/lib/em-dash.test.ts` | create | test | n/a | `analytics.test.ts` | role-match |
| `src/__tests__/components/reduced-motion.test.tsx` | create | test | n/a | `ArchitectureTab.test.tsx` (matchMedia mock) | exact |
| `src/__tests__/components/project-popout.test.tsx` | create | test | n/a | `ArchitectureTab.test.tsx` (RTL open/ESC) | role-match |
| `src/__tests__/hooks/use-scrollspy.test.ts` | create | test | n/a | `ArchitectureTab.test.tsx` + IO mock in setup | role-match |
| `src/__tests__/components/harness.test.tsx` | create | test | n/a | `ArchitectureTab.test.tsx` | role-match |
| `src/__tests__/setup.ts` | modify | test setup | n/a | self (matchMedia stub) | exact |
| `src/__tests__/components/HarnessTabs.test.tsx` | DELETE | test | - | - | - |
| `src/__tests__/components/ArchitectureTab.test.tsx` | DELETE | test | - | - | - |

---

## Shared Patterns

Apply these cross-cutting conventions to every relevant new/modified file.

### S-1. Client directive + import conventions
**Source:** every section/component file (e.g. `src/components/sections/about.tsx:1-14`)
Interactive components are `'use client'`; path alias is `@/...` (configured in `vitest.config.ts` and `components.json`). Motion imports come from `motion/react` (NEVER `framer-motion`). Styling uses `cn()` from `@/lib/utils`. Animation tokens come from `@/lib/animation` (`TIMING`, `EASE`).
```tsx
'use client';
import { motion, useInView } from 'motion/react';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';
import { TIMING, EASE } from '@/lib/animation';
```

### S-2. Section primitive + anchor IDs
**Source:** `src/components/ui/section.tsx:9-21`; used by about/projects/resume/contact.
**Apply to:** every in-page section composed into `page.tsx`.
`Section` already emits `id=` and the `max-w-[1200px] mx-auto px-6` column. The `id` is the scroll/scrollspy anchor and MUST match the nav hash list (`about`, `projects`, `harness`, `resume`, `contact`). Hero is its own `<section id="hero">` (not via `Section`, see `hero.tsx:31-37`). Note: projects panels need full-bleed/full-viewport, so the new projects section may bypass `Section`'s max-width wrapper (see P-2).
```tsx
<section id={id} className={cn('py-10 md:py-14 px-6 max-w-[1200px] mx-auto w-full', className)}>
```

### S-3. Reduced-motion short-circuit (R-30)
**Source (React):** `src/components/sections/about.tsx:64,92-94`, `src/components/sections/interested-cta.tsx:27,37`.
**Source (imperative/canvas):** `src/components/ui/interactive-thermodynamic-grid.tsx:66`, `src/app/providers/lenis-provider.tsx:40-45`.
**Apply to:** every new animation (grid, panels, pop-out, demo video, scrollspy is exempt as it is layout-driven).
Two accepted idioms in this repo. Prefer `useReducedMotion()` in React components; use `window.matchMedia('(prefers-reduced-motion: reduce)').matches` once in imperative/canvas/GSAP code. The global CSS killswitch in `globals.css` is a backstop only.
```tsx
// React component
const prefersReducedMotion = useReducedMotion();
const style = prefersReducedMotion ? undefined : { x: xMotion, opacity: opacityMotion };

// imperative / canvas / GSAP
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) return;
```

### S-4. IntersectionObserver create-observe-disconnect cleanup
**Source:** `src/components/ui/interactive-thermodynamic-grid.tsx:233-251` (ResizeObserver, same shape); RESEARCH Patterns 4 & 5.
**Apply to:** `use-scrollspy.ts`, `use-section-view.ts`, `use-in-view-video.ts`, `demo-section.tsx`.
Standard effect: build observer, observe targets, return a disconnect cleanup. jsdom lacks `IntersectionObserver` (and media `play/pause`), so a stub must be added to `setup.ts` (see test pattern T-1).
```tsx
useEffect(() => {
  const io = new IntersectionObserver((entries) => { /* ... */ }, { root, threshold });
  targets.forEach((el) => io.observe(el));
  return () => io.disconnect();
}, [deps]);
```

### S-5. Analytics tracking handoff (props -> hook, fire-and-forget)
**Source:** `src/hooks/use-analytics.ts:23-65`; consumed in `footer.tsx:28,45`, `resume.tsx:52`, `projects.tsx:15`.
**Apply to:** any section needing a section_view / click event. Existing pattern: a section accepts an optional `onXClick?` prop; the page (a client wrapper) wires it to a `useAnalytics()` tracker. Because `page.tsx` becomes the single composition point, either make `page.tsx` a client component using `useAnalytics()`, or keep section wrappers (`ContactSectionClient`, `ResumeSectionClient` already split this way). `sendEvent` posts JSON to `/api/analytics` and swallows errors.
```tsx
const { trackProjectClick, trackResumeDownload, trackContactClick } = useAnalytics();
// pass down: <ProjectsSection onProjectClick={trackProjectClick} />
```

### S-6. External link safety
**Source:** `footer.tsx:38-44`, `contact.tsx:79-85`, `project-card.tsx:117-120`.
**Apply to:** every new external link (repo / live / LinkedIn / GitHub). `target="_blank"` + `rel="noopener noreferrer"`; `mailto:` links omit both.

### S-7. No em dashes (R-20 / D-22)
**Apply to:** all copy and data files. Found live in `src/app/harness/page.tsx:57,61` ("—") and likely other harness `_components`. Use periods, commas, colons, parentheses. Enforce via the new `em-dash.test.ts` over data exports (T-2).

---

## Pattern Assignments

### `src/app/page.tsx` (route, composition) - REWRITE

**Analog:** self (`src/app/page.tsx:1-24`) + `layout.tsx` provider ordering.

Current composition only mounts hero/about/interested-cta. Rewrite to mount ALL sections in scroll order (D-01). Keep the hairline-rule motif (`page.tsx:13-18`). The page must host the `?s=` scroll-to-section client effect (RESEARCH Code Examples) inside a `<Suspense>` (because `useSearchParams` requires it). Remove `InterestedCTA` import.

Current shape to extend:
```tsx
// src/app/page.tsx:6-24 (current)
export default function Home() {
  return (
    <>
      <CursorSpotlight />
      <main id="main-content" className="flex-1">
        <HeroSection />
        {/* hairline rule */}
        <AboutSection />
        <InterestedCTA />   {/* <- remove; add Projects, Harness, Resume, Contact */}
      </main>
    </>
  );
}
```
Target scroll order (REDESIGN-SPEC §3): Hero -> About -> Projects -> Harness -> Resume -> Contact.

---

### `src/app/layout.tsx` (provider host) - MODIFY (likely unchanged)

**Analog:** self (`src/app/layout.tsx:42-69`).

Provider nesting is already correct: `BootProvider > HeroLoader > LenisProvider > AnimationProvider > Navbar > children > Footer`. Update `metadata` title/description toward AI-building copy (D-08 tone). The footer renders inside layout, so the `contact` section anchor must live in `page.tsx` above the footer (RESEARCH Open Q4). No structural provider change needed; the Lenis/GSAP ticker change is internal to `lenis-provider.tsx`.

---

### `next.config.ts` (config, redirects) - MODIFY

**Analog:** self (`next.config.ts:3-14`) - the existing `/toolkit -> /harness permanent: true` entry is the exact template.

Per RESEARCH: `permanent: true` emits **308** in Next 16.2.2 (not literal 301); use `statusCode: 301` only if a literal 301 is mandated. Redirect to `/?s=<section>` (NOT `/#section`, fragments cannot be server-matched - Pitfall 2). RETARGET the existing `/toolkit` entry (its old destination `/harness` is being deleted).

Current (one entry) -> extend to six:
```ts
// next.config.ts (current shape, extend the array)
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/projects', destination: '/?s=projects', permanent: true },
      { source: '/projects/:slug*', destination: '/?s=projects', permanent: true },
      { source: '/resume', destination: '/?s=resume', permanent: true },
      { source: '/harness', destination: '/?s=harness', permanent: true },
      { source: '/interested', destination: '/?s=contact', permanent: true },
      { source: '/toolkit', destination: '/?s=harness', permanent: true }, // RETARGET
    ];
  },
};
```

---

### `src/app/providers/lenis-provider.tsx` (provider) - MODIFY

**Analog:** self (`src/app/providers/lenis-provider.tsx:1-52`).

Switch `LENIS_OPTIONS` to `autoRaf: false` and drive `lenis.raf` from `gsap.ticker` so ScrollTrigger and Lenis share one clock (RESEARCH Pattern 1). KEEP the existing two effects verbatim: the boot-gate (`bootReady ? lenis.start() : lenis.stop()`, lines 27-37) and the reduced-motion `lenis.destroy()` branch (lines 40-45). Under reduced motion Lenis is destroyed, so guard the ticker `update` fn against a null `lenis`.

Existing structure to preserve:
```tsx
// lines 12-20 (current) - keep duration/easing, add autoRaf:false
const LENIS_OPTIONS = { duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, /* + autoRaf: false */ };
// lines 27-45 - keep boot gate + reduced-motion destroy unchanged
```
Add (RESEARCH Pattern 1): `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add((t) => lenis.raf(t*1000))`; `gsap.ticker.lagSmoothing(0)`; remove both on cleanup.

---

### `src/components/navigation/navbar.tsx` (navigation) - MODIFY

**Analog:** self (`src/components/navigation/navbar.tsx:1-116`).

Change `NAV_LINKS` from routes to hash anchors (About/Projects/Harness/Resume/Contact). Replace `usePathname`-based `isActive` with the scrollspy active id (S-2 / `use-scrollspy.ts`). Keep the `motion.header` scroll-bg behavior (lines 29-47), the `layoutId="nav-underline"` active marker (lines 80-86), and the `ES_` logo treatment (lines 49-62). On link click, call `lenis.scrollTo('#id', { offset: -64 })` instead of route navigation (navbar height = `h-16` = 64px, line 48).

Current link list to retarget:
```tsx
// navbar.tsx:12-17 (current) - change href values to hashes
const NAV_LINKS = [
  { label: 'About', href: '/' },        // -> '#about'
  { label: 'Projects', href: '/projects' }, // -> '#projects'
  { label: 'Harness', href: '/harness' },   // -> '#harness'
  { label: 'Resume', href: '/resume' },     // -> '#resume'
  // ADD: { label: 'Contact', href: '#contact' }
] as const;
```
Active-underline pattern to keep:
```tsx
// navbar.tsx:80-86
{active && <motion.span layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-px bg-crimson" transition={{ duration: 0.25 }} />}
```

---

### `src/components/navigation/mobile-menu.tsx` (navigation) - MODIFY

**Analog:** self (`src/components/navigation/mobile-menu.tsx:1-99`).

Same hash-link retarget. KEEP the body scroll-lock effect (lines 33-42), the slide-in `AnimatePresence` (lines 45-56), and the stagger (lines 69-77). On link click, close the menu AND `lenis.scrollTo` the hash. Note: this component's `role="dialog" aria-modal="true"` (line 53-55) has scroll-lock but NO focus trap. Do NOT copy it as the pattern for the project pop-out (RESEARCH anti-pattern; use Base UI Dialog instead).

---

### `src/hooks/use-scrollspy.ts` (hook, IO) - CREATE

**Analog:** observer cleanup shape in `interactive-thermodynamic-grid.tsx:233-251`; full pattern in RESEARCH Pattern 4 (lines 346-361).

Returns the active section id from IO entries; `rootMargin: '-45% 0px -45% 0px'` makes "active" = "crosses vertical center." Drives navbar active state (replaces `usePathname`). Layout-driven, so it does NOT need a reduced-motion gate. Test against a mocked IntersectionObserver (T-3).

---

### `src/hooks/use-section-view.ts` (hook, IO -> analytics) - CREATE

**Analog:** `use-analytics.ts:13-21` (fire-once-on-mount ref guard) + S-4 IO cleanup.

Fire-once-per-section `section_view` analytics on first intersection. Reuse `useAnalytics().sendEvent`-style tracker (add a `trackSectionView` to `use-analytics.ts`, S-5). Use a `Set`/ref to ensure each section fires only once (mirror `hasFiredPageView` ref guard, `use-analytics.ts:10,17-20`).

---

### `src/hooks/use-in-view-video.ts` (hook, IO + media) - CREATE

**Analog:** S-4 cleanup; RESEARCH Pattern 5 (lines 375-388).

Muted autoplay on intersect, pause on exit. `muted` + `playsInline` mandatory; always `.catch()` the `play()` promise; `preload="none"`. Reduced-motion -> poster only, no observer (S-3). When inside the pop-out Dialog, pass the Dialog `Viewport` element as IO `root` (RESEARCH Pattern 5 note).

---

### `src/components/sections/projects.tsx` (section) - REWRITE

**Analog:** self (`src/components/sections/projects.tsx:1-50`) for heading/section scaffolding; `about.tsx` `SlideBlock` (lines 62-106) for scroll-linked motion; RESEARCH Pattern 2 for GSAP entrances.

Replace the `staggerContainer` card grid (lines 35-47) with a vertical stack of full-viewport `ProjectPanel`s. Keep the heading + animated rule (lines 21-33). The section opens the shared `ProjectPopout` on panel click (lift `open`/`activeProject` state here, render one Dialog). Keep the `onProjectClick` analytics prop (S-5).

Current grid to replace:
```tsx
// projects.tsx:35-47 (current) - replace with stacked <ProjectPanel> list + one <ProjectPopout>
<motion.div variants={staggerContainer} ... className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {projects.map((project) => <ProjectCard project={project} onExpand={onProjectClick} />)}
</motion.div>
```

---

### `src/components/projects/project-panel.tsx` (component, GSAP) - CREATE

**Analog:** `project-card.tsx` (header/badge/tech-tag markup, lines 50-90) for content; RESEARCH Pattern 2 (lines 282-306) for the `useGSAP` scoped entrance.

One full-viewport (`min-h-screen`) overview panel: title, hook, large visual (`PlaceholderImage` or `heroImage`), overview line, open-case-study affordance. Use `useGSAP({ scope, dependencies: [reduce] })` with a `ScrollTrigger` on `[data-animate]` children; short-circuit when `reduce` (S-3). Reuse `Badge` for status/tech (project-card pattern). Call `ScrollTrigger.refresh()` after `bootReady` and font load (Pitfall 3).

Content markup to adapt from project-card:
```tsx
// project-card.tsx:52-90 - title/subtitle/Badge/tech-tags shape
<h3 className="font-mono text-lg text-foreground font-semibold">{project.title}</h3>
<Badge variant="outline" className="font-mono text-[10px] shrink-0">{...}</Badge>
{project.tech.map((t) => <Badge key={t} variant="secondary" ...>{t}</Badge>)}
```

---

### `src/components/projects/project-popout.tsx` (modal) - CREATE

**Analog:** `mobile-menu.tsx:33-42` (body scroll-lock idiom only); Base UI Dialog (RESEARCH Pattern 3, lines 313-333). Do NOT hand-roll - `mobile-menu` lacks a focus trap and would fail R-27.

Single controlled `Dialog.Root` (`@base-ui/react/dialog`) rendered once, opened with the clicked project's payload. `Dialog.Viewport` is the scroll container; map `project.demos` to `<DemoSection>`. Base UI provides focus trap / ESC / scroll-lock / focus-return free (R-27). Pair with Lenis: `lenis.stop()` on open, `lenis.start()` on close (Pitfall 5). Dialog `Viewport` is a native scroller, so demo ScrollTriggers must set `scroller: viewportEl`. Confirm import path `@base-ui/react/dialog` after `npm install` (RESEARCH A2).

---

### `src/components/projects/demo-section.tsx` (component, video/image) - CREATE

**Analog:** `placeholder-image.tsx:12-44` (aspect-video media frame + in-view scan-line); `use-in-view-video.ts`; RESEARCH Pattern 5.

Data-driven block: `demo.type === 'video'` -> `<video muted playsInline loop preload="none">` with IO autoplay (via `use-in-view-video`); `image` -> screenshot (reuse `PlaceholderImage` shape). `poster`/reduced-motion shows the still, no autoplay. Each demo section is its own scroll destination with a caption + body. Keep the `aspect-video relative overflow-hidden` framing from `placeholder-image.tsx:18-24`.

---

### `src/components/sections/harness.tsx` (section, cards) - CREATE

**Analog:** `MemoryTab.tsx` MemoryCard (`MemoryTab.tsx:126-160`) for card shape; `contact.tsx:66-123` for the responsive card-grid + stagger. Replaces the entire `src/app/harness/page.tsx` + `_components/*` tab system.

Six pillar cards (Second Brain as RAG, GSD Workflow, Multi-Agent Research, Sub-Agent Execution, Context Engineering, Guardrails) from REDESIGN-SPEC §4.4: each a short headline + one to two sentences. Use `<Section id="harness">` (S-2), a `staggerContainer`/`staggerItem` grid (contact pattern), and the `border border-hairline rounded-md p-6 bg-background` card frame (MemoryCard pattern). Data can be inlined or read from a trimmed `harness.ts` (D-18).

Card frame to adapt:
```tsx
// MemoryTab.tsx:127-139
<article className="border border-hairline rounded-md p-6 bg-background">
  <h3 className="font-sans text-lg font-semibold text-foreground">{name}</h3>
  <p className="font-mono text-xs text-muted-foreground mt-1">{tagline}</p>
</article>
```
Stagger grid to adapt:
```tsx
// contact.tsx:66-72
<motion.div variants={staggerContainer} initial="initial" whileInView="animate"
  viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
```

---

### `src/components/sections/hero.tsx` (section) - MODIFY

**Analog:** self (`src/components/sections/hero.tsx:1-252`).

Replace `TAGLINE`/`META` constants (lines 10-11) with the approved copy (D-08). Full-bleed the grid: the grid is currently inside `max-w-[1200px] mx-auto` (lines 64, 150-161) which clips it; wrap it in the viewport-width breakout (RESEARCH Pattern 6: `absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen`). Keep the compile sequence (lines 75-251) and `bootReady` gate (lines 27-38). The hero CTA currently links to `/projects` (line 240) - change to `#projects` anchor / `lenis.scrollTo`. Em-dash in current TAGLINE (line 10) must go (S-7).

Constants to replace:
```tsx
// hero.tsx:10-11 (current)
const TAGLINE = 'From ISO audits to AI agents — I build the systems in between.'; // -> D-08 verbatim
const META = "SYRACUSE IMT '27 / ISO 9001 AUDITOR / AI-ENGINEERING";              // -> D-08 verbatim
```

---

### `src/components/sections/about.tsx` (section) - MODIFY (light)

**Analog:** self (`src/components/sections/about.tsx:1-106`).

Component already consumes `landingAbout.paragraphs` + `landingAbout.pullQuote` and renders a 2-paragraph + pull-quote + 1-paragraph layout (lines 16-50). The approved copy is FIVE paragraphs (REDESIGN-SPEC §4.2), so adjust the `.slice(0,2)` / `[2]` indexing (lines 27, 46) to render all paragraphs. Keep the `SlideBlock` scroll-linked motion (lines 62-106), which already has the reduced-motion gate (S-3). Only data + paragraph-count wiring changes.

---

### `src/components/sections/resume.tsx` + `resume-content.tsx` (section) - MODIFY

**Analog:** self (`resume.tsx:1-68`, `resume-content.tsx:1-164`).

Already inline-capable with a PDF download (`resume.tsx:48-60`) and a `ResumeContent` that maps `resumeData` (`resume-content.tsx:41-51` projects loop). Rebuild the projects subsection data in `data/resume.ts` to the featured set with softened framing (D-19). Keep employer names generic on the page (D-20); the PDF asset (`/resume.pdf`) carries the specifics. No structural component change; the `ResumeSectionClient` wrapper already accepts `onResumeDownload` for analytics (S-5).

---

### `src/components/sections/contact.tsx` (section) - MODIFY (likely unchanged)

**Analog:** self (`contact.tsx:1-126`).

Already renders Email/LinkedIn/GitHub with no phone (D-21 compliant) and `rel="noopener noreferrer"` (S-6). It is `<Section id="contact">` so the anchor already exists. Ensure it is composed as the final scroll target in `page.tsx` above the footer. Optionally wire `onContactClick` to analytics (S-5).

---

### `src/data/projects.ts` (model) - REWRITE

**Analog:** self (`src/data/projects.ts:1-64`) - current export shape and array literal style.

Replace the `Project` interface (current: id/title/subtitle/description/detailedDescription/technologies/status/githubUrl/imageLabel) with the extended model (REDESIGN-SPEC §4.3): add `DemoSection` interface + `slug`, `hook`, `overview`, `tech`, `links`, `heroImage`, `demos[]`; `status: 'shipped' | 'in-progress'`. Replace the featured array (GTO/Algo/bulkDocReformat/SchoolworkTrack) with Quant Edge Tracker, AI News Agent, EV Trainer (D-14). Soften gambling framing (D-17). No em dashes (S-7).

Current vs target interface:
```ts
// CURRENT (projects.ts:1-11)
export interface Project { id; title; subtitle; description; detailedDescription;
  technologies: string[]; status: 'completed' | 'in-progress'; githubUrl?; imageLabel; }
// TARGET (REDESIGN-SPEC §4.3)
export interface DemoSection { type: 'video'|'image'; src: string; poster?: string; caption: string; body: string; }
export interface Project { id; slug; title; hook; overview; tech: string[];
  status: 'shipped'|'in-progress'; links: { repo?; live? }; heroImage; demos: DemoSection[]; }
```

---

### `src/data/about.ts` (model) - REWRITE

**Analog:** self (`src/data/about.ts:1-18`).

Replace both `aboutParagraphs` (lines 1-6) and `landingAbout` (lines 10-18) with the APPROVED §4.2 narrative VERBATIM (D-09) and the new pull quote "The question is never whether I can build it. It is what to build next." (D-10). `landingAbout.paragraphs` becomes 5 entries. Keep `skillCategories` shape (lines 25-42) but update ISO-heavy items toward AI-building framing if surfaced. No em dashes (S-7).

---

### `src/data/resume.ts` (model) - MODIFY

**Analog:** self (`src/data/resume.ts:1-161`).

Update current role to Data Science Intern (D-19), rebuild the `projects[]` subsection (lines 76-102) to the featured set with softened framing. Keep employer names in this file ONLY as the source for the PDF understanding; the on-page render keeps them generic (D-20). Keep the `ResumeData` interface (lines 26-34). No em dashes - current `dateRange` strings use en-dash "–" (lines 48,57,68); the sweep covers both U+2013 and U+2014 (Pitfall 6).

---

### `src/data/harness.ts` (model) - TRIM or DELETE

**Analog:** self (`src/data/harness.ts:1-40+`).

The current file is a large multi-export data dump (`layers`, `inventory`, `hookEvents`, `stats`, etc.) feeding the tab UI. Trim drastically to a six-pillar array (or delete and inline the pillars in `harness.tsx`) per D-18. Any deletion must be paired with removing/replacing the tab tests (see Tests).

---

### `src/lib/analytics/types.ts` (schema) - MODIFY

**Analog:** self (`src/lib/analytics/types.ts:1-19`).

Add `'section_view'` to the `eventTypes` tuple (line 3-8). One-line, backward-compatible change; `event_target` carries the section id. The Zod `analyticsEventSchema` (lines 10-17) and `route.ts` insert path need no other change. (RESEARCH A1: verify the Supabase `page_events.event_type` column is not a constrained enum before relying on this; use Supabase MCP `list_tables`.)
```ts
// types.ts:3-8 - extend the tuple
export const eventTypes = ['page_view','project_click','resume_download','contact_click','section_view'] as const;
```

---

### `src/hooks/use-analytics.ts` (hook) - MODIFY

**Analog:** self (`use-analytics.ts:1-72`).

Add a `trackSectionView(sectionId)` callback mirroring the existing `trackProjectClick` (lines 49-54): `sendEvent('section_view', sectionId)`. Export it alongside the others (lines 67-71). Keep the fire-once page_view ref guard (lines 13-21).

---

### `src/app/api/analytics/route.ts` (API route) - MODIFY (likely none)

**Analog:** self (`route.ts:1-63`).

The route already passes `event_type`/`event_target` through to the `page_events` insert (lines 40-47); since validation is centralized in the Zod enum (extended above), no route change is required unless the DB column constrains the enum (then a Supabase migration is its own task - RESEARCH Open Q1).

---

### `src/lib/animation.ts` (tokens) - MODIFY (optional)

**Analog:** self (`src/lib/animation.ts:1-45`).

Add GSAP ease/duration tokens alongside the existing Motion `TIMING`/`EASE` exports so GSAP code (panels, demos) reads from one place. Keep the existing exports intact (they are imported widely).

---

## Test Patterns

### T-1. jsdom stub extension - `src/__tests__/setup.ts` (MODIFY)
**Analog:** self (`setup.ts:1-16`, the `matchMedia` mock). Add `IntersectionObserver` and optionally `HTMLMediaElement.prototype.play/pause` stubs (jsdom lacks both) using the same `Object.defineProperty(window, ...)` idiom.

### T-2. Data/schema assertion - `analytics.test.ts:1-71` is the template
**Create:** `redirects.test.ts` (import `nextConfig.redirects()`, assert six entries + status/destination), `projects.test.ts` (every project has required fields + ordered demos with valid `type`), `em-dash.test.ts` (no U+2014 or U+2013 across `src/data/*.ts` exports). Pattern: `import` the module, `expect` over its values - no rendering.
```ts
// analytics.test.ts:46-55 - "iterate the enum" assertion idiom to mirror
const types = ['page_view','project_click','resume_download','contact_click','section_view'];
for (const type of types) expect(analyticsEventSchema.safeParse({ event_type: type, session_id: 'x' }).success).toBe(true);
```

### T-3. RTL + matchMedia mock - `ArchitectureTab.test.tsx:6-20` is the template
**Reuse the `mockMatchMedia(reducedMotion)` helper verbatim** for the new tests:
- `reduced-motion.test.tsx` (R-30): assert animated components render final state with no inline `transition:` style under reduce (mirror `ArchitectureTab.test.tsx:124-138`).
- `project-popout.test.tsx` (R-27): dialog opens on trigger, ESC closes, `onOpenChange` fires (mirror the click/`fireEvent.keyDown(..., {key:'Escape'})` + `waitFor(aria-expanded)` flow at lines 78-86).
- `use-scrollspy.test.ts` (R-14): mock IntersectionObserver, drive entries, assert active id.
- `harness.test.tsx` (R-28): render the new section, assert six pillars present.
```tsx
// ArchitectureTab.test.tsx:6-20 - copy this helper into each new RTL test
function mockMatchMedia(reducedMotion: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: reducedMotion && query === '(prefers-reduced-motion: reduce)',
    media: query, onchange: null, addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
  }) as MediaQueryList);
}
```

### Tests that WILL break (must delete)
- `src/__tests__/components/HarnessTabs.test.tsx` - imports deleted `@/app/harness/_components/HarnessTabs`. **DELETE.**
- `src/__tests__/components/ArchitectureTab.test.tsx` - imports deleted `ArchitectureTab` + `@/data/harness` `layers`. **DELETE** (its `matchMedia` mock is the template for T-3, copy before deleting).

---

## No Analog Found

Files with no close in-repo match. Planner should lean on RESEARCH.md patterns (cited) plus the external library docs.

| File | Role | Data Flow | Reason / Source to use |
|------|------|-----------|------------------------|
| `src/components/projects/project-popout.tsx` | modal | event-driven | No accessible modal exists. `mobile-menu.tsx` has scroll-lock but no focus trap. Build on Base UI `Dialog` - RESEARCH Pattern 3. |
| `src/components/projects/demo-section.tsx` (video autoplay) | component | streaming | No `<video>` or scroll-into-view media anywhere in the repo. `placeholder-image.tsx` only covers the still-image frame. RESEARCH Pattern 5. |
| GSAP ScrollTrigger usage (in `project-panel.tsx`, `lenis-provider.tsx`) | animation | event-driven | GSAP is installed but NO GSAP code exists in the repo (greenfield). RESEARCH Patterns 1 & 2 + `/greensock/gsap-skills`. |
| `use-in-view-video.ts` | hook | event-driven (media) | No media-playback hook exists; only the IO cleanup shape is analogous. RESEARCH Pattern 5. |
| `?s=` query scroll effect (in `page.tsx`) | client effect | event-driven | No `useSearchParams`-driven scroll exists. RESEARCH Code Examples ("Client scroll-to-section"). Requires a `<Suspense>` boundary. |

---

## Metadata

**Analog search scope:** `src/app/`, `src/components/`, `src/hooks/`, `src/data/`, `src/lib/`, `src/__tests__/`, `next.config.ts`, `vitest.config.ts`, `components.json`.
**Files scanned (read):** 35 source files + 3 planning docs.
**Verified paths:** RESEARCH.md notes confirmed - grid at `src/components/ui/interactive-thermodynamic-grid.tsx`, providers at `src/app/providers/`, analytics types at `src/lib/analytics/types.ts`. Note RESEARCH also flags an UNUSED duplicate `src/components/fx/hero-grid.tsx` (the hero renders the `ui/` canvas version; idle-clear work goes in the canvas file, not `fx/`).
**Pattern extraction date:** 2026-05-24
