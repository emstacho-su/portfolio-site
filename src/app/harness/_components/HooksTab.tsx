import type { HookEvent } from '@/data/harness';
import { HooksTimeline } from './HooksTimeline';

interface HooksTabProps {
  events: HookEvent[];
}

interface HookEventRow {
  name: HookEvent['name'];
  purpose: string;
  capability: string;
}

// Derived from Atlas's hooks table — describes what each event is FOR
// (purpose) and what scripts can DO with it (capability).
const EVENT_DETAILS: HookEventRow[] = [
  {
    name: 'SessionStart',
    purpose: 'Boot the memory worker, heal plugin caches, restore session state',
    capability: 'Inject system context into every prompt that follows',
  },
  {
    name: 'UserPromptSubmit',
    purpose: 'Index the prompt against memory; rewrite or augment it before the model sees it',
    capability: 'Augment prompt with retrieved memory or rewritten phrasing',
  },
  {
    name: 'PreToolUse',
    purpose: 'Validate the tool call against workflow rules; surface routing reminders',
    capability: 'BLOCK the call (non-zero exit) or pass through with guidance',
  },
  {
    name: 'PostToolUse',
    purpose: 'Record the call into memory; scan output for prompt injection; watch context size',
    capability: 'Trigger /save-session warnings; write structured observations',
  },
  {
    name: 'PreCompact',
    purpose: 'Preserve indexed knowledge across the compact boundary',
    capability: 'Persist/restore context-mode FTS5 state',
  },
  {
    name: 'Stop',
    purpose: 'End-of-turn observation flush',
    capability: 'Write a structured turn summary to claude-mem',
  },
  {
    name: 'SessionEnd',
    purpose: 'Finalize the session summary, flush worker',
    capability: 'Persist final state to disk',
  },
];

export function HooksTab({ events }: HooksTabProps) {
  return (
    <div>
      <header className="mb-10">
        <h2 className="mb-3">Seven lifecycle events. Twenty-two scripts.</h2>
        <p className="prose-body text-foreground/85 mt-3">
          Each event fires zero or more scripts in parallel — read left to right.
        </p>
        <p className="prose-body text-foreground/75 mt-4 italic leading-[1.7]">
          Hooks instead of in-prompt instructions because anything that has to
          happen every turn shouldn&apos;t compete with the model&apos;s
          attention. CLAUDE.md is for principles; hooks are for behaviors.
          Both invisible until they fire — but only one of them is deterministic.
        </p>
      </header>

      <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-3 border border-hairline rounded mb-8 font-mono text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-crimson" />
          claude-mem (memory observation + injection)
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-foreground" />
          GSD (workflow guards + state)
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full border border-foreground" />
          context-mode (sandboxed routing)
        </span>
      </div>

      <HooksTimeline events={events} />

      <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 mt-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground py-2 pr-4">
                Event
              </th>
              <th className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground py-2 pr-4">
                Purpose
              </th>
              <th className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground py-2 pr-4 hidden md:table-cell">
                What can it do?
              </th>
            </tr>
          </thead>
          <tbody>
            {EVENT_DETAILS.map((row) => (
              <tr
                key={row.name}
                className="border-b border-hairline last:border-b-0 align-top"
              >
                <td className="py-3 pr-4 text-sm font-mono text-foreground">
                  {row.name}
                </td>
                <td className="py-3 pr-4 text-sm text-foreground/85">
                  {row.purpose}
                </td>
                <td className="py-3 pr-4 text-sm text-foreground/80 hidden md:table-cell">
                  {row.capability}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
