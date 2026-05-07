import type { HookEvent, HookOwner } from '@/data/harness';

interface HooksTimelineProps {
  events: HookEvent[];
}

const OWNER_LABEL: Record<HookOwner, string> = {
  'claude-mem': 'cm',
  gsd: 'gsd',
  'context-mode': 'ctx',
};

// Pure-CSS lifecycle timeline. Horizontal track ≥ md; stacks vertically below.
// No client JS, no animation — the component is informational, not interactive.
export function HooksTimeline({ events }: HooksTimelineProps) {
  return (
    <ol
      role="list"
      aria-label="Hook lifecycle"
      className="grid gap-8 md:grid-cols-7 md:gap-2 md:items-start md:relative"
    >
      {/* Hairline track (desktop only) */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute top-[1.125rem] left-2 right-2 h-px bg-hairline"
      />

      {events.map((event, idx) => (
        <li
          key={event.name}
          className="relative md:flex md:flex-col md:items-start md:gap-3"
        >
          {/* Marker dot — sits on the track (desktop) or beside the label (mobile) */}
          <span
            aria-hidden="true"
            className="block w-2.5 h-2.5 rounded-full bg-background border border-foreground md:relative md:z-10"
          />

          <div className="md:mt-1">
            <p className="font-mono text-xs font-semibold text-foreground tracking-tight">
              {event.name}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-1">
              {event.scriptCount} script{event.scriptCount === 1 ? '' : 's'}
              {idx < events.length - 1 ? ' · ' : ''}
              <span className="text-muted-foreground">
                {event.owners.map((o) => OWNER_LABEL[o]).join(' · ')}
              </span>
            </p>
            <p className="text-xs text-foreground/75 mt-2 max-w-[28ch] leading-snug">
              {event.oneLiner}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
