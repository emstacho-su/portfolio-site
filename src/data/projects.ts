// Project data model (REDESIGN-SPEC section 4.3). The pop-out case study in
// Wave 3 (02-05) reads `demos` in order; keep the array ordered. Demo media
// uses swappable placeholder paths (D-13): drop real assets at the same paths
// under public/ and no code changes are needed. No em dashes (D-22).

export interface DemoSection {
  type: 'video' | 'image';
  src: string; // placeholder media path for now (swappable, D-13)
  poster?: string; // shown under reduced motion / before play
  caption: string; // short label
  body: string; // explanatory text
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  hook: string; // one line for the overview panel
  overview: string; // short paragraph
  tech: string[];
  status: 'shipped' | 'in-progress';
  links: { repo?: string; live?: string };
  heroImage: string; // placeholder (swappable, D-13)
  demos: DemoSection[]; // ordered demo sections rendered in the pop-out
}

export const projects: Project[] = [
  {
    id: 'quant-edge-tracker',
    slug: 'quant-edge-tracker',
    title: 'Quant Edge Tracker',
    hook: 'A sports analytics platform that turns market lines into fair probabilities and tracks where the statistical edge actually lives.',
    overview:
      'Quant Edge Tracker is a data pipeline plus modeling layer for sports analytics. It ingests market lines, converts them into fair, vig-adjusted probabilities, tracks closing-line value over time, and surfaces statistical edges through interactive charts. The work is in the modeling and the data plumbing: calibration, sample sizing, and honest performance tracking rather than tips.',
    tech: [
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind v4',
      'shadcn/ui',
      'Supabase',
      'Recharts',
      'Vercel',
    ],
    status: 'in-progress',
    links: { repo: 'https://github.com/emstacho-su/quant-edge-tracker' },
    heroImage: '/projects/quant-edge-tracker/hero.png',
    demos: [
      {
        type: 'image',
        src: '/projects/quant-edge-tracker/pipeline.png',
        poster: '/projects/quant-edge-tracker/pipeline.png',
        caption: 'The data pipeline',
        body: 'Market lines flow in on a schedule, get normalized, and are converted into fair probabilities by stripping the vig and reconciling sources. Everything is stored in Supabase so the modeling layer always reads from a consistent, queryable history.',
      },
      {
        type: 'image',
        src: '/projects/quant-edge-tracker/edge-charts.png',
        poster: '/projects/quant-edge-tracker/edge-charts.png',
        caption: 'Edge and calibration charts',
        body: 'Recharts views break down modeled probability against the market, with calibration plots that show whether the numbers actually hold up across a real sample rather than a lucky stretch.',
      },
      {
        type: 'video',
        src: '/projects/quant-edge-tracker/clv-walkthrough.mp4',
        poster: '/projects/quant-edge-tracker/clv-walkthrough.png',
        caption: 'Closing-line value over time',
        body: 'A short walkthrough of the closing-line value tracker, the metric that measures whether a model is consistently beating the market by the time lines settle. It is the cleanest signal that an edge is real and not noise.',
      },
    ],
  },
  {
    id: 'ai-news-agent',
    slug: 'ai-news-agent',
    title: 'AI News Agent',
    hook: 'An autonomous agent that researches the day and writes my morning briefing before I am awake to read it.',
    overview:
      'AI News Agent is a self-running daily briefing. A hand-rolled agent loop gathers and ranks the day\'s news against a profile of what I care about, drafts a tight summary, and emails it on a schedule. It keeps persistent topic memory so the briefing sharpens over time, includes per-item Q&A and budget tracking, and was later rebuilt on Claude Code Routines and the Resend MCP.',
    tech: [
      'FastAPI',
      'Claude API',
      'Resend',
      'Fly.io',
      'Claude Code Routines',
      'Resend MCP',
    ],
    status: 'shipped',
    links: { repo: 'https://github.com/emstacho-su/ai-news-agent' },
    heroImage: '/projects/ai-news-agent/hero.png',
    demos: [
      {
        type: 'image',
        src: '/projects/ai-news-agent/briefing-email.png',
        poster: '/projects/ai-news-agent/briefing-email.png',
        caption: 'The morning briefing',
        body: 'The product is the email: a ranked, deduplicated summary of the day delivered on a schedule via Resend. The agent decides what is worth including, so the briefing stays short without dropping anything that matters.',
      },
      {
        type: 'image',
        src: '/projects/ai-news-agent/dashboard.png',
        poster: '/projects/ai-news-agent/dashboard.png',
        caption: 'Dashboard and per-item Q&A',
        body: 'A dashboard exposes per-item question and answer, a profile editor for tuning topics, and budget tracking so the agent stays inside a fixed API spend. Persistent topic memory lets it remember what it already covered.',
      },
      {
        type: 'video',
        src: '/projects/ai-news-agent/agent-loop.mp4',
        poster: '/projects/ai-news-agent/agent-loop.png',
        caption: 'The agent loop',
        body: 'A look at the hand-rolled loop running on Fly.io: gather, rank, summarize, send. The rebuild on Claude Code Routines plus the Resend MCP replaced most of the glue code while keeping the same daily contract.',
      },
    ],
  },
  {
    id: 'ev-trainer',
    slug: 'ev-trainer',
    title: 'EV Trainer',
    hook: 'A game-theory trainer that teaches expected-value thinking through interactive, voice-enabled decision drills.',
    overview:
      'EV Trainer is a decision-modeling trainer built on applied game theory. It runs expected-value and decision-tree analysis, computes ranges and equity, and turns the math into interactive, voice-enabled drills so the reasoning becomes second nature. It is an applied study in decision science and statistics, and I taught myself the stack and shipped the first version in under a week.',
    tech: ['TypeScript', 'React', 'Supabase'],
    status: 'shipped',
    links: { repo: 'https://github.com/emstacho-su/ev-trainer' },
    heroImage: '/projects/ev-trainer/hero.png',
    demos: [
      {
        type: 'image',
        src: '/projects/ev-trainer/decision-tree.png',
        poster: '/projects/ev-trainer/decision-tree.png',
        caption: 'Expected-value decision trees',
        body: 'Each scenario is modeled as a decision tree with expected-value computed at every branch, so a learner can see exactly why one line beats another instead of memorizing a chart.',
      },
      {
        type: 'image',
        src: '/projects/ev-trainer/range-equity.png',
        poster: '/projects/ev-trainer/range-equity.png',
        caption: 'Range and equity computation',
        body: 'The trainer computes ranges and equity on the fly, framing the problem as a statistics and probability exercise. The point is the reasoning under uncertainty, not the game it borrows from.',
      },
      {
        type: 'video',
        src: '/projects/ev-trainer/voice-drill.mp4',
        poster: '/projects/ev-trainer/voice-drill.png',
        caption: 'Voice-enabled drilling',
        body: 'A short clip of a hands-free drill: the trainer poses a spot out loud, the learner reasons through the expected value, and the app scores the decision. Drilling a skill until it is automatic is the whole idea.',
      },
    ],
  },
];
