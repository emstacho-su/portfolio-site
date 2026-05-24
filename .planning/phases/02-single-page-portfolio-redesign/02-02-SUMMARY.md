---
phase: 02-single-page-portfolio-redesign
plan: 02
subsystem: architecture-and-routing
tags: [single-page, routing, redirects, lenis, gsap, scrollspy, navigation]
requires:
  - "02-01: node_modules installed; Wave 0 jsdom stubs (IntersectionObserver, media play/pause) and the redirects.test.ts / use-scrollspy.test.ts scaffolds"
provides:
  - "Single scrollable page at / composing hero, about, projects, harness, resume, contact in scroll order (contact last, D-21)"
  - "Six legacy-route permanent redirects (308) to /?s=<section> plus a Suspense-wrapped ?s= client scroll effect"
  - "useScrollspy IntersectionObserver hook driving the nav active state"
  - "Hash-anchor navbar + mobile menu with Lenis smooth-scroll (offset -64)"
  - "Lenis on autoRaf:false sharing one rAF clock with gsap.ticker (ScrollTrigger backbone for Wave 3)"
affects:
  - "02-03 (hero/about copy): hero.tsx em-dash TAGLINE still intended-red"
  - "02-04 (harness rewrite): replaces the placeholder HarnessSection with six pillars; will unskip harness.test.ts"
  - "Wave 3 (projects system): ScrollTrigger now shares the Lenis ticker"
tech-stack:
  added:
    - "gsap + gsap/ScrollTrigger registered at module scope in lenis-provider.tsx (greenfield GSAP usage)"
    - "lenis/react useLenis() consumed in page.tsx, navbar.tsx, mobile-menu.tsx"
  patterns:
    - "next.config.ts redirects() to /?s= (query, never #fragment) for server-safe section redirects"
    - "Suspense-wrapped useSearchParams ?s= client scroll effect"
    - "IntersectionObserver scrollspy (create-observe-disconnect cleanup, S-4)"
    - "Lenis + gsap.ticker single shared rAF loop (RESEARCH Pattern 1)"
key-files:
  created:
    - "src/hooks/use-scrollspy.ts"
    - "src/components/sections/harness.tsx (placeholder, Wave 2 fills the body)"
  modified:
    - "next.config.ts"
    - "src/app/page.tsx"
    - "src/app/layout.tsx"
    - "src/app/providers/lenis-provider.tsx"
    - "src/components/navigation/navbar.tsx"
    - "src/components/navigation/mobile-menu.tsx"
    - "src/__tests__/hooks/use-scrollspy.test.ts"
  deleted:
    - "src/app/interested/, src/app/projects/ (+[slug]), src/app/resume/, src/app/harness/ (+_components, opengraph-image)"
    - "src/components/sections/interested-cta.tsx"
    - "src/__tests__/components/HarnessTabs.test.tsx, src/__tests__/components/ArchitectureTab.test.tsx"
decisions:
  - "Redirect status: permanent:true (HTTP 308) per RESEARCH Open Q2; no stakeholder mandated a literal 301, so statusCode:301 was NOT used"
  - "Mounted the real ProjectsSection (already implemented) rather than a bare stub; only the Harness section is a placeholder"
  - "Deleted the two harness-tab tests (Rule 3) because they import the deleted _components and would crash test collection"
metrics:
  duration: 8min
  completed: 2026-05-24
  tasks: 3
  commits: 3
---

# Phase 2 Plan 02: Architecture and Routing Summary

Converted the multi-page site into a single anchor-navigated page at `/`: all six sections compose in scroll order with contact as the final scroll target, the six legacy routes issue permanent (308) redirects to `/?s=<section>` with a Suspense-wrapped client scroll, the navbar and mobile menu are hash anchors driven by a new IntersectionObserver scrollspy hook with Lenis smooth-scroll, and Lenis now runs `autoRaf:false` on a single rAF clock shared with `gsap.ticker` (the ScrollTrigger backbone Wave 3 builds on).

## What Was Built

**Task 1 (`a535773`) - Redirects, ?s= scroll, deletions**
- `next.config.ts`: six-entry `redirects()` table to `/?s=projects|resume|harness|contact`, `permanent: true` (308). Retargeted the old `/toolkit -> /harness` entry to `/?s=harness` since `/harness` is deleted. All destinations are static internal `/?s=` literals (no `#` fragment, no user input).
- `page.tsx`: removed `InterestedCTA`; added a `'use client'` `ScrollFromQuery` child that reads `useSearchParams().get('s')`, calls `lenis.scrollTo('#'+s, { offset: -64 })`, then `router.replace('/', { scroll: false })` to clean the URL, rendered inside `<Suspense>`.
- Deleted `/interested`, `/projects` (+`[slug]`), `/resume`, `/harness` (+`_components`, `opengraph-image`) route trees and `interested-cta.tsx`.

**Task 2 (`243630c`) - Composition + shared ticker**
- `page.tsx`: mounts Hero, About, Projects, Harness, Resume, Contact in scroll order with `<ContactSection/>` last above the layout footer (D-21).
- `harness.tsx`: new placeholder section carrying `id="harness"` so the anchor/scrollspy target exists now (Wave 2 fills the six pillars).
- `lenis-provider.tsx`: `autoRaf: false`; effect registers ScrollTrigger, `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`, with cleanup; the ticker update guards against a null Lenis (reduced motion destroys it). Boot-gate and reduced-motion destroy branch left unchanged.
- `layout.tsx`: metadata title/description retargeted to the AI-building tone (D-08); provider nesting unchanged.

