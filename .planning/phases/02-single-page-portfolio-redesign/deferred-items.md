# Deferred Items — Phase 02 Single-Page Portfolio Redesign

Out-of-scope discoveries logged during plan execution. Do NOT fix in the discovering plan; route to the owning wave.

## Discovered during 02-01 (Wave 0 install + scaffold)

### Pre-existing lint baseline is RED (blocks Task 1 acceptance "npm run lint exits 0")

`npm install` succeeded and `npm run build` + `npx vitest run` are both green, but the
freshly-runnable linter (`eslint-config-next@16.2.2`, the version already pinned in the
committed lockfile) surfaces 5 errors + 3 warnings in code this plan does NOT modify.
These patterns predate this plan; they were simply unobservable because `node_modules`
was absent and lint could not run. None of these files are in 02-01's `files_modified`.

| Severity | File:Line | Rule | Note |
|----------|-----------|------|------|
| ERROR | `src/components/fx/cursor-spotlight.tsx:23` | `react-hooks/set-state-in-effect` | `setEnabled(true)` synchronously in effect |
| ERROR | `src/components/fx/hero-loader.tsx:52` | `react-hooks/set-state-in-effect` | `setShow(false)` synchronously in effect |
| ERROR | `src/components/fx/loadup-sequence.tsx:31` | `react-hooks/set-state-in-effect` | `setShow(false)` synchronously in effect |
| ERROR | `src/components/sections/hero.tsx:56` | `react-hooks/set-state-in-effect` | `setPlay(true)` synchronously in effect |
| ERROR | `src/hooks/use-analytics.ts:19` | `react-hooks/immutability` | `sendEvent` called before its `useCallback` declaration |
| warn | `src/__tests__/lib/session.test.ts:1` | `@typescript-eslint/no-unused-vars` | unused `vi` import |
| warn | `src/hooks/use-analytics.ts:21` | `react-hooks/exhaustive-deps` | effect missing `sendEvent` dep |
| warn | `src/hooks/use-typing-animation.ts:3` | `@typescript-eslint/no-unused-vars` | unused `useCallback` import |

**Routing:** R-31 (build + tests + lint gate, Wave 5 / Polish) is the natural owner.
`hero.tsx` and `use-analytics.ts` are already slated for modification in later waves
(02-03 retargets the hero TAGLINE; analytics gets `trackSectionView` in Wave 2), so those
two can be cleaned as part of that work. `cursor-spotlight.tsx`, `hero-loader.tsx`, and
`loadup-sequence.tsx` are NOT otherwise touched by the phase and need an explicit cleanup
task in the Polish wave.

**Why deferred and not auto-fixed in 02-01:** Out of scope (files not in this plan's
`files_modified`); fixes are behavior-affecting refactors of the boot/loader sequence and
analytics firing order, which is a Rule 4 / Polish-wave concern, not a Wave 0 install
concern. The plan's Task 1 instruction is explicit: "If any baseline command fails for a
reason unrelated to the absent install, stop and report rather than editing source."
