import type { Metadata } from 'next';
import { layers, inventory, hookEvents, colophon, stats } from '@/data/harness';
import { HarnessDiagramIsland } from './_components/HarnessDiagramIsland';
import { InventoryTable } from './_components/InventoryTable';
import { HooksTimeline } from './_components/HooksTimeline';
import { MigrationCallout } from './_components/MigrationCallout';

export const metadata: Metadata = {
  title: 'Harness | Evan Stachowiak',
  description:
    'Field notes on the 10-layer Claude Code harness behind this portfolio — architecture, the OneDrive→AppData migration, and a chroma orphan bug.',
  openGraph: {
    type: 'article',
    siteName: 'Evan Stachowiak',
    title: 'The harness behind the portfolio.',
    description:
      'Field notes on the 10-layer Claude Code harness — architecture, migration, and a chroma orphan bug.',
    publishedTime: '2026-05-07',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The harness behind the portfolio.',
    description:
      'Field notes on the 10-layer Claude Code harness — architecture, migration, and a chroma orphan bug.',
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
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4 inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-crimson" />
          <span>Field Notes — 2026-05-07</span>
        </p>
        <h1 className="mb-6">
          The harness <em className="italic font-normal text-crimson">behind</em> the portfolio.
        </h1>
        <p className="text-lg sm:text-xl text-foreground/85 leading-[1.6] max-w-[60ch]">
          What runs on localhost when I open Claude Code: a ten-layer agentic
          dev stack I built up over a week. Here is the architecture, the
          migration that made it stable, and the bug that took two sessions
          to find.
        </p>

        {/* Stat strip — 6 numbers that size the harness in one glance. */}
        <div className="mt-12">
          <div aria-hidden="true" className="h-px w-24 bg-crimson mb-6" />
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

      <SectionRule />

      {/* §1 THE 10 LAYERS */}
      <section
        id="layers"
        aria-labelledby="layers-heading"
        className="py-16 md:py-20"
      >
        <SectionEyebrow>§1</SectionEyebrow>
        <h2 id="layers-heading" className="mt-2">
          The 10 layers
        </h2>
        <p className="prose-body text-foreground/85 mt-6">
          The harness is layered, not monolithic. Each layer plays a single
          role, talks to its neighbors through a thin interface, and is
          replaceable in isolation. Listed bottom-up — host first, storage
          last.
        </p>
        <HarnessDiagramIsland layers={layers} />
      </section>

      <SectionRule />

      {/* §2 LOCALHOST INVENTORY */}
      <section
        id="inventory"
        aria-labelledby="inventory-heading"
        className="py-16 md:py-20"
      >
        <SectionEyebrow>§2</SectionEyebrow>
        <h2 id="inventory-heading" className="mt-2">
          Localhost inventory
        </h2>
        <p className="prose-body text-foreground/85 mt-6 mb-8">
          Every harness service is loopback-only. Three ports, two services
          plus one zombie reservation. No inbound network access required.
        </p>
        <figure>
          <InventoryTable rows={inventory} />
          <figcaption className="font-mono text-[11px] text-muted-foreground mt-4 leading-relaxed">
            Captured 2026-05-07. Other listeners on the box (Bonjour, Steam,
            Superhuman) are not part of the harness.
          </figcaption>
        </figure>
      </section>

      <SectionRule />

      {/* §3 THE MIGRATION */}
      <section
        id="migration"
        aria-labelledby="migration-heading"
        className="py-16 md:py-20"
      >
        <SectionEyebrow>§3</SectionEyebrow>
        <h2 id="migration-heading" className="mt-2">
          The migration
        </h2>

        <div className="prose-body mt-6 space-y-6 text-foreground/85 leading-[1.7]">
          <p>
            For some unknown stretch of time, the claude-mem worker had been
            failing silently every session start. The hook fired, the worker
            tried to bind, the binding failed, and the rest of Claude Code
            booted as if memory had simply opted out. The logs blamed port{' '}
            <code className="font-mono text-sm">37777</code>.
          </p>

          <MigrationCallout kind="phantom" title="Port 37777, unkillable">
            <p>
              <code className="font-mono text-[12px]">netstat</code> showed a
              listener; <code className="font-mono text-[12px]">tasklist</code>{' '}
              and <code className="font-mono text-[12px]">Get-Process</code>{' '}
              showed nothing. The owning PID 10640 was a kernel-level
              reservation, almost certainly from WSL2 vEthernet or a
              Hyper-V port-proxy. <code className="font-mono text-[12px]">taskkill /F</code>{' '}
              returned &ldquo;process not found&rdquo; while netstat kept
              insisting otherwise. Releasing it required a reboot or admin
              <code className="font-mono text-[12px]"> net stop winnat</code>.
              I rebound the worker to 37778 instead.
            </p>
          </MigrationCallout>

          <p>
            That fixed the boot. But while debugging it I noticed something
            worse: the database itself,{' '}
            <code className="font-mono text-sm">claude-mem.db</code> at 55 MB
            with a 28 MB WAL companion, lived at{' '}
            <code className="font-mono text-sm">C:\Users\estac\OneDrive\.claude-mem\</code>.
            OneDrive&apos;s Known Folder Move had quietly turned the home
            dotfile path into a junction pointing into a synced folder.
          </p>

          <MigrationCallout
            kind="why"
            title="SQLite + cloud sync = corruption risk"
          >
            <p>
              SQLite&apos;s WAL journal is a deliberately fragile
              file-handle dance. Cloud-sync clients reorder writes, hold
              shadow copies, and will happily upload half-flushed pages.
              The result is a torn-write data-loss pattern documented for
              years in the SQLite FAQ. Auto-memory only matters if it
              persists.
            </p>
          </MigrationCallout>

          <p>
            The fix was a one-pass relocation to{' '}
            <code className="font-mono text-sm">%LOCALAPPDATA%</code>{' '}
            (which never syncs), a port rebind to 37778, and synchronized
            edits to three different settings files that all needed the
            same two env vars.
          </p>

          <MigrationCallout kind="configs" title="Three config files in one pass">
            <p>
              <code className="font-mono text-[12px]">~/.claude/settings.json</code>{' '}
              for the SessionStart env block,{' '}
              <code className="font-mono text-[12px]">~/.claude-mem/settings.json</code>{' '}
              for the worker&apos;s own startup, and{' '}
              <code className="font-mono text-[12px]">~/AppData/Local/claude-mem/settings.json</code>{' '}
              for the supervisor at the new data root. Each got{' '}
              <code className="font-mono text-[12px]">CLAUDE_MEM_DATA_DIR</code>{' '}
              pointing at LocalAppData and{' '}
              <code className="font-mono text-[12px]">CLAUDE_MEM_WORKER_PORT=37778</code>.
              Miss one and the worker silently disagrees with itself.
            </p>
          </MigrationCallout>

          <p>
            Worker came up clean on PID 65800, port 37778. The 100 MB of
            stale data still in the OneDrive folder waited a session to
            confirm the new path was healthy, then I deleted it.
          </p>
        </div>
      </section>

      <SectionRule />

      {/* §4 THE CHROMA ORPHAN BUG */}
      <section
        id="chroma-orphan"
        aria-labelledby="chroma-orphan-heading"
        className="py-16 md:py-20"
      >
        <SectionEyebrow>§4</SectionEyebrow>
        <h2 id="chroma-orphan-heading" className="mt-2">
          The chroma orphan
        </h2>

        <div className="prose-body mt-6 space-y-6 text-foreground/85 leading-[1.7]">
          <p>
            Verifying the migration should have been quick: confirm the
            new worker writes correctly, then delete the OneDrive copy.
            Except the OneDrive copy refused to delete. File locks on the
            chroma vector files survived two clean Claude Code restarts.
            That was the symptom — and the symptom did not match the
            assumed cause (OneDrive sync holding the handles), so I went
            looking.
          </p>

          <p>
            claude-mem spawns chroma-mcp four layers deep:{' '}
            <code className="font-mono text-sm">cmd.exe → uvx → chroma-mcp.exe → python ×N</code>.
            Whenever the inner Python died or stdio closed, the worker
            logged{' '}
            <code className="font-mono text-sm">chroma-mcp subprocess closed unexpectedly</code>{' '}
            (worker-service.cjs around line 3171) and reconnected
            cleanly. The reconnect was the problem.
          </p>

          <p>
            The worker tracked one PID — the innermost Python — and
            killed only that one when it reaped a chain. The outer{' '}
            <code className="font-mono text-sm">cmd.exe</code> and{' '}
            <code className="font-mono text-sm">uvx</code> wrappers from
            the dead chain stayed alive as orphans, holding inherited
            file handles. Across a session, orphan chains accumulated.{' '}
            <code className="font-mono text-sm">supervisor.json</code> showed
            one tracked chain; <code className="font-mono text-sm">Get-CimInstance Win32_Process -Filter &quot;Name=&apos;cmd.exe&apos; OR Name=&apos;uvx.exe&apos; OR Name=&apos;chroma-mcp.exe&apos;&quot;</code>{' '}
            showed N+1. The mismatch is the detection rule.
          </p>

          <p>
            Manual cleanup is{' '}
            <code className="font-mono text-sm">Stop-Process</code> on each
            orphan; the worker auto-respawns its own supervised chain
            within seconds. The upstream fix is a process-tree kill —{' '}
            <code className="font-mono text-sm">taskkill /T /F /PID &lt;root&gt;</code>{' '}
            on Windows or{' '}
            <code className="font-mono text-sm">kill -SIGTERM -&lt;pgid&gt;</code>{' '}
            against the process group on POSIX. Filed against{' '}
            <a
              href="https://github.com/thedotmack/claude-mem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crimson link-underline"
            >
              github.com/thedotmack/claude-mem
            </a>
            ; surface lives in{' '}
            <code className="font-mono text-sm">scripts/worker-service.cjs</code>{' '}
            at the &ldquo;subprocess closed unexpectedly&rdquo; branch.
          </p>
        </div>
      </section>

      <SectionRule />

      {/* §5 HOOK PIPELINE */}
      <section
        id="hooks"
        aria-labelledby="hooks-heading"
        className="py-16 md:py-20"
      >
        <SectionEyebrow>§5</SectionEyebrow>
        <h2 id="hooks-heading" className="mt-2">
          Hook pipeline
        </h2>
        <p className="prose-body text-foreground/85 mt-6 mb-12">
          Claude Code fires lifecycle events at deterministic points. Three
          owners — claude-mem, GSD, context-mode — register handlers per
          event. 22 scripts across 7 events as of 2026-05-07.
        </p>
        <HooksTimeline events={hookEvents} />
      </section>

      <SectionRule />

      {/* §6 COLOPHON */}
      <section
        id="colophon"
        aria-labelledby="colophon-heading"
        className="py-16 md:py-20"
      >
        <SectionEyebrow>§6</SectionEyebrow>
        <h2 id="colophon-heading" className="mt-2">
          Colophon
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          <ColophonColumn label="On the harness side">
            <ul className="space-y-1 font-mono text-sm text-foreground/85">
              {colophon.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ColophonColumn>

          <ColophonColumn label="This page">
            <ul className="space-y-1 font-mono text-sm text-foreground/85">
              {colophon.pageStack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ColophonColumn>

          <ColophonColumn label="Captured">
            <p className="font-mono text-sm text-foreground/85">
              {colophon.capturedOn}
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-3 leading-relaxed">
              Memory dashboard at{' '}
              <span className="text-foreground/85">
                {colophon.dashboardUrl}
              </span>
              {' '}on the author&apos;s machine. Atlas (the visual draft this
              page is built on) at{' '}
              <span className="text-foreground/85">{colophon.atlasUrl}</span>.
            </p>
          </ColophonColumn>
        </div>
      </section>
    </main>
  );
}

function SectionRule() {
  return (
    <div aria-hidden="true" className="hairline-rule" />
  );
}

interface SectionEyebrowProps {
  children: React.ReactNode;
}

function SectionEyebrow({ children }: SectionEyebrowProps) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

interface ColophonColumnProps {
  label: string;
  children: React.ReactNode;
}

function ColophonColumn({ label, children }: ColophonColumnProps) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}
