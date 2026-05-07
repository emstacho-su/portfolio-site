# Requirements — Harness Page

| ID | Requirement | Source |
|----|-------------|--------|
| R-1 | A new route `/harness` exists under App Router and renders a Server-Component page. | User prompt |
| R-2 | Page documents the 10-layer Claude Code harness (workflow, persistent memory, auto-memory, context discipline, skill packs, plugins, hook pipeline, MCP servers, storage, CLI host) with name + 1-line purpose + tooling badges per layer. | User prompt |
| R-3 | Page includes the OneDrive → AppData migration narrative (corruption pattern, phantom port 37777, three-config-file fix). | Memory: `project_claude_mem_migration_2026-05-07.md` |
| R-4 | Page includes the chroma orphan reaping bug story (4-deep process chain, detection rule, upstream fix proposal). | Memory: `reference_claude_mem_chroma_leak.md` |
| R-5 | Page includes the localhost inventory table (37778 worker / 37777 phantom / 8765 Atlas) with status + owner-process columns. | `HARNESS-LOCALHOST-INVENTORY.md` |
| R-6 | An interactive architecture diagram acts as the page hero, ported from the IA + SVG/CSS structure of `harness-diagram/index.html`. | User prompt |
| R-7 | Diagram color treatment is monochrome + crimson — no 6-hue subsystem palette. Crimson is the only accent (active/hover states). | Locked decision |
| R-8 | The placeholder `/toolkit` page is deleted; navbar label updates to "Harness" pointing at `/harness`; a permanent 301 redirect exists from `/toolkit` to `/harness`. | Locked decision |
| R-9 | The page achieves Lighthouse perf ≥ 95 (mobile + desktop) and a11y = 100. | User prompt (constraint) |
| R-10 | The architecture diagram is keyboard-navigable: every layer reachable via Tab, has `aria-label`, and the active layer is announced via `aria-current`. | User prompt (a11y) |
| R-11 | All animations short-circuit under `prefers-reduced-motion`. | Existing portfolio convention + user prompt |
| R-12 | An OG image renders at `/harness/opengraph-image` matching the editorial paper + crimson aesthetic. | User prompt |
