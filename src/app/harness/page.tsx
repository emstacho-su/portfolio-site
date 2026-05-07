import type { Metadata } from 'next';
import { layers, inventory, hookEvents, colophon } from '@/data/harness';
import { LayerCardList } from './_components/LayerCardList';
import { InventoryTable } from './_components/InventoryTable';
import { HooksTimeline } from './_components/HooksTimeline';

export const metadata: Metadata = {
  title: 'Harness | Evan Stachowiak',
  description:
    'Field notes on the 10-layer Claude Code harness behind this portfolio — architecture, the OneDrive→AppData migration, and a chroma orphan bug.',
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
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-tertiary mb-4">
          Field Notes — 2026-05-07
        </p>
        <h1 className="mb-6">The harness behind the portfolio.</h1>
        <p className="text-lg sm:text-xl text-foreground/85 leading-[1.6] max-w-[60ch]">
          What runs on localhost when I open Claude Code: a ten-layer agentic
          dev stack I built up over a week. Here is the architecture, the
          migration that made it stable, and the bug that took two sessions
          to find.
        </p>
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
        <LayerCardList layers={layers} />
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
          <figcaption className="font-mono text-[11px] text-tertiary mt-4 leading-relaxed">
            Captured 2026-05-07. Other listeners on the box (Bonjour, Steam,
            Superhuman) are not part of the harness.
          </figcaption>
        </figure>
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
            <p className="font-mono text-xs text-tertiary mt-3 leading-relaxed">
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
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-tertiary">
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
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-tertiary mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}
