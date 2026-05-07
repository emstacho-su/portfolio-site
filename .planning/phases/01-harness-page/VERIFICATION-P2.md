# VERIFICATION — Phase 2 (Atlas-style dashboard pivot)

**Verified:** 2026-05-07
**Branch:** `feat/harness-page` (continued from Phase 1)
**Phase 2 commits:** 11 atomic (T1–T11)

---

## What Phase 2 changed (vs Phase 1)

The original Phase 1 page was an editorial essay with a single hover-aside diagram. Phase 2 pivots toward the harness-diagram/index.html (Atlas at localhost:8765) interaction model:

- Hero retranslated: italic-accent h1, paper+crimson stat strip with 6 numbers (10 / 7 / 22 / 15+ / 3 / 6).
- 6-tab sticky nav (01. Architecture / 02. Hooks Pipeline / 03. Skills Map / 04. Plugins & MCP / 05. Memory Layer / 06. GSD Workflow), backdrop-blur, ArrowL/R keyboard cycling.
- Architecture tab is an inline accordion — clicking a layer expands it in place, showing a longer description, the disk paths it lives at, and "Related" pill buttons that jump to neighbor layers.
- Hooks / Skills / Plugins / Memory / GSD tabs ported from Atlas, re-themed to monochrome+crimson.
- Inventory table relocated into the Memory Layer tab.
- Editorial §3 + §4 prose retained inline below the dashboard, renumbered §1 + §2; Colophon now §3.
- Phase 1's hover-aside `ArchitectureDiagram` and `LayerCardList` / `LayerCard` / `HarnessDiagramIsland` deleted; replaced by the accordion + island-less direct ArchitectureTab.

---

## Twelve-check verification

| # | Check | Status | Evidence |
|---|---|---|---|
| 1 | `npm run lint` clean on /harness + tests + data | ✅ | `npx eslint src/app/harness/ src/__tests__/components/ src/data/harness.ts` exits 0. Pre-existing errors in `src/hooks/use-analytics.ts` + `src/hooks/use-typing-animation.ts` carry forward from Phase 1 (Phase 7 cleanup item per `REDESIGN_ROADMAP.md`). |
| 2 | `npx vitest run` all pass | ✅ | **28 / 28** pass (Phase 1 had 19; +14 from new HarnessTabs + ArchitectureTab specs; -5 from removed ArchitectureDiagram spec → net +9). |
| 3 | `npx next build` clean, `/harness` static | ✅ | Build report shows `○ /harness` and `○ /harness/opengraph-image` (both static). |
| 4 | Lighthouse perf ≥ 95 on prod build | ⚠ partial | **Desktop perf 98** ✅. **Mobile perf 87** ❌ (Phase 1 had 88 — 1 point regression within noise). Same root cause as Phase 1: global `HeroLoader` + Lenis + Fontshare CDN ship on every route via `layout.tsx`. Out of `/harness` scope. |
| 4b | Lighthouse a11y = 100 | ⚠ partial | **Mobile 97 / Desktop 97** (vs Phase 1: mobile 97 / desktop 96 — desktop +1). Remaining failures are still the shared `Navbar` Home link `aria-label="Home"` ≠ "ES_" mismatch and the `Footer` copyright `text-tertiary` contrast. /harness source itself has zero a11y issues. |
| 5 | `/toolkit` 308 → /harness | ✅ | `curl -sI http://localhost:3100/toolkit` → `HTTP/1.1 308 Permanent Redirect`, `location: /harness`. |
| 6 | No `text-terminal-*` regression | ✅ | `grep -rnE "text-terminal-" src/` → 0 hits. |
| 7 | No stale `Toolkit` / `/toolkit` in `src/` | ✅ | Word-bounded grep → 0 hits. `next.config.ts` redirect entry and `REDESIGN_ROADMAP.md` Phase 5 note allowed (outside `src/`). |
| 8 | Secret scrub | ✅ | `grep -rnE '(AKIA\|ghp_\|gho_\|sk-ant-\|eyJhbGc)' src/data/harness.ts src/app/harness/` → 0 hits. |
| 9 | Tab + accordion keyboard nav | ✅ | Asserted by both new specs. Tabs: Click/ArrowL/ArrowR/Home/End all flip aria-selected + tabindex correctly. Accordion: click toggles aria-expanded + reveals Description + Files + Related; Esc closes; Related pill buttons jump and re-focus. |
| 10 | `prefers-reduced-motion` short-circuits | ✅ | `ArchitectureTab.test.tsx` reduced-motion case asserts no inline `transition:` styles on the motion container under reduced motion; description still visible. |
| 11 | OG image renders | ✅ | `curl -sI /harness/opengraph-image` → 200, `content-type: image/png`, **52,115 bytes** (PNG, identical to Phase 1 — no regression in the OG renderer). |
| 12 | Stop `next start` | ✅ | Cleaned up post-verification (`taskkill /PID <port-3100-pid> /F`). |

