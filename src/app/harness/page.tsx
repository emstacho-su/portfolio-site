import type { Metadata } from 'next';
import {
  layers,
  inventory,
  hookEvents,
  stats,
  alwaysOnPacks,
  vaultCategories,
  marketplaces,
  mcpServers,
  gsdPhases,
  gsdSituations,
} from '@/data/harness';
import { HarnessTabs } from './_components/HarnessTabs';
import { ArchitectureTab } from './_components/ArchitectureTab';
import { HooksTab } from './_components/HooksTab';
import { SkillsTab } from './_components/SkillsTab';
import { PluginsTab } from './_components/PluginsTab';
import { MemoryTab } from './_components/MemoryTab';
import { GsdTab } from './_components/GsdTab';

export const metadata: Metadata = {
  title: 'Harness | Evan Stachowiak',
  description:
    'Field notes on the 10-layer Claude Code harness behind this portfolio — architecture, hook pipeline, skills, plugins, memory, and the GSD workflow.',
  openGraph: {
    type: 'article',
    siteName: 'Evan Stachowiak',
    title: 'The harness behind the portfolio.',
    description:
      'Field notes on the 10-layer Claude Code harness — architecture, hooks, skills, plugins, memory, GSD workflow.',
    publishedTime: '2026-05-07',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The harness behind the portfolio.',
    description:
      'Field notes on the 10-layer Claude Code harness — architecture, hooks, skills, plugins, memory, GSD workflow.',
  },
};

// force-static: this page is purely build-time content. If a future maintainer
// adds a request-time data fetch (cookies(), headers(), etc.), Next will fail the
// build rather than silently switch to dynamic rendering — that's intended.
export const dynamic = 'force-static';

export default function HarnessPage() {
  return (
    <main
      id="main-content"
      className="flex-1 pt-16 px-6 max-w-[1100px] mx-auto w-full"
    >
      {/* HERO */}
      <section className="py-16 md:py-20">
        <h1 className="mb-6">
          The harness <em className="italic font-normal text-crimson">behind</em> the portfolio.
        </h1>
        <p className="text-lg sm:text-xl text-foreground/85 leading-[1.6] max-w-[60ch]">
          What runs on localhost when I open Claude Code: a ten-layer agentic
          dev stack I built up over a week. Six tabs below — architecture,
          hooks, skills, plugins, memory, GSD workflow.
        </p>

        {/* Stat strip — 6 numbers that size the harness in one glance. */}
        <div className="mt-12">
          <ul
            role="list"
            aria-label="Harness sizing"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-hairline border border-hairline"
          >
            {stats.map((s) => (
              <li
                key={s.label}
                className="bg-background px-4 py-5 flex flex-col gap-1.5"
              >
                <span className="font-mono text-3xl font-semibold tabular-nums text-foreground tracking-tight leading-none">
                  {s.value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DASHBOARD — 6 sticky tabs, content panels follow. */}
      <HarnessTabs
        panels={{
          arch: <ArchitectureTab layers={layers} />,
          hooks: <HooksTab events={hookEvents} />,
          skills: <SkillsTab alwaysOn={alwaysOnPacks} vault={vaultCategories} />,
          plugins: <PluginsTab marketplaces={marketplaces} mcpServers={mcpServers} />,
          memory: <MemoryTab inventory={inventory} />,
          gsd: <GsdTab phases={gsdPhases} situations={gsdSituations} />,
        }}
      />
    </main>
  );
}
