import type { GsdPhase, GsdSituation } from '@/data/harness';

interface GsdTabProps {
  phases: GsdPhase[];
  situations: GsdSituation[];
}

export function GsdTab({ phases, situations }: GsdTabProps) {
  return (
    <div>
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
          06 / GSD Workflow
        </p>
        <h2 className="mb-3">Spec → Discuss → Plan → Execute → Verify → Ship.</h2>
        <p className="prose-body text-foreground/85 mt-3">
          Each phase produces a markdown artifact in{' '}
          <code className="font-mono text-sm">.planning/phases/&lt;n&gt;/</code>
          . Atomic commits per task. Checkpoints survive context resets — the
          phase manifest is reloaded on resume.
        </p>
      </header>

      <ol
        role="list"
        aria-label="GSD phases"
        className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {phases.map((phase, idx) => (
          <li
            key={phase.num}
            className="border border-hairline rounded-md p-5 bg-background relative"
          >
            <span
              aria-hidden="true"
              className="absolute top-5 right-5 font-mono text-[10px] text-muted-foreground"
            >
              {String(idx + 1).padStart(2, '0')}
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-2">
              {phase.num}
            </p>
            <h3 className="font-sans text-lg font-semibold text-foreground mb-3">
              {phase.name}
            </h3>
            <p className="font-mono text-[12px] text-crimson break-all mb-3">
              {phase.command}
            </p>
            <div className="border-t border-hairline pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                Output
              </p>
              <p className="font-mono text-[12px] text-foreground/85 break-all">
                {phase.output}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-10">
        <h3 className="font-sans text-base font-semibold text-foreground mb-4 inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-crimson" />
          Situational dispatch
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Pick the entry point that matches your situation, not the workflow
          you think you should follow.
        </p>
        <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline">
                <th className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground py-2 pr-4">
                  Situation
                </th>
                <th className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground py-2 pr-4">
                  Command
                </th>
                <th className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground py-2 pr-4 hidden md:table-cell">
                  Why
                </th>
              </tr>
            </thead>
            <tbody>
              {situations.map((s) => (
                <tr
                  key={s.command + s.situation}
                  className="border-b border-hairline last:border-b-0 align-top"
                >
                  <td className="py-3 pr-4 text-sm text-foreground">
                    {s.situation}
                  </td>
                  <td className="py-3 pr-4 text-sm font-mono text-crimson break-all">
                    {s.command}
                  </td>
                  <td className="py-3 pr-4 text-sm text-foreground/85 hidden md:table-cell">
                    {s.why}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 mt-10">
        <Callout title="GSD + superpowers stack cleanly">
          Inside a GSD execute phase, superpowers&apos;{' '}
          <code className="font-mono text-[12px]">test-driven-development</code>{' '}
          and{' '}
          <code className="font-mono text-[12px]">verification-before-completion</code>{' '}
          still auto-trigger. GSD owns the macro structure (phases, commits,
          verification reports). Superpowers owns the micro discipline (write
          tests first, watch them fail).
        </Callout>
        <Callout title="Memory is GSD's resilience layer">
          If the context window dies mid-phase, claude-mem has the recent
          observations and the phase manifest sits on disk.{' '}
          <code className="font-mono text-[12px]">/gsd-resume-work</code>{' '}
          rehydrates both.
        </Callout>
      </div>
    </div>
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
      <div className="text-[13px] text-foreground/85 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
