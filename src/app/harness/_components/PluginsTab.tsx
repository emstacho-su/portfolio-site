import type { MarketplaceEntry, McpServerEntry } from '@/data/harness';

interface PluginsTabProps {
  marketplaces: MarketplaceEntry[];
  mcpServers: McpServerEntry[];
}

export function PluginsTab({ marketplaces, mcpServers }: PluginsTabProps) {
  return (
    <div>
      <header className="mb-10">
        <h2 className="mb-3">Four marketplaces. Sixteen enabled plugins.</h2>
        <p className="prose-body text-foreground/85 mt-3">
          Plugins ship skills, commands, agents, and MCP servers — toggled in{' '}
          <code className="font-mono text-sm">
            ~/.claude/settings.json → enabledPlugins
          </code>
          .
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {marketplaces.map((m) => (
          <article
            key={m.source}
            className="border border-hairline rounded-md p-5 bg-background flex flex-col"
          >
            <header className="flex items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-muted-foreground break-all">
                  {m.source}
                </p>
                <h3 className="font-sans text-sm font-semibold text-foreground mt-1">
                  {m.title}
                </h3>
              </div>
              <span className="font-mono text-2xl font-semibold tabular-nums text-foreground leading-none">
                {m.plugins.length}
              </span>
            </header>

            <ul role="list" className="flex-1 space-y-1.5 border-t border-hairline pt-3">
              {m.plugins.map((p) => (
                <li
                  key={p.name}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="font-sans text-foreground/90 truncate">
                    {p.name}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/80 flex-shrink-0">
                    {p.version}
                  </span>
                </li>
              ))}
            </ul>

            {m.note && (
              <p className="mt-4 pt-4 border-t border-hairline text-[11px] text-foreground/75 leading-relaxed">
                <span className="font-semibold text-foreground">Note. </span>
                {m.note}
              </p>
            )}
          </article>
        ))}
      </div>

      <section className="mt-10 border border-hairline rounded-md p-6 bg-background">
        <header className="flex items-baseline justify-between mb-4">
          <h3 className="font-sans text-base font-semibold text-foreground">
            MCP servers — exposed via plugin connections
          </h3>
          <span className="font-mono text-[11px] text-muted-foreground">
            {mcpServers.length} servers
          </span>
        </header>

        <ul role="list" className="flex flex-wrap gap-2">
          {mcpServers.map((s) => (
            <li
              key={s.name}
              className="border border-hairline rounded px-3 py-2 bg-surface/60"
            >
              <span className="font-sans text-sm font-medium text-foreground">
                {s.name}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground ml-2">
                ({s.scope})
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
