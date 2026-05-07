# VERIFICATION — Phase 1: Harness Page Build

**Verified:** 2026-05-07
**Branch:** `feat/harness-page`
**Commits:** T1–T8 + a11y patch (8 commits)

---

## Twelve-check verification (T8)

| # | Check | Status | Evidence |
|---|---|---|---|
| 1 | `npm run lint` exit 0 | ⚠ scoped | Lint clean on all `/harness` source. Pre-existing errors in `src/hooks/use-analytics.ts` (sendEvent access-before-decl, react-hooks/immutability) and `src/hooks/use-typing-animation.ts` (unused-import) are documented as Phase 7 cleanup items in `REDESIGN_ROADMAP.md` and were not introduced here. |
| 2 | `npx vitest run` all tests pass | ✅ | 19/19 tests pass (was 14 before T6 added 5 cases). |
| 3 | `npx next build` clean, `/harness` static | ✅ | Build report shows `○ /harness` and `○ /harness/opengraph-image` (both static). |
| 4 | Lighthouse perf ≥ 95 against `next start` | ⚠ partial | **Desktop perf 98** ✅. **Mobile perf 88** ❌. Mobile gap is `unused-javascript` (~430ms) from the global `HeroLoader`/`Lenis`/Fontshare CDN wired up in `src/app/layout.tsx` — out of `/harness` scope. See "Remaining gaps" below. |
| 4b | Lighthouse a11y = 100 | ⚠ partial | **Mobile 97 / Desktop 96.** All `/harness` source a11y issues fixed in commit `faf56bd`. Remaining failures are in the shared `Navbar` (Home link `aria-label="Home"` ≠ visible text "ES_") and `Footer` (`text-tertiary` copyright contrast) — pre-existing layout-level issues. |
| 5 | `/toolkit` returns 308 → `/harness` | ✅ | `curl -sI http://localhost:3100/toolkit` → `HTTP/1.1 308 Permanent Redirect`, `location: /harness`. |
| 6 | No `text-terminal-*` regression | ✅ | `grep -rnE "text-terminal-" src/` → 0 hits. |
| 7 | No stale `Toolkit` / `/toolkit` in `src/` | ✅ | Word-bounded `grep -rnE "(^|[^A-Za-z])(Toolkit|/toolkit)" src/` → 0 hits. `next.config.ts` redirect entry and `REDESIGN_ROADMAP.md` Phase 5 note are explicitly allowed (outside `src/`). |
| 8 | Secret scrub | ✅ | `grep -rnE '(AKIA\|ghp_\|gho_\|sk-ant-\|eyJhbGc)' src/data/harness.ts src/app/harness/` → 0 hits. |
| 9 | Keyboard a11y on diagram | ✅ | Asserted by `ArchitectureDiagram.test.tsx`: 10 `aria-label="Layer N: name"` listitems, `aria-current="true"` on focus, ArrowDown/Up/Home/End/Esc keyboard nav, focus-ring inherits global `:focus-visible`. Confirmed in HTML: post-hydration the diagram exposes 10 keyboard-reachable layer rows. |
| 10 | `prefers-reduced-motion` short-circuits | ✅ | `ArchitectureDiagram.test.tsx` case 5: with matchMedia mocked `matches:true`, the motion container does not carry an inline `transition:` style. The `HarnessDiagramIsland` wrapper falls back to the static `LayerCardList` entirely under reduced-motion. |
| 11 | OG image renders | ✅ | `curl -sI http://localhost:3100/harness/opengraph-image` → `200`, `content-type: image/png`, 52,115 bytes (PNG). Build pre-renders it; static at request time. |
| 12 | Stop `next start` | ✅ | Cleaned up post-verification. |

---

## Lighthouse details (production build, `next build && next start`)

### Mobile (form-factor=mobile, default preset)

| Category | Score |
|---|---|
| Performance | 88 |
| Accessibility | 97 |
| Best Practices | 96 |
| SEO | 100 |

**Performance breakdown:**
- FCP 0.9 s ✅
- LCP 3.5 s (score 0.62) — main gap
- TBT 140 ms ✅
- CLS 0 ✅
- Speed Index 3.6 s

