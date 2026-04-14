# Portfolio Editorial Redesign — Roadmap

**Owner:** Evan Stachowiak
**Spec source:** `C:\Users\estac\Downloads\portfolio-redesign-spec.md`
**Started:** 2026-04-14
**Current status:** Session 1 — Phase 1 + Phase 2 execution
**Working branch:** `feat/editorial-redesign`

---

## Goal

Shift portfolio from dark-mode + terminal-green aesthetic to a warm paper + crimson editorial aesthetic. Soften (don't abandon) the CLI motif. Split the single-page scroll into a multi-page site. Add a `/stack` page that makes the AI-engineering identity undeniable.

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

### 🚧 Phase 1 — Design Foundation (this session)
**Scope:** tokens, fonts, semantic naming, typography base. Nothing visual changes "layout-wise" — only the color/type system.

- [ ] Replace terminal-* tokens in `src/app/globals.css` with:
  - `--bg-base: #EFEBE3`, `--bg-surface: #E6E2D9`, `--border-hairline: #D8D3C8`
  - `--text-primary: #1A1A1A`, `--text-secondary: #5C5853`, `--text-tertiary: #8A857D`
  - `--accent: #D7263D`, `--accent-hover: #B81E33`, `--accent-muted: rgba(215,38,61,0.08)`
- [ ] Remove `terminal-green`, `terminal-cyan`, `terminal-amber`, `terminal-glow` tokens
- [ ] Update `@theme inline` mappings to semantic names
- [ ] Download General Sans woff2 (400/500/600) from Fontshare → `public/fonts/general-sans/`
- [ ] Update `src/lib/fonts.ts`: add General Sans local font, keep JetBrains Mono
- [ ] Set body line-height 1.65, max-width 68ch on paragraphs
- [ ] h1 letter-spacing `-0.02em`, h2 `-0.01em`
- [ ] Update type scale: h1 `clamp(3rem, 6vw, 5.5rem)`, h2 `2.25rem`, h3 `1.5rem`, body `1.0625rem`
- [ ] Migrate all `text-terminal-*`, `border-terminal-*`, `bg-terminal-*` class usages to semantic equivalents
- [ ] Verify no `oklch` terminal-green survives
- [ ] Update Vitest tests if they reference color tokens
- [ ] Dev run + screenshot to confirm warm paper base applies cleanly

### 🚧 Phase 2 — Routing Restructure (this session)
**Scope:** split single page into multi-page, refactor nav, add persistent footer.

- [ ] Create `src/app/projects/page.tsx` (index)
- [ ] Create `src/app/projects/[slug]/page.tsx` (case study placeholder — content wiring in Phase 4)
- [ ] Create `src/app/resume/page.tsx`
- [ ] Create `src/app/stack/page.tsx` (placeholder — content wiring in Phase 5)
- [ ] Rewrite `src/app/page.tsx` as landing-only (hero + condensed about; remove projects/resume/contact sections)
- [ ] Refactor `src/components/navigation/navbar.tsx`:
  - Hash anchors → `next/link`
  - Active state via `usePathname()` + Motion `layoutId` underline
  - Nav order: About / Projects / Stack / Resume
- [ ] Build `src/components/navigation/footer.tsx` — persistent, 3 columns:
  - Contact tiles (Email, LinkedIn, GitHub)
  - "Currently" block (one line, manually updated)
  - "Built with Claude Code" credit
- [ ] Mount footer in `src/app/layout.tsx` so it persists on every page
- [ ] Remove `ContactSectionClient` usage (footer replaces it)
- [ ] Verify all 5 routes render, nav works, no 404s
- [ ] Verify Supabase analytics still fires on nav clicks (or adjust for multi-page)
- [ ] Test on Vercel preview deploy

### ⏳ Phase 3 — Landing Page + Compile Sequence
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

### ⏳ Phase 5 — `/stack` Page (SIGNATURE)
- [ ] Create `src/data/stack.ts` (hardware, daily drivers, Claude stack, workflow)
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

### ⏳ Phase 7 — Motion + Accessibility
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
- [ ] **`/stack` writing:** 2-3 short notes on AI-engineering topics (titles suggested in spec §9.5)
- [ ] **Resume projects section:** user flagged this needs rebuild (Phase 6)
- [ ] **Hardware specs** for /stack page
- [ ] **Workflow copy** for /stack page
- [ ] **"Currently" line** for persistent footer

---

## Estimated Effort

| Phase | Effort | Classification |
|---|---|---|
| 1 — Foundation | 2h | AUTOMATE |
| 2 — Routing | 3h | ASSIST |
| 3 — Landing + Animation | 3h | COLLABORATE |
| 4 — Projects + MDX | 4h | ASSIST |
| 5 — /stack | 3h | ASSIST + user content |
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

- **2026-04-14** — Session 1 start. Phase 0 complete. Phase 1+2 in execution.
