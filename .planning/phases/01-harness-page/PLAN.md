# PLAN — Phase 1: Harness Page Build (`/harness`)

**Phase:** 1
**Status:** READY (revised after gsd-plan-checker pass — 0 blockers, 0 warnings remaining)
**Branch:** `feat/harness-page` (off `dev`, clean tree as of 2026-05-07)
**Owner / Executor:** Claude Code (gsd-executor or interactive)
**Author:** Claude Code (handwritten plan; gsd-plan-checker rev 1 → 11 issues addressed)
**Generated:** 2026-05-07

---

## Goal

Ship a production-grade `/harness` page on the portfolio that documents the 10-layer Claude Code agentic dev stack the author built, the OneDrive→AppData migration, and the chroma-orphan-reaping debugging story. Replace the placeholder `/toolkit` page. Direction: **Atlas-as-essay** (full-bleed paper-themed architecture diagram + editorial longform).

This page is a recruiter/client-facing flagship surface — production quality, not a sketch.

## Phase requirement coverage

| ID | Requirement | Covered by Task |
|----|-------------|-----------------|
| R-1 | `/harness` route exists, Server-Component | T1, T2a |
| R-2 | 10-layer documentation | T1 (data), T3 (diagram), T2a (badge rendering) |
| R-3 | Migration narrative | T2b (§3) |
| R-4 | Chroma orphan bug story | T2b (§4) |
| R-5 | Localhost inventory table | T2a (§2) |
| R-6 | Architecture diagram ported from Atlas | T3 |
| R-7 | Monochrome + crimson treatment | T3 (CSS pass) |
| R-8 | `/toolkit` deleted, navbar updated, 301 redirect | T5 |
| R-9 | Lighthouse perf ≥ 95, a11y = 100 | T8 (verification, against `next start`) |
| R-10 | Diagram keyboard nav + aria-current/aria-label | T3, T6 (tests) |
| R-11 | `prefers-reduced-motion` short-circuits animations | T3, T6 (tests) |
| R-12 | OG image at `/harness/opengraph-image` | T4 |

Every requirement has at least one task. T8 covers operational gates (lint, build, Lighthouse).

---

## Scope

### In scope
- Net-new route `src/app/harness/page.tsx` rendered SSG.
- New components under `src/app/harness/_components/`.
- Single source-of-truth data file `src/data/harness.ts` (layers, inventory, hookEvents, colophon).
- OG image generator at `src/app/harness/opengraph-image.tsx`.
- Navbar label/href change (`Toolkit → Harness`, `/toolkit → /harness`).
- 301 redirect in `next.config.ts` (Next.js emits 308 for `permanent: true` — accepted as equivalent).
- Removal of `src/app/toolkit/` directory.
- One vitest spec for the diagram component.
- Footnote update in `REDESIGN_ROADMAP.md` noting Phase 5 morphed into "Harness build, complete."