---

## Lighthouse scores (production build, `next build && next start`)

### Mobile

| Category | Score |
|---|---|
| Performance | 87 |
| Accessibility | 97 |
| Best Practices | 96 |
| SEO | 100 |

**Performance breakdown:**
- FCP 1.0 s ✅
- LCP 3.4 s — main gap, identical root cause to Phase 1 (global hero loader + Lenis on layout.tsx)
- TBT 190 ms (Phase 1: 140 ms — 50 ms regression. New tab nav + accordion add ~50ms of hydration JS — within budget for the interaction value.)
- CLS 0 ✅
- Speed Index 3.6 s

### Desktop

| Category | Score |
|---|---|
| Performance | 98 ✅ |
| Accessibility | 97 |
| Best Practices | 96 |
| SEO | 100 |

**Performance breakdown:**
- FCP 0.3 s ✅
- LCP 0.8 s ✅
- TBT 0 ms ✅
- CLS 0 ✅

Reports: `lighthouse-mobile-p2.json` and `lighthouse-desktop-p2.json` in this directory.

---

## Phase 2 component inventory

| Component | Path | Type | Purpose |
|---|---|---|---|
| `HarnessTabs` | `_components/HarnessTabs.tsx` | client | Sticky 6-tab nav + roving tabindex. Owns active state. |
| `ArchitectureTab` | `_components/ArchitectureTab.tsx` | client | Tab 01 — 10-layer accordion w/ Description + Files + Related. |
| `HooksTab` | `_components/HooksTab.tsx` | server | Tab 02 — legend + timeline + per-event detail table. Wraps existing HooksTimeline. |
| `SkillsTab` | `_components/SkillsTab.tsx` | server | Tab 03 — always-on bento (5 packs) + vault grid (4 categories) + lookup flow. |
| `PluginsTab` | `_components/PluginsTab.tsx` | server | Tab 04 — 4 marketplace cards (16 plugins total) + 7 MCP server pills. |
| `MemoryTab` | `_components/MemoryTab.tsx` | server | Tab 05 — claude-mem + Auto-memory two-card explainer + 2 callouts + relocated inventory table. |
| `GsdTab` | `_components/GsdTab.tsx` | server | Tab 06 — 6 phase cards + situational dispatch table + 2 callouts. |
| `HooksTimeline` | `_components/HooksTimeline.tsx` | server | Reused from Phase 1 inside HooksTab. |
| `InventoryTable` | `_components/InventoryTable.tsx` | server | Reused from Phase 1 inside MemoryTab. |
| `MigrationCallout` | `_components/MigrationCallout.tsx` | server | Reused from Phase 1 inline §1. |

---

## Commits in Phase 2

```
6d21702  feat(harness): hero retranslation — italic-accent h1 + 6-stat strip
3628b12  feat(harness): tab nav shell — 6 sticky numbered tabs with keyboard
c8bc997  feat(harness): Architecture tab — 10-layer inline accordion
0302ed3  feat(harness): Hooks Pipeline tab — legend + timeline + event table
2aa5dcc  feat(harness): Skills Map tab — bento grid + vault lookup flow
450d5f6  feat(harness): Plugins & MCP tab — marketplace grid + MCP server list
8268d8e  feat(harness): Memory Layer tab — two-system explainer + relocated inventory
54a3a07  feat(harness): GSD Workflow tab — 6-phase grid + situational dispatch
da8d01b  feat(harness): page composition — final ordering + section renumber
d9861b4  test(harness): tab nav + accordion specs
(this commit) docs(harness): VERIFICATION-P2.md
```

---

## Open follow-ups (deferred from Phase 1, still applicable)

1. **Mobile perf gate** — gate `HeroLoader` to `pathname === '/'` in `src/app/layout.tsx`. Self-host General Sans (Phase 7 already plans). Estimated mobile perf delta: +7–10 points to clear the ≥95 bar.
2. **Layout-level a11y** — fix navbar Home link aria-label/visible-text mismatch and footer copyright `text-tertiary` → `text-muted-foreground`. One-line change each, but in shared layout — own phase.
