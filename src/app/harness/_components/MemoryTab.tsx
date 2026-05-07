import type { InventoryRow } from '@/data/harness';
import { InventoryTable } from './InventoryTable';

interface MemoryRow {
  label: string;
  value: string;
  mono?: boolean;
}

interface MemoryCardData {
  name: string;
  tagline: string;
  path: string;
  rows: MemoryRow[];
}

const CLAUDE_MEM: MemoryCardData = {
  name: 'claude-mem',
  tagline: 'Hook-driven, automatic',
  path: '~/.claude/plugins/claude-mem/',
  rows: [
    { label: 'Type', value: 'Hook-driven, automatic' },
    { label: 'Storage', value: 'SQLite + WAL, FTS5 keyword index, Chroma vectors' },
    { label: 'Captures', value: 'Tool calls, prompts, summaries — every turn' },
    {
      label: 'Lifecycle',
      value: 'SessionStart → init → observation → summarize → SessionEnd',
    },
    {
      label: 'Retrieval',
      value: 'Auto-injected at SessionStart + UserPromptSubmit',
    },
    { label: 'Skill', value: 'mem-search (when explicit recall is needed)' },
    { label: 'Dashboard', value: 'localhost:37778', mono: true },
  ],
};

const AUTO_MEMORY: MemoryCardData = {
  name: 'Auto-memory',
  tagline: 'File-based, model-curated',
  path: '~/.claude/projects/<dir>/memory/',
  rows: [
    { label: 'Type', value: 'File-based, model-curated' },
    { label: 'Storage', value: 'Markdown files with frontmatter' },
    {
      label: 'Captures',
      value: 'Slow-decaying facts: user role, feedback rules, project state, references',
    },
    { label: 'Format', value: 'user / feedback / project / reference types' },
    { label: 'Index', value: 'MEMORY.md', mono: true },
    { label: 'Loaded at', value: 'Session start (top of system prompt)' },
    { label: 'Current entries', value: '15 memories' },
  ],
};

interface MemoryTabProps {
  inventory: InventoryRow[];
}

export function MemoryTab({ inventory }: MemoryTabProps) {
  return (
    <div>
      <header className="mb-10">
        <h2 className="mb-3">Two systems. One automatic, one curated.</h2>
        <p className="prose-body text-foreground/85 mt-3">
          claude-mem watches everything via hooks; auto-memory holds the
          slow-decaying truths. Different cadences, different jobs.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <MemoryCard data={CLAUDE_MEM} />
        <MemoryCard data={AUTO_MEMORY} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Callout title="Trust SessionStart over re-reading">
          CLAUDE.md doctrine: rely on the claude-mem context summary instead of
          re-grepping past code. Memory is a snapshot, not live truth — verify
          before instructing on it.
        </Callout>
        <Callout title="What goes in auto-memory vs not">
          YES: user role, validated approaches, project deadlines, external
          references. NO: code patterns, git history, fix recipes, task-level
          state. Those are derivable.
        </Callout>
      </div>

      {/* Localhost inventory — relocated here per locked decision 9.
          The 37778 worker IS this layer's dashboard; the 8765 Atlas is the
          predecessor visualization; the 37777 zombie is a memory-port
          artifact. All three belong with the memory subsystem. */}
      <section className="mt-10 border border-hairline rounded-md p-6 bg-background">
        <header className="flex items-baseline justify-between mb-4">
          <h3 className="font-sans text-base font-semibold text-foreground inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-crimson" />
            Localhost inventory
          </h3>
          <span className="font-mono text-[11px] text-muted-foreground">
            3 ports
          </span>
        </header>
        <p className="text-sm text-muted-foreground mb-4">
          Loopback-only. No inbound network access required.
        </p>
        <InventoryTable rows={inventory} />
        <p className="font-mono text-[11px] text-muted-foreground mt-4 leading-relaxed">
          Captured 2026-05-07. Other listeners on the box (Bonjour, Steam,
          Superhuman) are not part of the harness.
        </p>
      </section>
    </div>
  );
}

interface MemoryCardProps {
  data: MemoryCardData;
}

function MemoryCard({ data }: MemoryCardProps) {
  return (
    <article className="border border-hairline rounded-md p-6 bg-background">
      <header className="mb-4">
        <h3 className="font-sans text-lg font-semibold text-foreground inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-crimson" />
          {data.name}
        </h3>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          {data.tagline}
        </p>
        <p className="font-mono text-[11px] text-foreground/80 mt-2 break-all">
          {data.path}
        </p>
      </header>

      <dl className="space-y-3 border-t border-hairline pt-4">
        {data.rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[110px_1fr] gap-x-4 items-baseline"
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {row.label}
            </dt>
            <dd
              className={`text-sm text-foreground/90 ${row.mono ? 'font-mono text-[12px]' : ''}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

interface CalloutProps {
  title: string;
  children: React.ReactNode;
}

function Callout({ title, children }: CalloutProps) {
  return (
    <div className="border border-hairline rounded-md p-5 bg-surface/40">
      <h4 className="font-sans text-sm font-semibold text-foreground inline-flex items-center gap-2 mb-2">
        <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-crimson" />
        {title}
      </h4>
      <p className="text-[13px] text-foreground/85 leading-relaxed">
        {children}
      </p>
    </div>
  );
}