### Out of scope (explicit)
- Hardware / Daily Drivers / Writing surfaces from the original `/toolkit` plan.
- Live-data fetching from the local worker (any flavor).
- Changes to `/projects`, `/about`, `/resume`, `/interested`, or `/api/analytics`.
- Phase 4 (projects MDX) — separate effort.
- Any `/field-notes/*` series scaffold.
- Adding dependencies (uses what's already in `package.json`).

---

## File map

### Create

| Path | Purpose | Render mode |
|------|---------|-------------|
| `src/app/harness/page.tsx` | Hero + section composition. Composes a `<HarnessDiagramIsland />` for the diagram and pure server components for prose. | Server Component |
| `src/app/harness/opengraph-image.tsx` | Generated OG card (paper + crimson, eyebrow "FIELD NOTES / 2026-05-07"). Fetches General Sans woff2 at build time. | Build-time image route (`ImageResponse`) |
| `src/app/harness/_components/HarnessDiagramIsland.tsx` | Thin `'use client'` wrapper. Reads `useBootReady()` and `useReducedMotion()`, then renders `<ArchitectureDiagram />` (lazy-loaded via `next/dynamic` with `ssr: false`) once `ready === true`. Falls back to the static `<LayerCardList>` otherwise. **Reason this exists:** `next/dynamic({ ssr: false })` cannot be invoked from a Server Component in Next 16 App Router. | `'use client'` |
| `src/app/harness/_components/ArchitectureDiagram.tsx` | Ported Atlas layered stack. Hover-reveal callouts via Motion. Keyboard nav (Tab/Arrow/Home/End). | `'use client'` |
| `src/app/harness/_components/LayerCardList.tsx` | Static fallback list (used pre-hydration and under reduced-motion). Renders `<LayerCard>` rows. | Server Component |
| `src/app/harness/_components/LayerCard.tsx` | One layer row. Used by both the static list and the interactive diagram in mobile-stack mode. | Server Component |
| `src/app/harness/_components/HooksTimeline.tsx` | Horizontal hook-event timeline (PreToolUse → PostToolUse → UserPromptSubmit → SessionStart → PreCompact). Stacks vertically on `< 760px`. Pure CSS, no client JS. | Server Component |
| `src/app/harness/_components/InventoryTable.tsx` | Static localhost ports table. Pure JSX over `inventory[]`. | Server Component |
| `src/app/harness/_components/MigrationCallout.tsx` | Editorial inline callout. Used in §3 only (§4 is plain prose, no callouts). Props: `interface MigrationCalloutProps { kind: 'why' \| 'phantom' \| 'configs'; title: string; children: React.ReactNode }`. Renders a hairline-bordered `<aside>` with a mono kicker, an h4 title, and the prose body. | Server Component |
| `src/data/harness.ts` | `layers[]`, `inventory[]`, `hookEvents[]`, `colophon{}`. Pure typed module — no `any`, every exported shape declared as a named `interface`. | n/a (module) |
| `src/__tests__/components/ArchitectureDiagram.test.tsx` | Renders, asserts layer count + accessible labels + reduced-motion short-circuit. Creates the `src/__tests__/components/` directory (vitest globs already cover it via `vitest.config.ts`). | Vitest |

### Modify

| Path | Change |
|------|--------|
| `src/components/navigation/navbar.tsx` | Line 15 — replace `{ label: 'Toolkit', href: '/toolkit' }` with `{ label: 'Harness', href: '/harness' }`. |
| `next.config.ts` | Add async `redirects()` returning `[{ source: '/toolkit', destination: '/harness', permanent: true }]`. |
| `REDESIGN_ROADMAP.md` | Append a short note (≤ 2 sentences) under "Phases" that Phase 5 (`/toolkit`) was retargeted as the `/harness` build, completed in branch `feat/harness-page`. The string `/toolkit` is allowed in this file. |

### Delete

| Path | Reason |
|------|--------|
| `src/app/toolkit/page.tsx` | Placeholder. Replaced by `/harness`. |
| `src/app/toolkit/` (directory) | Empty after page deletion. |

---

## Task graph

Tasks are atomic — each maps to one commit. Dependencies are listed; tasks without deps are eligible for parallel execution by an executor agent, but the suggested order below is the most efficient sequential path.

### T1 — Scaffold route + populate data model

**Type:** scaffold
**Depends on:** —
**Action:**
1. Create `src/data/harness.ts` exporting:
   - `interface HarnessLayer { id: string; index: number; name: string; oneLiner: string; badges: string[]; subsystem: 'workflow' | 'memory' | 'context' | 'skills' | 'plugins' | 'hooks' | 'mcp' | 'storage' | 'host' }` and `layers: HarnessLayer[]` — exactly 10 entries in this order: workflow (GSD), persistent memory (claude-mem), auto-memory (curated markdown), context discipline (context-mode), skill packs (superpowers / context-mode / frontend-design), plugins (figma / supabase / vercel / playwright / hookify / commit-commands), hook pipeline (5 events × 19 scripts), MCP servers (15+, stdio), storage (SQLite + WAL + FTS5 + Chroma), CLI host (Claude Code).
   - `interface InventoryRow { port: string; service: string; owner: string; status: 'active' | 'zombie' | 'on-demand'; purpose: string }` and `inventory: InventoryRow[]` — exactly 3 rows: `{ port: '127.0.0.1:37778', service: 'claude-mem worker + memory dashboard', owner: 'bun.exe (PID 65800)', status: 'active', purpose: 'Persistent memory, observation capture, web dashboard' }`, `{ port: '127.0.0.1:37777', service: 'claude-mem (phantom reservation)', owner: 'unkillable PID 10640', status: 'zombie', purpose: 'Original port; held by orphaned WSL/Hyper-V handle. Worker rebound to 37778.' }`, `{ port: '127.0.0.1:8765', service: "Harness Atlas (this page's grandparent)", owner: 'python.exe', status: 'on-demand', purpose: 'Single-page interactive architecture diagram.' }`.
   - `interface HookEvent { name: string; owners: ('claude-mem' | 'gsd' | 'context-mode')[]; scriptCount: number; oneLiner: string }` and `hookEvents: HookEvent[]` — **exactly 5 events** sourced from `~/.claude/settings.json`'s `hooks` block: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `PreCompact`. The `scriptCount` per event must come from counting matchers' `hooks` arrays in the actual settings file (the discovery pass found 22 scripts total across 5 events as of 2026-05-07; the executor must re-count at task time and use that number, not bake the figure into the data file as a comment). The `owners` set is derived from script paths: anything under `~/.claude/plugins/claude-mem/` → `claude-mem`; under `~/.claude/hooks/gsd-*` or `~/.claude/get-shit-done/hooks/*` → `gsd`; under `~/.claude/.skill-pack-cache/mksglu__context-mode/hooks/*` or `~/.claude/hooks/context-mode-*` → `context-mode`.
   - `interface Colophon { capturedOn: string; stack: string[]; dashboardUrl: string; atlasUrl: string }` and `colophon: Colophon` with `capturedOn: '2026-05-07'`, `stack: ['Node 22', 'Bun 1.3', 'Python (Chroma)', 'PowerShell + Bash']`, `dashboardUrl: 'http://localhost:37778'`, `atlasUrl: 'http://localhost:8765'`.
2. Create `src/app/harness/page.tsx` — minimal Server Component returning `<main>` with stub h1 "Harness" + eyebrow "FIELD NOTES / 2026-05-07". Include `export const metadata: Metadata = {...}` (filled in T4) and:
   ```tsx
   // force-static: this page is purely build-time content. If a future maintainer
   // adds a request-time data fetch (cookies(), headers(), etc.), Next will fail the
   // build rather than silently switch to dynamic rendering — that's intended.
   export const dynamic = 'force-static';
   ```
3. Run `npm run lint` and `npx vitest run` — confirm clean (no new failures).

**Read first:** `src/app/page.tsx`, `src/app/projects/page.tsx`, `src/data/projects.ts`, `src/data/about.ts`, `src/lib/fonts.ts`, `~/.claude/settings.json` (hooks block — for the `hookEvents` grounding), `~/.claude/CLAUDE.md` (Harness Architecture table for layer descriptions and ownership).

**Verify:**
- `npm run lint` exit 0
- `npx vitest run` exit 0
- New file paths exist
- `next dev` shows `/harness` rendering h1 (manual smoke; not strictly required for commit)

**Commit:** `feat(harness): scaffold route + data model`

---

### T2a — Data-driven sections (Hero, §1 list, §2 inventory, §5 hooks timeline, §6 colophon)

**Type:** ui
**Depends on:** T1
**Action:** Build out `src/app/harness/page.tsx` with the data-driven sections, plus the four supporting Server Components. No editorial prose (§3, §4) yet — that's T2b. Use `.hairline-rule` between every section.

1. **Hero** — eyebrow `<p className="font-mono text-xs uppercase tracking-[0.18em] text-tertiary">FIELD NOTES — 2026-05-07</p>`, h1 single line ("The harness behind the portfolio."), lede 2 sentences (≤ 280 chars total), all left-aligned, full grid width (no `.prose-body` clamp on hero).
2. **§1 The 10 layers** — render `<LayerCardList layers={layers} />`. Title h2: "The 10 layers." This list is the static fallback that T3's interactive diagram will progressively enhance over (the static list always renders in HTML; the diagram lazy-mounts on top). Body class `.prose-body`. Each `LayerCard` is a `<li>` inside a `<ol role="list">`, with the index, name, one-liner, and badges.
3. **§2 Localhost inventory** — render `<InventoryTable rows={inventory} />` inside a `<figure>` with `<figcaption>` "Captured 2026-05-07. Other listeners on the box (Bonjour, Steam, Superhuman) are not part of the harness." Use `font-mono text-sm` for the table cells. Status column uses muted text-tertiary for `zombie` / `on-demand` and a small crimson dot for `active`.
4. **§5 Hook pipeline** — `<HooksTimeline events={hookEvents} />`. Horizontal track on desktop (≥ 760px), stacks vertically below. Pure CSS via grid + flex; **no client JS, no `'use client'`**. The track itself is a 1px hairline gradient; per-event markers are 14px hairline-ringed dots; an active dot uses the `--accent` crimson.
5. **§6 Colophon** — three columns on desktop (1 column on mobile): "Stack on the harness side" / "This page's stack" / "Captured". Mono labels that match the existing portfolio footer.

`MigrationCallout` is **not** imported here — it lands in T2b.

**Read first:** `src/components/sections/hero.tsx`, `src/components/sections/about.tsx`, `src/app/globals.css`, `src/components/navigation/footer.tsx`, `src/components/projects/*.tsx` (any existing list-card pattern to mirror).

**Verify:**
- `npm run lint` exit 0
- `npx vitest run` exit 0
- `npx next build` exit 0
- Manual smoke: `next dev` → visit `/harness`, confirm hero + §1 + §2 + §5 + §6 render, body width ≤ 68ch in `.prose-body` sections, hairline rules visible between sections, no console errors.

**Commit:** `feat(harness): hero + 10-layer list + inventory + hooks timeline + colophon`

---

### T2b — Editorial prose (§3 migration, §4 chroma orphan)

**Type:** ui
**Depends on:** T2a (page exists with sections; we splice §3 + §4 between §2 and §5)
**Action:**

1. Create `src/app/harness/_components/MigrationCallout.tsx` per the file map's prop contract. Renders `<aside className="my-6 border-l-2 border-hairline pl-4">` with a mono kicker (`<p className="font-mono text-xs uppercase tracking-[0.14em] text-tertiary">{kind}</p>`), an h4 title, and the prose body. No client interactivity.
2. Insert §3 and §4 into `page.tsx` between §2 and §5 (each preceded by a `.hairline-rule`).
3. **§3 The migration** — three editorial paragraphs (≤ 250 words total). Inline `<MigrationCallout>` blocks for: (a) `kind="why"` titled "SQLite + cloud sync = corruption risk" — paragraph on why OneDrive Known Folder Move + WAL is a torn-write hazard; (b) `kind="phantom"` titled "Port 37777, unkillable" — paragraph on the phantom PID 10640 / WSL/Hyper-V reservation; (c) `kind="configs"` titled "Three config files in one pass" — paragraph listing `~/.claude/settings.json`, `~/.claude-mem/settings.json`, and `~/AppData/Local/claude-mem/settings.json` as the three places that needed `CLAUDE_MEM_DATA_DIR` + `CLAUDE_MEM_WORKER_PORT=37778`.
4. **§4 The chroma orphan bug** — four plain prose paragraphs (≤ 320 words total), no callouts: symptom (file locks survived sessions); investigation (4-deep process chain `cmd.exe → uvx → chroma-mcp.exe → python ×N`); discovery (worker only kills innermost PID; outer wrappers accumulate); detection rule (compare `supervisor.json`'s tracked count vs `Get-CimInstance Win32_Process -Filter "Name='cmd.exe' OR Name='uvx.exe' OR Name='chroma-mcp.exe'"`); upstream fix (process-tree kill via `taskkill /T /F /PID <root>` or POSIX `kill -SIGTERM -<pgid>`, filed against `github.com/thedotmack/claude-mem`).
5. Both §3 and §4 use `.prose-body` for body width. Inline `<code>` uses the existing JetBrains Mono utility.

**Read first:** `~/.claude/projects/C--Users-estac/memory/project_claude_mem_migration_2026-05-07.md`, `~/.claude/projects/C--Users-estac/memory/reference_claude_mem_chroma_leak.md`.

**Verify:**
- `npm run lint` exit 0
- `npx vitest run` exit 0
- Manual smoke: `next dev` → /harness shows §3 with three callouts and §4 as plain prose; word counts inside the stated bounds; no widow/orphan layout issues at common viewport widths.

**Commit:** `feat(harness): migration narrative + chroma orphan bug story`

---

### T3 — Architecture diagram component (paper+crimson port)

**Type:** ui
**Depends on:** T1 (data model), T2a (renders inside)
**Action:**

1. Create `src/app/harness/_components/ArchitectureDiagram.tsx` with `'use client'` directive.
2. Port the structure of `C:\Users\estac\harness-diagram\index.html` § Architecture Layers (the `.arch-stack` / `.layer` / `.badge` HTML scaffold) into JSX. **Do not copy the dark palette.** Map:
   - `--bg → --bg-base`
   - `--surface → --bg-base` (paper-on-paper layered look)
   - `--border → --border-hairline`
   - `--accent (gold #d4af37) → --accent (crimson #D7263D)`
   - All subsystem hues (`--c-mem`, `--c-gsd`, `--c-sp`, `--c-ctx`, `--c-mcp`, `--c-plugin`) → unified `--text-secondary` for inactive state, `--accent` for active/hover. **No multi-hue palette.**
3. Each layer row is `role="listitem"`, focusable (`tabIndex={0}`), has `aria-label="Layer ${N}: ${name}"`. Active/hovered layer gets `aria-current="true"` (and `aria-current` removed otherwise — do not leave stale).
4. Use Motion's `useReducedMotion()` to short-circuit all animations: when it returns `true`, set `transition: { duration: 0 }` and skip the underline animation; the active-aside swap becomes instant rather than `<AnimatePresence>`-cross-faded.
5. Active-layer panel: when a layer is hovered/focused, a sibling `<aside>` reveals the long-form description, role tags, and 1-2 callout pills. Use Motion `<AnimatePresence>` for cross-fade in default-motion mode.
6. Keyboard interaction: `ArrowDown` / `ArrowUp` move focus between layers, `Home` / `End` jump to first / last. `Esc` clears active selection.
7. Create `src/app/harness/_components/HarnessDiagramIsland.tsx` with `'use client'`. Inside:
   ```tsx
   'use client';
   import dynamic from 'next/dynamic';
   import { useBootReady } from '@/lib/boot-context';
   import { useReducedMotion } from 'motion/react';
   import { LayerCardList } from './LayerCardList';
   import type { HarnessLayer } from '@/data/harness';

   const ArchitectureDiagram = dynamic(
     () => import('./ArchitectureDiagram').then(m => m.ArchitectureDiagram),
     { ssr: false, loading: () => null }
   );

   interface HarnessDiagramIslandProps {
     layers: HarnessLayer[];
   }

   export function HarnessDiagramIsland({ layers }: HarnessDiagramIslandProps) {
     const ready = useBootReady();
     const reduce = useReducedMotion();
     // Static fallback always renders in HTML for SEO + reduced-motion users.
     // The interactive diagram replaces it once boot is ready and motion is allowed.
     const showInteractive = ready && !reduce;
     return showInteractive
       ? <ArchitectureDiagram layers={layers} />
       : <LayerCardList layers={layers} />;
   }
   ```
   In `page.tsx` §1, replace the bare `<LayerCardList />` from T2a with `<HarnessDiagramIsland layers={layers} />`. The static fallback is now owned by the island; `next/dynamic({ ssr: false })` lives inside a Client Component, not the Server Component page.

**Read first:** `harness-diagram/index.html` (full file — section "ARCHITECTURE LAYERS" through "annotation rail"), `src/app/globals.css` (utilities), `src/components/sections/hero.tsx` (CompileSequence — the existing reduced-motion handling pattern in this portfolio), `src/lib/boot-context.tsx` (the actual `useBootReady(): boolean` API — note this is a boolean, not a destructurable `{ bootReady }`).

**Verify:**
- `npm run lint` exit 0
- `npx next build` exit 0
- Manual smoke: visit `/harness`, tab through 10 layers via keyboard, every layer shows focus ring (existing `:focus-visible` rule applies), arrow-keys move focus, hovered layer reveals description aside, reduce motion in DevTools and confirm no animations fire, view-source confirms a static `<LayerCardList>` is in HTML (the SSG fallback) even before JS executes.
- Visual: zero non-paper colors except crimson.

**Commit:** `feat(harness): architecture diagram component (paper+crimson port)`

---

### T4 — Open Graph image + page metadata

**Type:** ui
**Depends on:** T2a
**Action:**

1. Create `src/app/harness/opengraph-image.tsx` exporting an async `Image` function returning `ImageResponse` (Next 16 OG image API). **Critical:** `ImageResponse` does not auto-resolve CSS-imported fonts; pass the font binary explicitly via the `fonts: [...]` array.
   ```tsx
   import { ImageResponse } from 'next/og';
   export const size = { width: 1200, height: 630 };
   export const contentType = 'image/png';
   export const alt = 'The harness behind the portfolio';

   export default async function Image() {
     const generalSans = await fetch(
       'https://api.fontshare.com/v2/fonts/general-sans/woff2/700.woff2'
     ).then(r => r.arrayBuffer());
     // If Fontshare's woff2 is rejected by satori (it requires TTF/OTF in some
     // satori versions), fall back to the JetBrains Mono TTF that next/font
     // already vendors at build time, OR vendor a one-time General Sans .otf
     // into `public/fonts/` and read it with fs.readFile in this route.
     return new ImageResponse(
       (<div /* JSX described below */ />),
       { ...size, fonts: [{ name: 'General Sans', data: generalSans, weight: 700, style: 'normal' }] }
     );
   }
   ```
   - Background: `#EFEBE3` paper.
   - Eyebrow (top-left, 28px, 0.18em tracking, uppercase, color `#8A857D`): "FIELD NOTES — 2026-05-07". Use system mono if a Fontshare mono fetch isn't worth the second roundtrip.
   - Title (left-aligned, 88px General Sans 700, color `#1A1A1A`, line-height 1.05): "The harness behind the portfolio."
   - Subtitle (left-aligned, 32px General Sans 400, color `#5C5853`, max-width 720px): "Ten layers, one localhost, and the bug that took two sessions to find."
   - Bottom-left meta (24px mono, color `#8A857D`): "evanstachowiak.com / harness".
   - Crimson hairline (`#D7263D`, height 4px, width 96px) above the title.
2. Update `src/app/harness/page.tsx` `metadata`:
   - `title`: `'Harness | Evan Stachowiak'`
   - `description`: ≤ 160 chars. Suggested: `'Field notes on the 10-layer Claude Code harness behind this portfolio — architecture, the OneDrive→AppData migration, and a chroma orphan bug.'`
   - `openGraph`: `type: 'article'`, `siteName: 'Evan Stachowiak'`, `publishedTime: '2026-05-07'`.
   - `twitter`: `card: 'summary_large_image'`.

**Read first:** `src/app/layout.tsx` (existing metadata shape), `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/metadata-files/opengraph-image.md` (per AGENTS.md: do NOT rely on training data for Next 16 OG patterns).

**Verify:**
- `npm run lint` exit 0
- `npx next build` exit 0 (the OG image pre-renders at build — confirm no error in the build log)
- Manual smoke: `npx next start` → visit `http://localhost:3000/harness/opengraph-image` → 1200×630 PNG renders correctly with paper bg + crimson hairline + General Sans 700 (not a system serif).

**Commit:** `feat(harness): opengraph-image + metadata`

---

### T5 — Replace `/toolkit` with `/harness` (nav + redirect + delete)

**Type:** chore
**Depends on:** T1 (route exists before redirect)
**Action:**
1. Edit `src/components/navigation/navbar.tsx` line 15: change `{ label: 'Toolkit', href: '/toolkit' }` to `{ label: 'Harness', href: '/harness' }`. Order in the array stays the same (4th of 4 items, between Projects and Resume).
2. Edit `next.config.ts` — add an async `redirects()` function:
   ```ts
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     async redirects() {
       return [
         { source: '/toolkit', destination: '/harness', permanent: true },
       ];
     },
   };

   export default nextConfig;
   ```
3. Delete `src/app/toolkit/page.tsx` and the `src/app/toolkit/` directory.
4. Word-bounded grep for stale references inside `src/`:
   ```
   grep -rnE "(^|[^A-Za-z])(Toolkit|/toolkit)" src/ --include="*.tsx" --include="*.ts" --include="*.md"
   ```
   Should return zero hits. `next.config.ts` (which contains the redirect entry) and `REDESIGN_ROADMAP.md` (T7's note) are outside `src/` — they are explicitly allowed to contain the substring.

**Read first:** `src/components/navigation/navbar.tsx`, `next.config.ts`.

**Verify:**
- `npm run lint` exit 0
- `npx vitest run` exit 0
- `npx next build` exit 0
- Manual smoke against `next dev`: `curl -sI http://localhost:3000/toolkit` returns `308` (Next emits 308 for `permanent: true`; spec accepts 301/308 interchangeably for permanent). `Location: /harness` header present. Browser-tested redirect lands cleanly.
- The word-bounded grep above returns zero hits inside `src/`.

**Commit:** `chore(nav): replace /toolkit with /harness + 308 redirect`

---

### T6 — Tests for the diagram component

**Type:** test
**Depends on:** T3
**Action:** Create `src/__tests__/components/ArchitectureDiagram.test.tsx`. The directory `src/__tests__/components/` does not yet exist — vitest's existing config globs (`vitest.config.ts`) will pick up new files under `src/__tests__/**/*.test.tsx` automatically; no config change needed. Cases:

1. Renders all 10 layers from the imported `layers` array.
2. Each layer has an `aria-label` matching the `Layer ${N}: ${name}` pattern (assert via `screen.getByLabelText(/^Layer \d+:/)` returning 10 elements).
3. Initial state: no element has `aria-current="true"` (assert `screen.queryAllByRole('listitem', { current: 'true' })` is empty).
4. After programmatic focus on layer N (`fireEvent.focus(layers[N - 1])`): that layer has `aria-current="true"`, and an `<aside>` containing the layer's `oneLiner` is visible (`screen.getByRole('complementary')`).
5. **Reduced-motion short-circuit:** override `window.matchMedia` *per-test* (the global mock in `src/__tests__/setup.ts` hardcodes `matches: false`):
   ```tsx
   beforeEach(() => {
     vi.spyOn(window, 'matchMedia').mockImplementation((q: string) => ({
       matches: q === '(prefers-reduced-motion: reduce)',
       media: q,
       onchange: null,
       addListener: () => {},
       removeListener: () => {},
       addEventListener: () => {},
       removeEventListener: () => {},
       dispatchEvent: () => false,
     } as MediaQueryList));
   });
   afterEach(() => vi.restoreAllMocks());
   ```
   Then assert: focusing layer N immediately reveals the description aside (no `waitFor` needed — instant swap), and the rendered aside element has no inline `style` attribute matching `transition` or `transform` (regex check on `aside.getAttribute('style')`).
6. Wrap the diagram in a real `<BootProvider>` from `@/lib/boot-context` and call `useBootMarkReady()` in a `beforeEach` to ensure `ready === true` before assertions. **Do not** mock the BootContext shape with a literal `{ bootReady: true }` — the actual context exposes `useBootReady(): boolean`, not a destructurable object.

**Read first:** `src/__tests__/setup.ts` (the actual setup file at this path; confirms the global `matchMedia.matches: false` default), `src/__tests__/lib/analytics.test.ts` and `src/__tests__/hooks/use-typing-animation.test.ts` (the only existing tests — for arrange/assert style), `vitest.config.ts` (test-file glob), `src/lib/boot-context.tsx` (the real `useBootReady` / `useBootMarkReady` signatures).

**Verify:**
- `npx vitest run` exit 0, all tests in this spec pass
- Coverage: at least one assertion per case 1–5 above

**Commit:** `test(harness): diagram component tests`

---

### T7 — Roadmap footnote

**Type:** chore
**Depends on:** T1–T6 (purely a docs note about completed work)
**Action:** Append a short note (≤ 2 sentences) to `REDESIGN_ROADMAP.md`, after wherever the Phase 5 entry lives or at the end of the Phases section, indicating Phase 5 (`/toolkit`) was retargeted as the `/harness` build and completed on branch `feat/harness-page`. Do not rewrite earlier phases.

**Verify:**
- `git diff REDESIGN_ROADMAP.md` shows only the appended note, no other changes.

**Commit:** `chore(roadmap): note phase 5 → harness build`

---

### T8 — Final verification (the verification loop)

**Type:** verification
**Depends on:** T1–T7
**Action:** Confirm every success-criteria item below before considering the phase complete. Record outcomes in `.planning/phases/01-harness-page/VERIFICATION.md` (created at execution time).

1. `npm run lint` — exit 0.
2. `npx vitest run` — all tests pass, including the new diagram spec.
3. `npx next build` — exit 0, no new warnings, build report shows `/harness` as static (`○` symbol).
4. **Production-build Lighthouse:** `npx next build && npx next start &` then run Lighthouse CLI (or Chrome DevTools panel) against `http://localhost:3000/harness` on **both** mobile and desktop default presets. Record perf + a11y scores. **Do not run Lighthouse against `next dev`** — dev mode disables minification and ships React DevTools, which produces meaningless perf numbers.
5. With `next start` still running: `curl -sI http://localhost:3000/toolkit` → `HTTP/1.1 308` with `Location: /harness`.
6. `grep -rnE "text-terminal-" src/ --include="*.tsx" --include="*.ts" --include="*.css"` → 0 hits (no dark-mode token regression).
7. Word-bounded `grep -rnE "(^|[^A-Za-z])(Toolkit|/toolkit)" src/ --include="*.tsx" --include="*.ts" --include="*.md"` → 0 hits. The `next.config.ts` (redirect entry) and `REDESIGN_ROADMAP.md` (Phase 5 note) are explicitly allowed and excluded by being outside `src/`.
8. Secret scrub: `grep -rnE '(AKIA|ghp_|gho_|sk-ant-|eyJhbGc)' src/data/harness.ts src/app/harness/` → 0 hits.
9. Visual a11y check: tab through diagram, every layer reachable, focus ring visible per existing `:focus-visible` rule, screen reader announces "Layer N: name" + "current" when active.
10. Reduced-motion check: enable in DevTools → reload → confirm no animations fire on hero-loader, hover-spotlight, or diagram; static `<LayerCardList>` renders instead of the interactive diagram.
11. OG image: `npx next start` → visit `/harness/opengraph-image` → 1200×630 PNG renders with paper bg + crimson hairline + General Sans 700 (not a system serif).
12. Stop the `next start` background process before merging.

**Verify:** All twelve checks pass.

**Commit:** *(no separate commit — verification only.)*

---

## Suggested execution order

```
T1 → T2a → T2b ─┬─→ T3 ─┬─→ T6
                │       │
                └─→ T4 ─┘
                            │
                            └─→ T5 → T7 → T8
```

T2b/T3/T4 share no merge conflicts and could be parallelized, but a single-executor sequential pass is simplest. **8 commits total** (T1, T2a, T2b, T3, T4, T5, T6, T7).

---

## Success criteria

- [ ] `npx next build` passes with no new errors or warnings
- [ ] `/harness` renders SSG (`○` in build report)
- [ ] `/toolkit` returns a 308 redirect to `/harness` (verified via `curl -I` against `next start`, **not** `next dev`)
- [ ] Lighthouse perf ≥ 95 on `/harness` against the production build (`next build && next start`), mobile + desktop both reported in T8 evidence
- [ ] Lighthouse a11y = 100 on `/harness`
- [ ] All existing vitest tests still pass (no regressions)
- [ ] New `ArchitectureDiagram.test.tsx` passes with ≥ 5 assertions covering cases 1–5
- [ ] No new `text-terminal-*` or other dark-mode tokens introduced (`grep` evidence)
- [ ] No stale `Toolkit` / `/toolkit` references inside `src/` (word-bounded `grep` evidence)
- [ ] No secrets/API keys in any harness data file or component (secret-scrub `grep` evidence)
- [ ] `prefers-reduced-motion` short-circuits the diagram's hover/active animations (manual + test evidence)
- [ ] OG image renders at `/harness/opengraph-image` with the General Sans font correctly bundled
- [ ] Diagram has accessible labels — every layer reachable by keyboard, `aria-label` per layer, current layer announced via `aria-current`
- [ ] `npm run lint` passes
- [ ] `git diff` review: no incidental edits outside the file map

---

## Verification loop steps (post-execution)

1. **After every task commit:** run `npm run lint` and `npx vitest run`. After T2a, T2b, T3, T4, and T5 also run `npx next build`.
2. **On the final commit (T7):** run T8 in full, record evidence (Lighthouse JSON or screenshots) into `.planning/phases/01-harness-page/VERIFICATION.md`.
3. **If any check fails:** revert the failing change set with `git revert --no-edit` (or fix forward if scope is small), re-run, and re-verify. Do not move on with a red gate.
4. **PR readiness:** `git push -u origin feat/harness-page` and open a PR titled `feat(harness): /harness page replaces /toolkit` with the success criteria checklist as the PR body.

---

## Verification checklist for the Plan-Checker (re-run after this revision)

- [x] Every requirement (R-1 through R-12) maps to at least one task. ✅ Coverage table updated to reference T2a/T2b.
- [x] Every task has a concrete, executor-actionable `Action` block.
- [x] Every task has a concrete `Verify` block with runnable commands or specific manual checks.
- [x] Dependencies are explicit; the suggested order is a valid topological sort.
- [x] No task references files that don't exist or won't exist by the time it runs (`HarnessDiagramIsland.tsx`, `LayerCardList.tsx`, `ArchitectureDiagram.tsx` are all listed in the file map and created in dependency order).
- [x] Test paths corrected: `src/__tests__/setup.ts` (not `lib/setup.ts`); existing tests at `src/__tests__/lib/analytics.test.ts` + `src/__tests__/hooks/use-typing-animation.test.ts` cited explicitly; `src/__tests__/components/` directory will be created by the spec itself.
- [x] BootContext API references corrected: `useBootReady(): boolean` (and `useBootMarkReady`) used per the real signatures in `src/lib/boot-context.tsx`. No `{ bootReady }` destructuring anywhere.
- [x] `next/dynamic({ ssr: false })` lives inside a Client Component (`HarnessDiagramIsland.tsx`), not the Server Component page.
- [x] OG image fonts loaded via explicit `fonts: [{ name, data, weight, style }]` array, not a CDN auto-fetch.
- [x] Reduced-motion test override uses `vi.spyOn(window, 'matchMedia')` per-test, not global mock alteration.
- [x] Lighthouse runs against `next build && next start`, not `next dev`.
- [x] `grep` gates are word-bounded (`(^|[^A-Za-z])(Toolkit|/toolkit)`), and allowed-substring locations (`next.config.ts`, `REDESIGN_ROADMAP.md`) are documented.
- [x] `hookEvents` data sourced from `~/.claude/settings.json` at task time, not baked from authoring memory.
- [x] Every commit message follows conventional commits and matches the file map of the task.
- [x] Locked decisions (D-01 through D-09) are honored in the task descriptions.
- [x] Out-of-scope items in CONTEXT.md remain out-of-scope in the file map.
- [x] No new dependencies added; uses only what's in `package.json`.
- [x] No `tailwind.config.ts` is created — new tokens (if any) land in `globals.css` `@theme inline` only.

---

<threat_model>

## Threat model

This is a static, build-time-rendered page with no user input, no auth surface, no server-side state, no API routes, and no third-party data fetching at request time. The threat surface is correspondingly small.

### Identified threats

| ID | Threat | Severity | Mitigation |
|----|--------|----------|------------|
| TM-1 | **Information disclosure** — content references internal paths (`C:\Users\estac\...`, `~/.claude/...`), localhost ports (37777, 37778, 8765), and process IDs. | LOW | All paths/ports/PIDs referenced are loopback-only and identify only the author's local environment. They contain no credentials, tokens, or sensitive data. The disclosure is intentional (the page is *about* this environment). Mitigation: ensure no real credentials, API keys, OAuth tokens, or session data are embedded in `harness.ts`, callouts, or the OG image. **Verifier check:** `grep -rnE '(AKIA\|ghp_\|gho_\|sk-ant-\|eyJhbGc)' src/data/harness.ts src/app/harness/` returns 0 hits (T8 step 8). |
| TM-2 | **XSS via injected HTML** — N/A. The page renders only static, build-time content from `src/data/harness.ts`. No user input, no React raw-HTML escape-hatch props, no `innerHTML` writes, no client-side string templating. | NONE | None required. **Verifier check:** `grep -rn "innerHTML\|setInnerHtml\|__html" src/app/harness/` returns 0 hits. The plan also forbids the React raw-HTML escape-hatch prop in any harness component. |
| TM-3 | **Open redirect** — the `/toolkit → /harness` redirect is hardcoded, not user-parameterized. | NONE | `redirects()` returns a static array. No `:slug*` capture groups. No risk. |
| TM-4 | **Supply chain (transitive deps)** — page uses Motion, Next, Tailwind v4, all already in `package.json`. No new deps added. | NONE | Honor the "no new dependencies" rule in scope. |
| TM-5 | **Resource exhaustion** — diagram client island runs on visitor browser. Could it loop, leak memory, or stall? | LOW | Bounded animation count (10 layers, no recursive enumeration). All Motion timelines are bounded. Reduced-motion short-circuits all animation. **Verifier check:** the diagram component has no `setInterval`, no recursive `requestAnimationFrame`, no unbounded loops. |
| TM-6 | **Dependency on external CDN** — General Sans loads from Fontshare CDN at runtime for the page itself; the OG image fetches it once *at build*. | LOW | The page-level CDN dependency is pre-existing portfolio behavior, not introduced here. The OG image runs at build time, not as an Edge route — confirmed by the `export default async function Image()` shape in T4 step 1, which produces a static PNG baked into `.next/`. **Verifier check:** OG route does not export `runtime: 'edge'`. |

### Threats that block (severity HIGH or above)

None identified.

### Conclusion

The phase is safe to execute as planned. The verifier should run the three `grep` checks plus the `runtime` shape check above before declaring phase complete.

</threat_model>

---

## Notes for the executor

- This plan was hand-written, then verified by `gsd-plan-checker` (rev 1: 2 BLOCKERS + 7 WARNINGS + 2 INFO → all addressed in this revision). Treat any future checker findings as authoritative; if any conflict with this plan, the checker wins.
- All file paths in this plan are relative to the project root unless prefixed with `~` or `C:\`. The project root is `C:\Users\estac\OneDrive - Syracuse University\uni\2026\spring2026\projects\portfolio website\portfolio`.
- `AGENTS.md` at the repo root says: *"This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."* That rule applies to every task here. When in doubt about a Next 16 / Tailwind v4 / Motion 12.38 / OG-image API, **read `node_modules/next/dist/docs/`** or the framework's own source — do not rely on training-data memory. Existing portfolio components (`src/components/sections/hero.tsx`, `src/app/template.tsx`) are the closest reference for how this stack uses Motion + reduced-motion.
- TypeScript style rules to honor (per `~/.claude/rules/typescript/coding-style.md`): named `interface` for object shapes; explicit types on exported functions/components; no `any` (use `unknown` with narrowing); no `console.log` in production code.
- Do not introduce new dependencies. Do not run `npx shadcn add`. Do not touch other routes.
- The branch `feat/harness-page` is already created off `dev`. Each commit lands on this branch.
- Open the PR at the end with the success-criteria checklist in the body.
