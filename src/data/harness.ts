// Source: discovery pass 2026-05-07.
// `hookEvents` and per-event scriptCount were sourced from
// ~/.claude/settings.json `hooks` block at task time, not authoring memory.
// `layers` is a snapshot of the harness as of the migration to AppData\Local.
// Keep this file in sync with the harness when the underlying stack changes.

export type LayerSubsystem =
  | 'workflow'
  | 'memory'
  | 'context'
  | 'skills'
  | 'plugins'
  | 'hooks'
  | 'mcp'
  | 'storage'
  | 'host';

export interface HarnessLayer {
  id: string;
  index: number;
  name: string;
  oneLiner: string;
  /** 2–3 sentence detail surfaced when the layer is expanded in the Architecture tab. */
  description: string;
  /** File paths or globs that physically house this layer. Mono-rendered. */
  files: string[];
  /** IDs of other layers this one talks to. Renders as a "Related" pill list. */
  related: string[];
  badges: string[];
  subsystem: LayerSubsystem;
}

export const layers: HarnessLayer[] = [
  {
    id: 'host',
    index: 1,
    name: 'CLI host',
    oneLiner:
      'Claude Code itself — the terminal harness that loads system prompts, dispatches tools, and brokers every other layer.',
    description:
      'Reads ~/.claude/settings.json on launch, mounts the model (Opus 4.7 / Sonnet 4.6 / Haiku 4.5), and owns the conversation loop and the context window. Every other layer attaches via tools, hooks, plugins, or skills — none of them run without the host.',
    files: ['~/.claude/settings.json', '~/.claude/CLAUDE.md', '~/.claude/rules/'],
    related: ['workflow', 'hook-pipeline', 'skill-packs'],
    badges: ['Claude Code', 'Opus 4.7', 'Sonnet 4.6'],
    subsystem: 'host',
  },
  {
    id: 'workflow',
    index: 2,
    name: 'Workflow',
    oneLiner:
      'Spec-driven phase orchestration. Drafts a plan, verifies it, executes atomically, and validates against the goal.',
    description:
      'GSD wraps every non-trivial task in phases that produce markdown artifacts (SPEC, DISCUSS, PLAN, EXECUTE, VERIFICATION, SHIP). Each phase persists state to .planning/phases/<n>/, so a context reset reloads cleanly. Atomic per-task commits keep the diff reviewable.',
    files: ['~/.claude/get-shit-done/', '.planning/phases/<n>/PLAN.md', '.planning/phases/<n>/VERIFICATION.md'],
    related: ['host', 'storage', 'skill-packs'],
    badges: ['GSD', '/gsd-* commands', 'PLAN.md / VERIFICATION.md'],
    subsystem: 'workflow',
  },
  {
    id: 'persistent-memory',
    index: 3,
    name: 'Persistent memory',
    oneLiner:
      'Claude-mem: auto-records every tool call and turn summary, then injects a session index at SessionStart so prior decisions survive restarts.',
    description:
      'A bun worker on localhost:37778 captures observations via the hook pipeline, indexes them in SQLite + FTS5, and exposes a web dashboard. At SessionStart it injects a compact recent-context summary into the system prompt — the model reads "what we did last time" instead of paying tokens to re-discover.',
    files: ['~/AppData/Local/claude-mem/', '~/.claude/plugins/claude-mem/', 'localhost:37778/health'],
    related: ['hook-pipeline', 'storage', 'auto-memory'],
    badges: ['claude-mem', 'bun', 'localhost:37778'],
    subsystem: 'memory',
  },
  {
    id: 'auto-memory',
    index: 4,
    name: 'Auto-memory',
    oneLiner:
      'Curated markdown facts — user role, feedback rules, project state, references. Slow-decaying signal; the part of memory I edit by hand.',
    description:
      'Lives in flat markdown files indexed by MEMORY.md and loaded into the system prompt at session start. Holds the deliberate, durable facts: user profile, validated approaches, project deadlines, external pointers. Reviewable in git diffs, unlike the auto-captured persistent-memory store.',
    files: ['~/.claude/projects/<dir>/memory/MEMORY.md', 'user_*.md, feedback_*.md, project_*.md, reference_*.md'],
    related: ['persistent-memory', 'host'],
    badges: ['~/.claude/projects/.../memory/', 'MEMORY.md'],
    subsystem: 'memory',
  },
  {
    id: 'context-discipline',
    index: 5,
    name: 'Context discipline',
    oneLiner:
      'Context-mode runs commands in a sandboxed subprocess, indexes the output in FTS5, and surfaces only the printed summary to the model.',
    description:
      'Bash output, MCP responses, and large file reads route through ctx_execute / ctx_execute_file / ctx_batch_execute. The full output is stored in a per-session SQLite DB; only the explicitly printed summary lines enter the conversation context. The PreToolUse hook reminds the model to use it.',
    files: ['~/.claude/plugins/cache/mksglu__context-mode/', 'pretooluse.mjs', '~/.context-mode/'],
    related: ['hook-pipeline', 'storage', 'host'],
    badges: ['context-mode', 'FTS5', 'BM25'],
    subsystem: 'context',
  },
  {
    id: 'skill-packs',
    index: 6,
    name: 'Skill packs',
    oneLiner:
      'Always-on skills inject domain expertise; vaulted skills load on demand. Behavior shaping through markdown, not config.',
    description:
      '71 always-on skills (superpowers, GSD core, frontend-design, etc.) feed their frontmatter descriptions into every system prompt. 94 vaulted skills sit at ~/.claude/skill-vault/ and load only when grep-looked-up via SKILL-INDEX.md — saves ~5K tokens of session-start description bloat.',
    files: ['~/.claude/skills/', '~/.claude/skill-vault/', '~/.claude/SKILL-INDEX.md'],
    related: ['host', 'plugins'],
    badges: ['superpowers', 'frontend-design', 'SKILL-INDEX.md'],
    subsystem: 'skills',
  },
  {
    id: 'plugins',
    index: 7,
    name: 'Plugins',
    oneLiner:
      'Marketplace MCP integrations — design tools, infra control planes, browser automation, ticketing.',
    description:
      'Marketplaces are git repos; plugins are namespaced subfolders. Each plugin can ship skills, commands, agents, and MCP servers. Cached at ~/.claude/plugins/cache/, registered in installed_plugins.json, toggled via enabledPlugins. 16 plugins enabled today across four marketplaces.',
    files: ['~/.claude/plugins/installed_plugins.json', '~/.claude/plugins/cache/<marketplace>/<plugin>/<v>/'],
    related: ['mcp-servers', 'skill-packs', 'host'],
    badges: ['figma', 'supabase', 'vercel', 'playwright', 'hookify', 'commit-commands'],
    subsystem: 'plugins',
  },
  {
    id: 'hook-pipeline',
    index: 8,
    name: 'Hook pipeline',
    oneLiner:
      'Lifecycle scripts fired by Claude Code at deterministic points — observation capture, context guidance, gate enforcement.',
    description:
      '22 scripts wired across 7 events (SessionStart / UserPromptSubmit / PreToolUse / PostToolUse / PreCompact / Stop / SessionEnd). Scripts can validate (block the call), inject context (modify the prompt), or just observe (write to memory). Three owners share the surface: claude-mem, GSD, context-mode.',
    files: ['~/.claude/settings.json (hooks block)', '~/.claude/plugins/claude-mem/hooks/', '~/.claude/get-shit-done/hooks/'],
    related: ['persistent-memory', 'context-discipline', 'workflow', 'host'],
    badges: ['7 events', '22 scripts', 'PreToolUse → SessionEnd'],
    subsystem: 'hooks',
  },
  {
    id: 'mcp-servers',
    index: 9,
    name: 'MCP servers',
    oneLiner:
      'Stdio-based servers spawned per session by the plugin loader. Provide tool surfaces for the model that wouldn’t fit in the prompt.',
    description:
      'Each plugin can boot one or more MCP servers as stdio subprocesses. Tools from each server appear in the model\'s tool list namespaced by plugin. Heavy hitters: Supabase (10 tools), Vercel (deploy/logs/projects), Figma (canvas write), Linear, Playwright, Context7, plus claude.ai cloud (Gmail / Calendar / Drive / 365).',
    files: ['<plugin>/.mcp.json', 'spawned at SessionStart per enabledPlugins'],
    related: ['plugins', 'host'],
    badges: ['15+ servers', 'stdio', 'per-plugin namespace'],
    subsystem: 'mcp',
  },
  {
    id: 'storage',
    index: 10,
    name: 'Storage',
    oneLiner:
      'SQLite with WAL for the observation log, FTS5 for keyword retrieval, Chroma for vector retrieval. All on LocalAppData, never synced.',
    description:
      'The persistent backbone. SQLite + WAL holds observations; FTS5 is the BM25 keyword index; Chroma is the vector index. After the OneDrive corruption pattern, all of it lives in %LOCALAPPDATA%\\claude-mem\\ — explicitly outside any cloud-synced folder.',
    files: ['%LOCALAPPDATA%\\claude-mem\\claude-mem.db', '%LOCALAPPDATA%\\claude-mem\\chroma\\'],
    related: ['persistent-memory', 'context-discipline', 'auto-memory'],
    badges: ['SQLite + WAL', 'FTS5', 'Chroma', '%LOCALAPPDATA%'],
    subsystem: 'storage',
  },
];

