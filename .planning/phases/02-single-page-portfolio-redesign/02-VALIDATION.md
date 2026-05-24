---
phase: 2
slug: single-page-portfolio-redesign
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-24
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `02-RESEARCH.md` → Validation Architecture. Task IDs are assigned by the planner; rows below are requirement-anchored and the planner maps each new test to its task/wave.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 (jsdom, globals on) + @testing-library/react 16 + @testing-library/jest-dom |
| **Config file** | `vitest.config.ts` (alias `@` → `src`; setup `src/__tests__/setup.ts`) |
| **Quick run command** | `npx vitest run src/__tests__/lib src/__tests__/data` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10-20 seconds (quick); full suite under ~60s |

> **Hard prerequisite:** `node_modules` is NOT present in this tree. `npm install` is a blocking Wave 0 step — no build/test/lint/dev command works until it completes.

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/__tests__/lib src/__tests__/data` (fast deterministic units)
- **After every plan wave:** Run `npx vitest run` (full suite) + `npm run lint`
- **Before `/gsd-verify-work`:** `npm run build` clean, full vitest green, `npm run lint` clean, Lighthouse perf ≥ 95 / a11y = 100 in Vercel preview
- **Max feedback latency:** ~60 seconds

---

## Per-Task Verification Map

> Requirement-anchored. The planner assigns Task IDs and confirms wave placement; "File Exists" reflects current tree (W0 = created in Wave 0).

| Requirement | Wave | Behavior | Test Type | Automated Command | File Exists |
|-------------|------|----------|-----------|-------------------|-------------|
| R-16 | 1 | All six legacy sources redirect (correct status + destination) | integration (config assertion) | `npx vitest run src/__tests__/lib/redirects.test.ts` | ❌ W0 |
| R-17 | 2 | Analytics schema accepts `section_view` and still accepts legacy events | unit | `npx vitest run src/__tests__/lib/analytics.test.ts` | ✅ extend |
| R-26 / R-25 | 2 | Project data model: required fields + ordered demos with valid `type`; featured set correct | unit | `npx vitest run src/__tests__/data/projects.test.ts` | ❌ W0 |
| R-20 | 2 | No em dash (U+2014) in any `src/data/*.ts` export | unit | `npx vitest run src/__tests__/lib/em-dash.test.ts` | ❌ W0 |
| R-28 | 2 | Harness renders six pillars; old tab UI gone | unit (RTL) | `npx vitest run src/__tests__/components/harness.test.tsx` | ❌ W0 (replaces deleted tab tests) |
| R-14 | 1 | Scrollspy hook sets active id from IntersectionObserver entries | unit (RTL, mock IO) | `npx vitest run src/__tests__/hooks/use-scrollspy.test.ts` | ❌ W0 |
| R-27 | 3 | Pop-out focus trap / ESC / focus-return (Base UI Dialog + wiring) | integration (RTL) | `npx vitest run src/__tests__/components/project-popout.test.tsx` | ❌ W0 |
| R-30 | 4 | Reduced-motion short-circuit: animated components render final state under `matchMedia` reduce | unit (RTL) | `npx vitest run src/__tests__/components/reduced-motion.test.tsx` | ❌ W0 |
| R-13 / R-22 / R-23 | 3 | One-page composition; panels animate on scroll; pop-out scrolls | manual / visual | Vercel preview + manual QA | manual |
| R-18 / R-19 | 4 | Full-bleed grid; idle-clear heat | manual / visual | local + preview | manual |
| R-24 | 3 | Video autoplay on scroll / pause out of view / poster fallback | manual / visual | preview (real browser autoplay policy) | manual |
| R-21 / R-21a / R-21b | 2 | Retargeted hero/about copy; generic employer; softened framing; public contact | manual / review | content review against REDESIGN-SPEC §4.2 | manual |
| R-29 | 2 | Inline resume; current role; rebuilt projects subsection; PDF download | manual / review | manual QA + link check | manual |
| R-31 | 5 | build + lint + Lighthouse gate | gate | `npm run build && npm run lint`; Lighthouse in preview | manual for Lighthouse |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install` — no `node_modules`; hard prerequisite for every command in this file.
- [ ] Add `IntersectionObserver` stub (and optionally `HTMLMediaElement.prototype.play/pause`) to `src/__tests__/setup.ts` — jsdom lacks both.
- [ ] `src/__tests__/lib/redirects.test.ts` — imports `nextConfig.redirects()` and asserts the six-entry table (R-16).
- [ ] `src/__tests__/data/projects.test.ts` — validates the new model + featured set (R-26, R-25).
- [ ] `src/__tests__/lib/em-dash.test.ts` — enforces R-20 over data exports.
- [ ] `src/__tests__/components/reduced-motion.test.tsx` — R-30 (reuse the `matchMedia` mock pattern from the soon-deleted `ArchitectureTab.test.tsx`).
- [ ] `src/__tests__/hooks/use-scrollspy.test.ts` — mock `IntersectionObserver` (R-14).
- [ ] `src/__tests__/components/project-popout.test.tsx` — dialog open / ESC / focus-return (R-27).
- [ ] `src/__tests__/components/harness.test.tsx` — six pillars (R-28).
- [ ] Extend `src/__tests__/lib/analytics.test.ts` for `section_view` (R-17).
- [ ] DELETE `src/__tests__/components/HarnessTabs.test.tsx` and `src/__tests__/components/ArchitectureTab.test.tsx` — they import removed modules and WILL break (R-28).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Project panel scroll-entrance + pop-out feel | R-13, R-22, R-23 | GSAP/Lenis timing not jsdom-testable | Vercel preview: scroll through panels, open/close pop-out, verify entrance timing and scroll-driven demo sections |
| Full-bleed grid + idle-clear heat | R-18, R-19 | Canvas rAF + pointer behavior | Local + preview: move/stop pointer; heat must clear promptly at rest, re-ignite on move; grid spans full viewport width |
| Video autoplay / pause / poster | R-24 | Real browser autoplay policy | Preview: scroll demo into/out of view; muted clip plays/pauses; reduced-motion shows poster, no autoplay |
| Copy / tone / privacy | R-21, R-21a, R-21b | Editorial judgement | Review against REDESIGN-SPEC §4.2 verbatim; confirm generic employer, softened framing, public contact only |
| Lighthouse perf ≥ 95 / a11y = 100 | R-31 | Lab metric | Run Lighthouse on Vercel preview (mobile + desktop) |
| All six redirects land on the right section | R-16 | Hash navigation needs a real browser | Preview: hit each legacy URL, confirm 301/308 + lands on correct section via `?s=` client scroll |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
