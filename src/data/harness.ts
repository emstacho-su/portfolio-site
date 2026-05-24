// Six capability pillars for the distilled harness section (R-28 / D-18).
// Each pillar is a short headline plus a one-to-two-sentence one-liner sourced
// verbatim from REDESIGN-SPEC.md section 4.4. The prior tabbed, data-dense
// inventory (layers / inventory / hookEvents / stats / skills / plugins) was
// removed in the single-page redesign; this file is intentionally minimal.
// No em dashes or en dashes anywhere (D-22): use periods, commas, parentheses.

export interface HarnessPillar {
  id: string;
  name: string;
  oneLiner: string;
}

export const pillars: HarnessPillar[] = [
  {
    id: 'second-brain-rag',
    name: 'Second Brain as RAG',
    oneLiner:
      'A git-versioned Obsidian vault is the retrieval corpus. Routing rules, full-text (FTS5) search, and per-project memory pull relevant prior decisions into context on demand, so outputs are grounded and improve over time.',
  },
  {
    id: 'gsd-workflow',
    name: 'GSD Workflow',
    oneLiner:
      'Every build runs discuss, plan, execute, verify, driven by machine-readable roadmap, spec, plan, and state artifacts.',
  },
  {
    id: 'multi-agent-research',
    name: 'Multi-Agent Research',
    oneLiner:
      'A silent gap-check audits real knowledge; genuine gaps spin up a seminar of parallel research agents that investigate, debate, then a fresh agent synthesizes, before any code is written.',
  },
  {
    id: 'sub-agent-execution',
    name: 'Sub-Agent Execution',
    oneLiner:
      'Work is delegated to specialized subagents (planner, executor, reviewer, verifier) running in parallel and in isolation, so large builds parallelize and the main thread stays focused.',
  },
  {
    id: 'context-engineering',
    name: 'Context Engineering',
    oneLiner:
      'context-mode sandboxes raw tool output in an indexed store (only summaries reach the window) and a live monitor hook warns before context fills, so long sessions do not degrade.',
  },
  {
    id: 'guardrails',
    name: 'Guardrails',
    oneLiner:
      'Lifecycle hooks enforce phase boundaries, scan reads for prompt injection, and validate commits before they run.',
  },
];
