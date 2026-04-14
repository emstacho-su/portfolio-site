import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stack | Evan Stachowiak',
  description:
    'Hardware, daily drivers, Claude Code setup, workflow, and writing on AI-engineering.',
};

export default function StackPage() {
  return (
    <main
      id="main-content"
      className="flex-1 pt-24 px-6 max-w-[900px] mx-auto w-full"
    >
      <article className="py-12">
        <p className="font-mono text-xs text-tertiary uppercase tracking-wider mb-3">
          /stack
        </p>
        <h1 className="mb-4">The Stack</h1>
        <p className="text-lg text-muted-foreground prose-body">
          Hardware, daily drivers, the Claude stack, workflow, and short notes
          on AI-engineering.
        </p>

        <div className="mt-12 p-6 border border-hairline bg-surface rounded">
          <p className="font-mono text-xs uppercase tracking-wider text-tertiary mb-2">
            Under construction
          </p>
          <p className="text-sm text-muted-foreground prose-body">
            Full stack page — Hardware / Daily Drivers / The Claude Stack /
            Workflow / Writing — coming in Phase 5 of the redesign.
          </p>
        </div>
      </article>
    </main>
  );
}
