# Portfolio Editorial Redesign — Roadmap

**Owner:** Evan Stachowiak
**Spec source:** `C:\Users\estac\Downloads\portfolio-redesign-spec.md`
**Started:** 2026-04-14
**Current status:** Session 1 complete — Phase 1 ✅ + Phase 2 ✅ + motion preview work shipped
**Working branch:** `feat/editorial-redesign` (pushed to origin)
**Key commits:**
- `188a08e` — Phase 1 tokens
- `49e0bc9` — Phase 2 routing
- `f2d448c` — loadup sequence, parallax hero, cursor spotlight, /stack → /toolkit rename, whitespace tightening, link-underline utility
- `2edad6d` — nav hover/click micro-interactions + blinking ES_ underscore, cursor-spotlight opacity dialled back

**Next session starts at:** Phase 3 (true compile sequence per spec §4 + hero copy/layout rewrite) OR Phase 4 (projects MDX + card redesign). Pick based on priority.

---

## Goal

Shift portfolio from dark-mode + terminal-green aesthetic to a warm paper + crimson editorial aesthetic. Soften (don't abandon) the CLI motif. Split the single-page scroll into a multi-page site. Add a `/toolkit` page (renamed from `/stack` — "stack" is a personal nickname) that makes the AI-engineering identity undeniable.

**Positioning to reinforce:** IMT student with process/QA background using AI-engineering + vibe-coding to build real systems. Not CS. Not finance. Intersection builder.

---

## Stack Constraints (IMPORTANT — verify every phase)

| Tool | Version | Constraint |
|---|---|---|
| Next.js | 16.2.2 (App Router) | **Breaking changes from training data.** Must consult `node_modules/next/dist/docs/` before routing/MDX code. |
| Tailwind | v4 | Uses `@theme inline` in `globals.css`, **no `tailwind.config.ts`**. Verify syntax via Context7. |
| Motion | 12.38.0 | New unified Motion library, **not** `framer-motion`. Verify API via Context7. |
| shadcn/ui | base-nova style | Configured via `components.json` |
| Supabase | `@supabase/ssr` 0.10 | Analytics only. Route: `/src/app/api/analytics/route.ts`. **Do not break.** |
| Vercel | production + preview URLs per branch | Env vars in dashboard. `vercel.json` has security headers. |
| Vitest | 4.1 | 3 existing tests in `/src/__tests__/` |

---

## Decisions Locked

| Decision | Choice | Reasoning |
|---|---|---|
| Case study content model | **MDX** (hybrid: metadata in TS, body in MDX) | Recruiter optics for Next.js 16. Prose reads better. Keep `src/data/projects.ts` for structured metadata, add `content/projects/[slug].mdx` for body. |
| PDF generation | **`@react-pdf/renderer`** | Single source of truth, auto-regenerates from resume data, no drift. |
| Screenshots | **Placeholders for V1** | User will decide demo material + project selection later. `PlaceholderImage` component already exists. |
| Git strategy | **Branch `feat/editorial-redesign`** | Vercel preview URLs per commit, env vars inherited, single merge PR to main. |
| Font loading | **Self-host General Sans woff2** in `public/fonts/` | Fontshare not on Google Fonts. Updates `src/lib/fonts.ts`. |
| Token naming | **Semantic** (`--accent`, `--bg-base`) not literal (`--crimson`, `--paper`) | Allows future palette swaps without touching components. Fixes naming debt from `--terminal-green`. |

---

## Phases

### ✅ Phase 0 — Research & Planning
- [x] Read spec
- [x] Survey codebase (stack, routing, tokens, components, animations, data model, tooling, risks)
- [x] Lock decisions
- [x] Save roadmap

### ✅ Phase 1 — Design Foundation (complete, commit `188a08e`)
**Scope:** tokens, fonts, semantic naming, typography base. Nothing layout-wise — just color/type system.

- [x] Replace terminal-* tokens in `src/app/globals.css` with warm paper + crimson hex palette
- [x] Remove `terminal-green`, `terminal-cyan`, `terminal-amber`, `terminal-glow` tokens
- [x] Update `@theme inline` mappings to semantic names (`--color-crimson`, `--color-hairline`, `--color-tertiary`)
- [x] Load General Sans via Fontshare CDN `@import` (self-host deferred to Phase 7 for Lighthouse)
- [x] Update `src/lib/fonts.ts`: remove Outfit, keep JetBrains Mono
- [x] Set body line-height 1.65, `.prose-body` utility max-width 68ch
- [x] h1 letter-spacing `-0.02em`, h2 `-0.01em`, type scale per spec §2
- [x] Migrate 13 components from `text-terminal-*` etc. to `text-crimson` / semantic tokens
- [x] Remove `.grid-pattern`, `.noise-overlay`, `.terminal-glow`, `.text-glow`, glitch-flicker keyframe
- [x] Focus ring per spec §12: 2px crimson outline, 2px offset
- [x] `color-scheme: light`, dropped `@custom-variant dark`
- [x] Tests passing (14/14 vitest), tsc clean, no new lint errors

### ✅ Phase 2 — Routing Restructure (complete, commit `49e0bc9`)
**Scope:** multi-page routing, nav refactor, persistent footer.

- [x] Created `src/app/projects/page.tsx` (client wrapper, tracks `project_click`)
- [x] Created `src/app/projects/[slug]/page.tsx` with async Next 16 params + `generateStaticParams` + `generateMetadata` — placeholder content, Phase 4 adds MDX
- [x] Created `src/app/resume/page.tsx` (client wrapper, tracks `resume_download`)
- [x] Created `src/app/stack/page.tsx` (placeholder, Phase 5 wires content)
- [x] Rewrote `src/app/page.tsx` as landing-only (Hero + About)
- [x] Refactored navbar: `next/link` + `usePathname`, Motion `layoutId` underline slides between pages; order About/Projects/Stack/Resume
- [x] Refactored mobile-menu: slides in from right per spec §10
- [x] Built persistent 3-column footer (Contact / Currently / Colophon) with crimson "Built with Claude Code" link
- [x] Mounted Navbar + Footer in `src/app/layout.tsx` — persistent on every route
- [x] Deleted `analytics-wrapper.tsx`, replaced with per-page client wrappers using `useAnalytics`
- [x] Supabase `/api/analytics` route untouched — `page_view` auto-fires per route via hook remount
- [x] `next build` passes: 5 static routes, 4 SSG project slugs, dynamic `/api/analytics`
- [x] Pushed to `origin/feat/editorial-redesign` → Vercel preview URL auto-generated

**Known non-blockers carried forward:**
- lucide-react v1.7.0 dropped brand icons; footer uses `Mail`/`Link`/`Code` generic icons (matches existing contact.tsx). Swap to inline SVG logos in Phase 7 if desired.
- ES_ logo blink animation — done in `2edad6d`.
- Pre-existing lint error in `use-analytics.ts` (sendEvent access-before-declaration) not introduced by this session; cleanup candidate for Phase 7.

### 🟡 Phase 3 — Landing Page + Compile Sequence (partial)

**Shipped as preview in Session 1 (`f2d448c`, `2edad6d`):**
- [x] Hero shrunk to `min-h-[78vh]` + subtle parallax on scroll (0.3x) + scroll chevron removed
- [x] CTA "View My Work" navigates to `/projects`
- [x] **LoadupSequence** overlay: paper-on-paper terminal boot with 6 staggered lines + blinking crimson cursor, plays once per session (sessionStorage gate), skippable on any input, respects `prefers-reduced-motion`. NOT yet the full spec §4 compile sequence — that uses a mono→sans crossfade on the name itself.
- [x] **CursorSpotlight** on landing — subtle 2.8% crimson radial glow tracks pointer (disabled on touch + reduced-motion)
- [x] ES_ logo: blinking crimson underscore + hover lift + click press-down
- [x] Nav links: hover lifts + crimson underline draws L→R, click press-down + scale 97%

**Still to do for full Phase 3:**
- [ ] Remove grid background, add single hairline rule 1/3 down
- [ ] Hero: left-aligned, EVAN / STACHOWIAK stacked, ~5.5rem desktop
- [ ] New tagline (pick from spec §6.4)
- [ ] New meta line: `SYRACUSE IMT '27 / ISO 9001 AUDITOR / AI-ENGINEERING`
- [ ] CTA: "Projects →"
- [ ] **Compile-sequence animation** (spec §4):
  - 0.0–0.4s: paper fade in
  - 0.4–0.8s: hairline grid fade in at 6% from top-left
  - 0.8–1.2s: crimson underline draws horizontally
  - 1.2–1.8s: name types in JetBrains Mono → crossfades to General Sans
  - 1.8–2.2s: tagline fade up 8px
  - 2.2–2.6s: meta + CTA fade in
  - 2.6s: blinking crimson cursor at tagline end
  - `sessionStorage` gate (first visit per session only)
  - Keypress/click skips to final state
  - `prefers-reduced-motion` → skip entirely, render final state
- [ ] Condense About to 3 paragraphs
- [ ] Pull "identify an inefficiency, model the problem quantitatively…" as blockquote
- [ ] Remove skills sidebar from landing
- [ ] Remove scroll-down chevron

### ⏳ Phase 4 — Projects System
- [ ] Add `@next/mdx` + content loader (verify Next.js 16 MDX docs first)
- [ ] Extend `Project` type: `slug`, `order`, `heroImage`, `detailImages[]`
- [ ] Create `content/projects/[slug].mdx` files with: Problem / Approach / Key Decisions / Outcome / What I'd Do Differently
- [ ] Reorder: Algo Trading → GTO Poker → bulkDocReformat → SchoolworkTrack
- [ ] Add 5th project: the portfolio site itself
- [ ] Redesign `project-card.tsx`: hairline border, hover = crimson border + 2px y-translate, remove 3D tilt
- [ ] Status pills: muted-crimson `In Progress` / tertiary-text `✓ Shipped`
- [ ] Tech tags: hairline-bordered chips (mono)
- [ ] Build case-study page template in `src/app/projects/[slug]/page.tsx`
- [ ] Design custom MDX components (pull quote, decision callout, comparison table)

### ⏳ Phase 5 — `/toolkit` Page (SIGNATURE)
_(Route renamed from `/stack` in commit `f2d448c`. "The Toolkit" is the page heading.)_
- [ ] Create `src/data/toolkit.ts` (hardware, daily drivers, Claude stack, workflow)
- [ ] Sections: Hardware / Daily Drivers / The Claude Stack / Workflow / Writing
- [ ] Terminal-style code blocks (mono, `--bg-surface`, crimson syntax accents)
- [ ] 2-3 short writing pieces (**OPEN: user needs to provide content**)
- [ ] Sticky TOC or long-scroll layout

### ⏳ Phase 6 — Resume Page + PDF
- [ ] Two-column layout (main + sidebar)
- [ ] Mono+crimson date ranges, General Sans 600 company names, body bullets
- [ ] Drop `>_` prefixes (keep only on page title)
- [ ] Replace `▸` bullets with crimson `•`
- [ ] Consolidate skills to 4 subsections (Languages / Tools / Data & Analytics / Process & Compliance)
- [ ] Remove Teaching Assistant entry
- [ ] Crimson certification checkmarks
- [ ] Install `@react-pdf/renderer`, build resume → PDF generator from shared data
- [ ] Replace `public/resume.pdf` (drop the Word-formatted one)
- [ ] **Rebuild resume projects section** (user noted this needs attention)

### 🟡 Phase 7 — Motion + Accessibility (partial)

**Shipped as preview in Session 1:**
- [x] `.link-underline` utility class (L→R hover draw) available in globals.css — apply site-wide in polish pass
- [x] Global `prefers-reduced-motion` shim — forces all animations/transitions to 0.01ms
- [x] Hero parallax (useScroll + useTransform, 0.3x rate)

**Still to do:**
- [ ] Page transitions: `AnimatePresence` fade + 12px y 300ms
- [ ] Scroll reveals: `whileInView once:true`, 16px translate, 80ms stagger
- [ ] Parallax: hero 0.3x, project images 0.1x
- [ ] Hover: cards +2px translate, crimson-40% border; link underline draw L→R 200ms
- [ ] Focus: 2px crimson outline, 2px offset on all interactive
- [ ] Alt text audit
- [ ] Semantic HTML pass: `<main>`, `<nav>`, `<article>`, one h1 per page
- [ ] Contrast verify every crimson combo
- [ ] Lighthouse 95+ on Performance / Accessibility / Best Practices / SEO

---

## Open Items (user-owned)

- [ ] **Screenshots:** which projects get featured; what demo material to capture
- [ ] **`/toolkit` writing:** 2-3 short notes on AI-engineering topics (titles suggested in spec §9.5)
- [ ] **Resume projects section:** user flagged this needs rebuild (Phase 6)
- [ ] **Hardware specs** for /toolkit page
- [ ] **Workflow copy** for /toolkit page
- [ ] **"Currently" line** for persistent footer

---

## Estimated Effort

| Phase | Effort | Classification |
|---|---|---|
| 1 — Foundation | 2h | AUTOMATE |
| 2 — Routing | 3h | ASSIST |
| 3 — Landing + Animation | 3h | COLLABORATE |
| 4 — Projects + MDX | 4h | ASSIST |
| 5 — /toolkit | 3h | ASSIST + user content |
| 6 — Resume + PDF | 3h | ASSIST |
| 7 — Motion + A11y | 2h | AUTOMATE |
| **Total** | **~20h** | 3-4 sessions |

---

## How to Resume (for future Claude sessions)

```bash
cd "C:/Users/estac/OneDrive - Syracuse University/uni/2026/spring2026/projects/portfolio website/portfolio"
git checkout feat/editorial-redesign
git pull
# Read this file
# Read portfolio-redesign-spec.md in C:\Users\estac\Downloads\
# Continue at the first unchecked box
```

Key files to re-read at session start:
- This file (`REDESIGN_ROADMAP.md`)
- Original spec: `C:\Users\estac\Downloads\portfolio-redesign-spec.md`
- `src/app/globals.css` (current token state)
- `src/lib/fonts.ts` (current font state)
- `src/app/layout.tsx` (footer mount + font wiring)

---

## Changelog

- **2026-04-14 AM** — Session 1 start. Phase 0 complete. Phase 1 tokens + Phase 2 routing shipped (`188a08e`, `49e0bc9`).
- **2026-04-14 PM** — Extended Session 1 with motion preview work (`f2d448c`, `2edad6d`):
  - CTA fix, hero parallax + shrunk height + chevron removal, page whitespace tightening
  - LoadupSequence (terminal-boot overlay, once per session)
  - CursorSpotlight on landing (barely-there crimson glow)
  - Nav micro-interactions (hover lift, click press, blinking ES_ underscore, group-hover underline draw)
  - `/stack` → `/toolkit` rename (tab label + route + metadata + copy)
  - `.link-underline` utility + global prefers-reduced-motion shim
  - Decision: loadup sequence is a DIFFERENT animation from spec §4 compile sequence. Both can coexist — loadup is an overlay that plays once per session before any page; compile sequence (deferred to Phase 3) is the mono→sans name crossfade on landing hero itself.