**Top opportunity:** unused-javascript saves ~430 ms — sourced from the `HeroLoader`/Lenis/Motion bundles wired in `src/app/layout.tsx` for every page.

### Desktop (preset=desktop)

| Category | Score |
|---|---|
| Performance | 98 ✅ |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 100 |

**Performance breakdown:**
- FCP 0.3 s ✅
- LCP 0.8 s (score 0.97) ✅
- TBT 0 ms ✅
- CLS 0 ✅
- Speed Index 1.3 s

Reports written to `lighthouse-mobile-v3.json` and `lighthouse-desktop-v3.json` in this directory.

---

## Remaining gaps (deferred to follow-up phases)

### Mobile performance: ~7 points below target

**Root cause:** `src/app/layout.tsx` mounts global components on every route — `HeroLoader` (boot animation), Lenis smooth scroll, Motion 12.38, `BootProvider`. Plus the Fontshare General Sans CSS `@import` is render-blocking on first paint. None of these are useful on `/harness` (the boot loader is `sessionStorage`-gated to play once on landing only; `/harness` ships the JS without playing).

**Recommended follow-up:** gate `HeroLoader` to the landing route only (`pathname === '/'`), and either self-host General Sans (already on Phase 7 of `REDESIGN_ROADMAP.md`) or move it behind `font-display: swap` with a system fallback. Estimated mobile perf delta: +7–10 points.

**Out of scope here** because the global layout serves `/projects`, `/resume`, `/about`, `/interested` too — the change benefits the whole portfolio and should be its own phase.

### Accessibility: 96–97 vs target 100

Two shared-layout issues, both pre-existing:

1. **`label-content-name-mismatch`** — `src/components/navigation/navbar.tsx`, the Home link uses `aria-label="Home"` but visible text is `ES_`. WCAG 2.5.3 expects the accessible name to start with the visible text.
2. **`color-contrast`** — `src/components/navigation/footer.tsx`, the `<p class="text-tertiary">© 2026 ...</p>` copyright fails AA (3.7:1 vs 4.5:1) for the same reason `/harness` did before commit `faf56bd`. Bump to `text-muted-foreground`.

Each is a one-line change but lives in shared layout. The phase plan's "Out of scope" section explicitly excluded layout-level edits.

**Recommended follow-up:** a focused a11y phase that touches the shared layout — same pattern as the `/harness` patch in `faf56bd`.

---

## In-scope outcomes

- 8 atomic commits on `feat/harness-page`, every one lint+test clean.
- Final route map: `/` `/projects` `/projects/[slug]` `/resume` `/harness` `/harness/opengraph-image` `/interested` `/api/analytics` `/robots.txt` `/sitemap.xml` plus `_not-found`. `/toolkit` is gone.
- 22 hook events sourced live from `~/.claude/settings.json` (not authoring memory).
- All 12 R-IDs covered (R-1 through R-12 mapped to T1–T8 in PLAN.md).
- All 9 locked decisions (D-01 through D-09) honored.
- Threat model: 6 entries reviewed; no HIGH+ items. Mitigations verified by check 8 (secret scrub) and the no-raw-HTML grep.
- Vitest: 19 / 19 pass.
- Build: `/harness` ships SSG; `/harness/opengraph-image` ships SSG; redirect emits 308.

---

## Commits in this phase

```
fdc7656  chore(nav): replace /toolkit with /harness + 308 redirect
6d5a63a  chore(roadmap): note phase 5 retargeted as /harness build
e3d7b8d  feat(harness): architecture diagram component (paper+crimson port)
e43ba82  feat(harness): hero + 10-layer list + inventory + hooks timeline + colophon
822bcb2  feat(harness): scaffold route + data model
920ccf6  feat(harness): migration narrative + chroma orphan bug story
772475a  feat(harness): opengraph-image + metadata
205e85c  test(harness): diagram component tests
faf56bd  fix(harness): a11y — heading order + color contrast on /harness components
```

(commit count above is 9; T7 commit `6d5a63a` is for the roadmap note, T8 a11y fix `faf56bd` is a follow-up patch found during the verification loop. T1–T7 plus T8's patch.)