export type InventoryStatus = 'active' | 'zombie' | 'on-demand';

export interface InventoryRow {
  port: string;
  service: string;
  owner: string;
  status: InventoryStatus;
  purpose: string;
}

export const inventory: InventoryRow[] = [
  {
    port: '127.0.0.1:37778',
    service: 'claude-mem worker + memory dashboard',
    owner: 'bun.exe (PID 65800)',
    status: 'active',
    purpose:
      'Persistent memory, observation capture, web dashboard. SessionStart hook starts the worker; the page at / renders the dashboard.',
  },
  {
    port: '127.0.0.1:37777',
    service: 'claude-mem (phantom reservation)',
    owner: 'unkillable PID 10640',
    status: 'zombie',
    purpose:
      'Original claude-mem port. Held by an orphaned WSL/Hyper-V handle that taskkill cannot release. Worker rebound to 37778 via env.',
  },
  {
    port: '127.0.0.1:8765',
    service: "Harness Atlas (this page's grandparent)",
    owner: 'python.exe (on demand)',
    status: 'on-demand',
    purpose:
      'A self-contained interactive architecture diagram served by `python -m http.server 8765` from harness-diagram/. The visual draft this page is built on top of.',
  },
];

export type HookOwner = 'claude-mem' | 'gsd' | 'context-mode';

