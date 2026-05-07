import type { SkillPack, VaultCategory } from '@/data/harness';

interface SkillsTabProps {
  alwaysOn: SkillPack[];
  vault: VaultCategory[];
}

export function SkillsTab({ alwaysOn, vault }: SkillsTabProps) {
  return (
    <div>
      <header className="mb-10">
        <h2 className="mb-3">Always-on triggers automatically. Vault loads on demand.</h2>
        <p className="prose-body text-foreground/85 mt-3">
          Always-on skills feed every system prompt; vaulted skills are
          grep-loaded via{' '}
          <code className="font-mono text-sm">SKILL-INDEX.md</code>.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* ALWAYS-ON */}
        <section className="border border-hairline rounded-md p-6 bg-background">
          <header className="flex items-baseline justify-between mb-2">
            <h3 className="font-sans text-base font-semibold text-foreground inline-flex items-center gap-2">
              <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-crimson" />
              Always-on packs
            </h3>
            <span className="font-mono text-[11px] text-muted-foreground">
              71 skills
            </span>
          </header>
          <p className="text-sm text-muted-foreground mb-5">
            Auto-loaded every session. Triggers from prompt patterns.
          </p>

          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {alwaysOn.map((pack, i) => (
              <li
                key={pack.id}
                className={`bg-surface/60 border border-hairline rounded p-4 ${
                  i === alwaysOn.length - 1 && alwaysOn.length % 2 === 1
                    ? 'sm:col-span-2'
                    : ''
                }`}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-sans text-sm font-semibold text-foreground">
                    {pack.name}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {pack.count}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed mb-2">
                  {pack.description}
                </p>
                {pack.examples.length > 0 && (
                  <ul className="flex flex-wrap gap-1 mt-2">
                    {pack.examples.map((ex) => (
                      <li
                        key={ex}
                        className="font-mono text-[10px] tracking-wide px-1.5 py-0.5 border border-hairline text-muted-foreground"
                      >
                        {ex}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* VAULT */}
        <section className="border border-hairline rounded-md p-6 bg-background">
          <header className="flex items-baseline justify-between mb-2">
            <h3 className="font-sans text-base font-semibold text-foreground inline-flex items-center gap-2">
              <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-crimson" />
              Vault — on demand
            </h3>
            <span className="font-mono text-[11px] text-muted-foreground">
              94 skills
            </span>
          </header>
          <p className="text-sm text-muted-foreground mb-5">
            Sit at <code className="font-mono">~/.claude/skill-vault/</code>.
            Not in the system prompt.
          </p>

          <ul role="list" className="grid grid-cols-2 gap-2">
            {vault.map((cat) => (
              <li
                key={cat.path}
                className="bg-surface/60 border border-hairline rounded p-4"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {cat.path}
                  </span>
                  <span className="font-mono text-2xl font-semibold tabular-nums text-foreground leading-none">
                    {cat.count}
                  </span>
                </div>
                <p className="text-[11px] text-foreground/75 leading-snug mt-2">
                  {cat.examples}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 bg-surface/60 border border-hairline rounded p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-3">
              Lookup flow — 2 tool calls
            </p>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-crimson font-semibold flex-shrink-0 w-6 h-6 rounded-full border border-crimson grid place-items-center"
                >
                  1
                </span>
                <div>
                  <p className="text-sm text-foreground">
                    Grep the index for the skill name
                  </p>
                  <code className="block mt-1 font-mono text-[11px] text-foreground/80 break-all">
                    Grep -n &quot;^rust-patterns&quot; ~/.claude/SKILL-INDEX.md
                  </code>
                </div>
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-crimson font-semibold flex-shrink-0 w-6 h-6 rounded-full border border-crimson grid place-items-center"
                >
                  2
                </span>
                <div>
                  <p className="text-sm text-foreground">
                    Read the SKILL.md at the path returned
                  </p>
                  <code className="block mt-1 font-mono text-[11px] text-foreground/80 break-all">
                    Read ~/.claude/skill-vault/languages/rust-patterns/SKILL.md
                  </code>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