**Task 3 (`33c3f88`) - Scrollspy + nav**
- `use-scrollspy.ts`: IntersectionObserver hook returning the highest-ratio intersecting section id (`rootMargin -45% 0px -45% 0px`, thresholds `[0,0.25,0.5,1]`), layout-driven (no reduced-motion gate), disconnect on cleanup.
- `navbar.tsx`: NAV_LINKS now `#about/#projects/#harness/#resume/#contact`; `usePathname` isActive replaced with `useScrollspy(['hero','about','projects','harness','resume','contact'])` bound to the `layoutId="nav-underline"` marker; link click `preventDefault` + `lenis.scrollTo(href, { offset: -64 })`; ES_ logo and scroll-bg kept.
- `mobile-menu.tsx`: same hash retarget; each link closes the menu then `lenis.scrollTo` (offset -64); scroll-lock, slide-in, stagger kept.
- `use-scrollspy.test.ts`: unskipped the Wave 1 block, captured the stubbed IntersectionObserver instance, drove synthetic entries, asserted the active id tracks the highest ratio.

## Chosen Permanent Status (per output spec)

`permanent: true`, which emits **HTTP 308** in Next.js 16.2.2 (the modern, method-preserving, SEO-equivalent permanent redirect). Per RESEARCH Open Q2 the recommendation is 308 unless a literal 301 is mandated; no stakeholder mandated 301, so `statusCode: 301` was deliberately not used. The redirects test accepts either a boolean `permanent` flag or a numeric `statusCode`, so it stays green with the 308 choice.

## Contact Section (D-21 / R-21b) Confirmation

`<ContactSection/>` is mounted as the LAST section in `page.tsx`, above the layout footer (final scroll target). It renders the three public channels only: email `emstacho@syr.edu` (mailto:), LinkedIn (evan-stachowiak), GitHub (emstacho-su). No phone number appears anywhere in `page.tsx` or any section it mounts. The public-channel invariant is preserved at the composition level.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Deleted two harness-tab tests that import deleted modules**
- **Found during:** Task 1 (deleting `src/app/harness/_components/`)
- **Issue:** `src/__tests__/components/HarnessTabs.test.tsx` and `src/__tests__/components/ArchitectureTab.test.tsx` statically import `@/app/harness/_components/HarnessTabs` and `@/app/harness/_components/ArchitectureTab`. Once those components are deleted (this plan's explicit task), the tests crash at Vitest COLLECTION (import-resolution error), which would regress the baseline beyond the documented intended-reds.
- **Fix:** Deleted both test files. RESEARCH.md and PATTERNS.md both explicitly mandate deleting them as a direct consequence of the harness route removal ("Tests that WILL break (must delete)"). Their `matchMedia` mock pattern was already copied into the Wave 0 scaffolds (`harness.test.tsx`, `reduced-motion.test.tsx`, `project-popout.test.tsx`, `use-scrollspy.test.ts`) per the Wave 0 contract.
- **Files modified:** deleted `src/__tests__/components/HarnessTabs.test.tsx`, `src/__tests__/components/ArchitectureTab.test.tsx`
- **Commit:** a535773

### Plan Interpretation Note (not a deviation)

The plan allows placeholder stubs for projects/harness. The real `ProjectsSection` was already fully implemented (and builds clean against the existing `ProjectCard`), so it was mounted as-is rather than re-stubbed; only the Harness section is a genuine placeholder (no `harness.tsx` section component existed). This satisfies "every anchor id exists now" without throwing away working code; Wave 3 still rewrites the projects panels and Wave 2 still fills the harness body.

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Placeholder Harness section (heading + one-line note, no six pillars) | `src/components/sections/harness.tsx` | Intentional, per D-01: the `#harness` anchor and scrollspy target must exist now; the six capability pillars (R-28 / D-18) land in Wave 2 (plan 02-04), which will replace the body and unskip `harness.test.tsx`. Does not block the plan's single-page-architecture goal. |

## Verification

- `npm run build`: exits 0; route list shows only `/`, `/api/analytics`, and metadata routes (all legacy routes gone).
- `src/__tests__/lib/redirects.test.ts`: GREEN (6 entries, `/?s=` destinations, permanent flag).
- `src/__tests__/hooks/use-scrollspy.test.ts`: GREEN (active id tracks highest-ratio entry).
- `npm run lint`: 5 errors + 3 warnings, ALL in the documented pre-existing baseline files (cursor-spotlight, hero-loader, loadup-sequence, hero.tsx, use-analytics, session.test.ts, use-typing-animation.ts). No NEW lint errors in any file this plan edited.
- Full `npx vitest run`: 8 failures remain, ALL intended-reds owned by later waves: projects.test.ts (5, projects.ts data rewrite, Wave 2 / 02-04), em-dash data sweep for harness.ts + resume.ts (Wave 2), em-dash hero.tsx source (02-03). Baseline went from 11 failures to 8 (resolved the 2 redirects fails and the interested-cta em-dash fail by deletion); no regressions.

## TDD Gate Compliance

This is a `type: execute` plan (not `type: tdd`). Two Wave 0 scaffold tests were the acceptance contract (RED -> GREEN): `redirects.test.ts` and `use-scrollspy.test.ts`, both turned green by implementing to satisfy them (no test was weakened to pass).

## Self-Check: PASSED

- Created files exist: `src/hooks/use-scrollspy.ts`, `src/components/sections/harness.tsx`, `02-02-SUMMARY.md` (and `next.config.ts` modified).
- Commits exist: a535773, 243630c, 33c3f88.
- Deletions confirmed: `src/app/interested`, `src/app/harness`, `src/components/sections/interested-cta.tsx` gone.