export interface HookEvent {
  name: string;
  oneLiner: string;
  owners: HookOwner[];
  scriptCount: number;
}

// Lifecycle order: SessionStart fires once per Claude Code launch; UserPromptSubmit
// fires before each user turn; PreToolUse / PostToolUse wrap every tool call;
// PreCompact fires before context compaction; Stop fires when a turn ends; SessionEnd
// fires when the session terminates.
export const hookEvents: HookEvent[] = [
  {
    name: 'SessionStart',
    oneLiner:
      'Boots claude-mem, heals the context-mode plugin cache, and injects the recent-context summary into the system prompt.',
    owners: ['claude-mem', 'gsd', 'context-mode'],
    scriptCount: 7,
  },
  {
    name: 'UserPromptSubmit',
    oneLiner:
      'Pre-processes each user prompt — claude-mem records it; context-mode optionally rewrites it.',
    owners: ['claude-mem', 'context-mode'],
    scriptCount: 2,
  },
  {
    name: 'PreToolUse',
    oneLiner:
      'Gate before any tool runs. Context guidance for Bash, GSD policy enforcement, and tool-routing reminders.',
    owners: ['gsd', 'context-mode'],
    scriptCount: 5,
  },
  {
    name: 'PostToolUse',
    oneLiner:
      'Records each tool call into claude-mem; GSD progress monitor; context-mode auto-indexing.',
    owners: ['claude-mem', 'gsd', 'context-mode'],
    scriptCount: 5,
  },
  {
    name: 'PreCompact',
    oneLiner:
      'Fires before context compaction. Used by context-mode to preserve indexed knowledge across the compact boundary.',
    owners: ['context-mode'],
    scriptCount: 1,
  },
  {
    name: 'Stop',
    oneLiner: 'End-of-turn observation flush by claude-mem.',
    owners: ['claude-mem'],
    scriptCount: 1,
  },
  {
    name: 'SessionEnd',
    oneLiner:
      'Final session summary written to the claude-mem timeline before shutdown.',
    owners: ['claude-mem'],
    scriptCount: 1,
  },
];

