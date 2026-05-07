# Portfolio Roadmap — Harness Page

**Owner:** Evan Stachowiak
**Repo:** portfolio (Next 16.2.2 / App Router / Tailwind v4)
**Initialized:** 2026-05-07
**Note:** This `.planning/` tree was bootstrapped for the `/harness` build only. The broader portfolio redesign timeline lives in `REDESIGN_ROADMAP.md` at the repo root. Do not duplicate.

---

## Phase 1 — Harness Page Build (`/harness`)

**Status:** PLANNED
**Branch:** `feat/harness-page` (off `dev`)
**Goal:** Ship a production-grade `/harness` page documenting the 10-layer Claude Code harness, the OneDrive→AppData migration, and the chroma-orphan-reaping bug. Replace placeholder `/toolkit`. Direction: Atlas-as-essay (full-bleed paper-themed architecture diagram + editorial longform prose).

**Mode:** standard
**Depends on:** none (greenfield route)

**Phase requirement IDs:** R-1 through R-12 (see `requirements.md`).

**Success criteria summary:**
- `/harness` builds SSG, lints clean, all tests pass
- `/toolkit` 301-redirects to `/harness`
- Lighthouse perf ≥ 95 (mobile + desktop), a11y = 100
- Architecture diagram is keyboard-navigable with `aria-current` and `aria-label` per layer
- `prefers-reduced-motion` short-circuits the diagram's hover/active animations
- No new dark-mode (`text-terminal-*`) tokens introduced

---

## Out of scope for this roadmap

- Phase 4 (projects MDX) from `REDESIGN_ROADMAP.md` — separate effort, unblocked by this work.
- Hardware / Daily Drivers / Writing surfaces from the original `/toolkit` plan — not coming back as part of this build.
- Live data fetching from the local worker — see `CONTEXT.md` for rationale.
