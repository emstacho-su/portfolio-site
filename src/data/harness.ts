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
    badges: ['Claude Code', 'Opus 4.7', 'Sonnet 4.6'],
    subsystem: 'host',
  },
  {
    id: 'workflow',
    index: 2,
    name: 'Workflow',
    oneLiner:
      'Spec-driven phase orchestration. Drafts a plan, verifies it, executes atomically, and validates against the goal.',
    badges: ['GSD', '/gsd-* commands', 'PLAN.md / VERIFICATION.md'],
    subsystem: 'workflow',
  },
  {
    id: 'persistent-memory',
    index: 3,
    name: 'Persistent memory',
    oneLiner:
      'Claude-mem: auto-records every tool call and turn summary, then injects a session index at SessionStart so prior decisions survive restarts.',
    badges: ['claude-mem', 'bun', 'localhost:37778'],
    subsystem: 'memory',
  },
  {
    id: 'auto-memory',
    index: 4,
    name: 'Auto-memory',
    oneLiner:
      'Curated markdown facts — user role, feedback rules, project state, references. Slow-decaying signal; the part of memory I edit by hand.',
    badges: ['~/.claude/projects/.../memory/', 'MEMORY.md'],
    subsystem: 'memory',
  },
  {
    id: 'context-discipline',
    index: 5,
    name: 'Context discipline',
    oneLiner:
      'Context-mode runs commands in a sandboxed subprocess, indexes the output in FTS5, and surfaces only the printed summary to the model.',
    badges: ['context-mode', 'FTS5', 'BM25'],
    subsystem: 'context',
  },
  {
    id: 'skill-packs',
    index: 6,
    name: 'Skill packs',
    oneLiner:
      'Always-on skills inject domain expertise; vaulted skills load on demand. Behavior shaping through markdown, not config.',
    badges: ['superpowers', 'frontend-design', 'SKILL-INDEX.md'],
    subsystem: 'skills',
  },
  {
    id: 'plugins',
    index: 7,
    name: 'Plugins',
    oneLiner:
      'Marketplace MCP integrations — design tools, infra control planes, browser automation, ticketing.',
    badges: ['figma', 'supabase', 'vercel', 'playwright', 'hookify', 'commit-commands'],
    subsystem: 'plugins',
  },
  {
    id: 'hook-pipeline',
    index: 8,
    name: 'Hook pipeline',
    oneLiner:
      'Lifecycle scripts fired by Claude Code at deterministic points — observation capture, context guidance, gate enforcement.',
    badges: ['7 events', '22 scripts', 'PreToolUse → SessionEnd'],
    subsystem: 'hooks',
  },
  {
    id: 'mcp-servers',
    index: 9,
    name: 'MCP servers',
    oneLiner:
      'Stdio-based servers spawned per session by the plugin loader. Provide tool surfaces for the model that wouldn’t fit in the prompt.',
    badges: ['15+ servers', 'stdio', 'per-plugin namespace'],
    subsystem: 'mcp',
  },
  {
    id: 'storage',
    index: 10,
    name: 'Storage',
    oneLiner:
      'SQLite with WAL for the observation log, FTS5 for keyword retrieval, Chroma for vector retrieval. All on LocalAppData, never synced.',
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

export const stats: HarnessStat[] = [
  { value: '10', label: 'Layers' },
  { value: '7', label: 'Hook events' },
  { value: '22', label: 'Hook scripts' },
  { value: '15+', label: 'MCP + plugins' },
  { value: '3', label: 'Ports' },
  { value: '6', label: 'GSD phases' },
];