export interface Colophon {
  capturedOn: string;
  stack: string[];
  pageStack: string[];
  dashboardUrl: string;
  atlasUrl: string;
}

export const colophon: Colophon = {
  capturedOn: '2026-05-07',
  stack: ['Node 22', 'Bun 1.3', 'Python (Chroma)', 'PowerShell + Bash'],
  pageStack: [
    'Next.js 16.2.2',
    'React 19.2',
    'Tailwind v4',
    'Motion 12.38',
    'TypeScript 5',
  ],
  dashboardUrl: 'http://localhost:37778',
  atlasUrl: 'http://localhost:8765',
};

// Hero stat strip — six numbers that size the harness in one glance.
// Values are sourced from the live snapshot of the harness as of capturedOn.
export interface HarnessStat {
  value: string;
  label: string;
}

// Skills Map data — sourced from ~/.claude/skills/ (always-on) and
// ~/.claude/skill-vault/ (on-demand). Counts are static snapshots.
export interface SkillPack {
  id: string;
  name: string;
  count: string;
  description: string;
  examples: string[];
}

export const alwaysOnPacks: SkillPack[] = [
  {
    id: 'superpowers',
    name: 'Superpowers',
    count: '14',
    description:
      'TDD-first workflow + collaboration. Auto-trigger before code, before fixes, before claims of "done".',
    examples: [
      'brainstorming',
      'test-driven-development',
      'systematic-debugging',
      'writing-plans',
      'executing-plans',
      'verification-before-completion',
    ],
  },
  {
    id: 'gsd-core',
    name: 'GSD core',
    count: '13',
    description:
      'Phase-driven workflow daily driver. Discuss → plan → execute → verify → ship.',
    examples: [
      'gsd-progress',
      'gsd-plan-phase',
      'gsd-discuss-phase',
      'gsd-execute-phase',
      'gsd-debug',
      'gsd-resume-work',
    ],
  },
  {
    id: 'context-mode',
    name: 'Context-mode',
    count: '1',
    description:
      'Doctrine skill: route large outputs through ctx_execute sandbox. Admin tools (ctx-doctor, ctx-stats) vaulted.',
    examples: ['context-mode'],
  },
  {
    id: 'continuous-learning',
    name: 'Continuous learning',
    count: '2',
    description:
      'v2.1 auto-detects current project via git remote, scopes instincts per repo. Universal patterns auto-promote.',
    examples: ['continuous-learning-v2', 'continuous-learning'],
  },
  {
    id: 'general',
    name: 'General quality + design + meta',
    count: '~41',
    description:
      'TDD trio (tdd, tdd-workflow, tdd-guide), diagnose, verification-loop, coding-standards, backend/frontend-patterns, taste-skill, soft-skill, ui-ux-pro-max, design-forge, eval-harness, learn, evolve…',
    examples: [],
  },
];

