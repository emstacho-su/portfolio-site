# Phase 1 Context — Harness Page

**Captured:** 2026-05-07
**Source:** Direct discussion with the project owner (no `/gsd-discuss-phase` was run; user provided locked decisions inline).

---

<decisions>

## D-01 — Page direction

**Decision:** Atlas-as-essay. Single full-bleed paper-themed architecture diagram dominates Act 1; editorial longform with hairline-rule chapters fills Act 2.
**Rationale:** Other directions either underused the visual asset (Direction 1, pure editorial) or over-indexed on dashboard density at the expense of narrative arc (Direction 2, full Atlas port). Direction 3 balances "show-don't-tell" (the diagram) with "tell-don't-just-show" (debugging and migration prose recruiters actually retain).

## D-02 — Live-data strip

**Decision:** Drop. No live or snapshot strip in §2.
**Rationale:** Recruiter machines can't reach `127.0.0.1:37778`. The localhost inventory table already conveys the data. Adding decorative HTML for a faux-live strip is gimmicky; honesty (a static table) is better.

## D-03 — Diagram color treatment

**Decision:** Monochrome + crimson. Crimson is the only accent (hover/active states); subsystems share the editorial paper monochrome, with their identity carried by typography (mono badges) and position, not color.
**Rationale:** The Atlas's six-hue subsystem palette (orange/blue/purple/green/red/yellow on dark) clashes with editorial paper. A direct port would feel like dashboard pasted into magazine. Monochrome holds the editorial register the rest of the portfolio is in.

## D-04 — Route name

**Decision:** `/harness`. Single-word, top-level. Not `/field-notes/harness` or `/writing/harness`.
**Rationale:** No series planned. Path can be re-nested later if a series materializes. Cleanest URL today.

## D-05 — Nav label

**Decision:** `Harness`. Replaces `Toolkit` in the navbar.
**Rationale:** Matches the route. No redirect-and-rename ambiguity.

## D-06 — `/toolkit` fate

**Decision:** Delete `src/app/toolkit/page.tsx` and add a permanent (`permanent: true`) `redirects()` entry in `next.config.ts` mapping `/toolkit → /harness`.
**Rationale:** Existing `/toolkit` is a placeholder; no content worth preserving. 301 redirect is cheap insurance against external links and bookmarks.

## D-07 — Diagram component reuse

**Decision:** Port the IA + SVG/CSS structure of `C:\Users\estac\harness-diagram\index.html` to a React client island. Re-theme to paper+crimson; do not rebuild from scratch.
**Rationale:** Atlas already encodes the right data shape and hierarchy. Rebuilding loses both. The dark→light retheme is a modest CSS pass over an already-vetted IA.

## D-08 — Design references

**Decision:** Stripe Press × Linear changelog × Vercel docs. Pull palettes/typography from `awesome-design-md`. Apply via `taste-skill` + `soft-skill` patterns.
**Rationale:** Editorial-tech registers that already match the portfolio's existing aesthetic and the IMT/process/AI positioning of the page's content.

## D-09 — Out-of-scope reaffirmation

**Decision:** This phase explicitly excludes: Hardware/Daily Drivers/Writing surfaces from original `/toolkit` plan; live data fetching; changes to `/projects`, `/about`, or `/resume`; Phase 4 (projects MDX); any `/field-notes/*` series scaffolding.

</decisions>

---

## Stack constraints (verify, do not assume)

- **Next.js 16.2.2** App Router. Async params, `generateMetadata`, `template.tsx` already used elsewhere — match those patterns. Consult `node_modules/next/dist/docs/` for any uncertain pattern.
- **Tailwind v4** with `@theme inline` in `src/app/globals.css`. NO `tailwind.config.ts`. New tokens land in globals.css only.
- **Motion 12.38** (the unified library, not framer-motion).
- **shadcn/base-ui** components.json already configured.
- **Lenis smooth scroll** gated on `BootProvider` — diagram must lazy-mount only after `bootReady`.
- **Vitest** 4.1 — existing tests live in `src/__tests__/`. New tests follow that pattern.

## Existing aesthetic to honor

Already in `src/app/globals.css` — do not re-define:

- Palette: `--bg-base #EFEBE3`, `--bg-surface #E6E2D9`, `--border-hairline #D8D3C8`, `--text-primary #1A1A1A`, `--text-secondary #5C5853`, `--text-tertiary #8A857D`, `--accent #D7263D`, `--accent-hover #B81E33`, `--accent-muted rgba(215,38,61,0.08)`.
- Typography: General Sans (Fontshare CDN) + JetBrains Mono (next/font/google).
- Type scale: h1 `clamp(3rem, 6vw, 5.5rem)` -0.02em / 700; h2 2.25rem -0.01em / 600; body 1.0625rem / 1.65.
- Body width utility: `.prose-body` (max-width 68ch).
- Already-built utilities to reuse: `.hairline-rule`, `.bg-hairline-grid` (64px), `.link-underline`, `.cursor-blink`.
- `prefers-reduced-motion` is honored globally — new animations must respect it.

## Source materials (read-only references for the executor)

| File | Purpose |
|------|---------|
| `C:\Users\estac\Downloads\HARNESS-LOCALHOST-INVENTORY.md` | §2 inventory table data + §6 colophon facts |
| `C:\Users\estac\harness-diagram\index.html` | Diagram IA + CSS/SVG structure to port (D-07) |
| `~/.claude/projects/C--Users-estac/memory/project_claude_mem_migration_2026-05-07.md` | §3 migration narrative |
| `~/.claude/projects/C--Users-estac/memory/reference_claude_mem_chroma_leak.md` | §4 chroma orphan bug arc |
| `~/.claude/CLAUDE.md` (Harness Architecture table) | §1 layer list + descriptions |
| `REDESIGN_ROADMAP.md` (repo root) | Existing redesign context — DO NOT touch except final note in commit 7 |