export interface VaultCategory {
  path: string;
  count: string;
  examples: string;
}

export const vaultCategories: VaultCategory[] = [
  {
    path: 'languages/',
    count: '30',
    examples: 'rust-*, golang-*, kotlin-*, springboot-*, django-*, laravel-*, python-*, perl-*, c++/cmake, postgres, clickhouse',
  },
  {
    path: 'gsd-admin/',
    count: '52',
    examples: 'audits, codebase mapping, cleanup, ingest-docs, milestone admin, ns aliases, plan variants, workstream/thread mgmt',
  },
  {
    path: 'design-content/',
    count: '6',
    examples: 'brand, banner-design, design (omnibus), design-system, slides, frontend-slides',
  },
  {
    path: 'admin-utilities/',
    count: '6',
    examples: 'ctx-doctor, ctx-insight, ctx-purge, ctx-stats, ctx-upgrade, context-mode-ops',
  },
];

// Plugins & MCP — sourced from ~/.claude/plugins/installed_plugins.json
// (4 marketplaces, 16 plugins enabled). MCP servers are stdio surfaces
// each plugin can boot.
export interface PluginEntry {
  name: string;
  version: string;
}

export interface MarketplaceEntry {
  source: string;
  title: string;
  plugins: PluginEntry[];
  note?: string;
}

export const marketplaces: MarketplaceEntry[] = [
  {
    source: 'github: anthropics/claude-plugins-official',
    title: 'Official marketplace',
    plugins: [
      { name: 'playwright', version: 'unknown' },
      { name: 'figma', version: '2.1.30' },
      { name: 'context7', version: 'unknown' },
      { name: 'security-guidance', version: 'unknown' },
      { name: 'linear', version: 'unknown' },
      { name: 'github', version: 'unknown' },
      { name: 'supabase', version: '0.1.6' },
      { name: 'frontend-design', version: 'unknown' },
      { name: 'vercel', version: '0.42.1' },
    ],
  },
  {
    source: 'github: anthropics/claude-code',
    title: 'Code marketplace',
    plugins: [
      { name: 'commit-commands', version: '1.0.0' },
      { name: 'code-review', version: '1.0.0' },
      { name: 'feature-dev', version: '1.0.0' },
      { name: 'hookify', version: '0.1.0' },
      { name: 'security-guidance', version: '1.0.0' },
    ],
  },
  {
    source: 'github: obra/superpowers',
    title: 'Superpowers',
    plugins: [{ name: 'superpowers', version: '5.1.0' }],
    note:
      'Superpowers ships skills via plugin layout but they are also copied into ~/.claude/skills/ so they appear in the active skill registry. Without that copy step they showed as installed but never auto-triggered.',
  },
  {
    source: 'github: mksglu/context-mode',
    title: 'Context-mode',
    plugins: [{ name: 'context-mode', version: '1.0.111' }],
  },
];

export interface McpServerEntry {
  name: string;
  scope: string;
}

export const mcpServers: McpServerEntry[] = [
  { name: 'Supabase', scope: '10 tools' },
  { name: 'Vercel', scope: 'deploy / logs / projects' },
  { name: 'Figma', scope: 'canvas write' },
  { name: 'Linear', scope: 'issues + projects' },
  { name: 'Playwright', scope: 'browser' },
  { name: 'Context7', scope: 'live docs' },
  { name: 'claude.ai cloud', scope: 'Gmail / Calendar / Drive / Microsoft 365' },
];

export const stats: HarnessStat[] = [
  { value: '10', label: 'Layers' },
  { value: '7', label: 'Hook events' },
  { value: '22', label: 'Hook scripts' },
  { value: '15+', label: 'MCP + plugins' },
  { value: '3', label: 'Ports' },
  { value: '6', label: 'GSD phases' },
];
