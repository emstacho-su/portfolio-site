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
    hook: 'A sports analytics platform powered by a headless agent SDK and background strategy daemons.',
    overview:
      'Quant Edge is a full-stack sports-betting analytics platform built as a three-repo distributed system: a React 19 / TypeScript / Supabase web app (on Vercel), a headless Windows daemon that runs the modeling pipeline via the Claude Code SDK, and a versioned library of strategy specifications. It ingests bets from pasted text and screenshot OCR, maintains an append-only bankroll ledger with strict financial invariants, tracks closing-line value against a sharp-book benchmark, shops lines across 30+ sportsbooks, and produces daily/weekly reporting, with all writes routed through a single hooks layer and unit-tested business logic.',
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
    status: 'shipped',
    links: {
      repo: 'https://github.com/emstacho-su/quant-edge-tracker',
      live: 'https://quant-edge-tracker.vercel.app',
    },
    heroImage: '/projects/quant-edge-tracker/dashboard.mp4',
    demos: [
      {
        type: 'video',
        src: '/projects/quant-edge-tracker/dashboard.mp4',
        poster: '/projects/quant-edge-tracker/dashboard.png',
        caption: 'Dashboard and bankroll',
        body: 'The home view tracks bankroll over time, splitting real cash from freeplay, alongside a 7-day profit and loss bar chart and headline cards for cash, total, and win/loss record. It is the at-a-glance read on whether the model is actually making money.',
      },
      {
        type: 'video',
        src: '/projects/quant-edge-tracker/stats.mp4',
        poster: '/projects/quant-edge-tracker/stats.png',
        caption: 'Performance and calibration',
        body: 'The stats page plots cumulative profit and loss and a daily win-rate trend, then sets actual win rate against expected to surface the edge. Filters by account, bet type, and timeframe make it easy to check whether the numbers hold up across a real sample rather than a lucky stretch.',
      },
      {
        type: 'video',
        src: '/projects/quant-edge-tracker/daily-report.mp4',
        poster: '/projects/quant-edge-tracker/daily-report.png',
        caption: 'Weekly and daily reports',
        body: 'Reporting rolls performance up by week, then lets you expand any day to inspect bet-by-bet results with closing-line value on each wager. Stakes and odds are editable and pending bets settle inline, updating the bankroll in real time.',
      },
      {
        type: 'video',
        src: '/projects/quant-edge-tracker/line-shop.mp4',
        poster: '/projects/quant-edge-tracker/line-shop.png',
        caption: 'Line shopping and no-vig consensus',
        body: 'Paste a pick and the line shopper prices it across 30-plus books in one table, showing the vig on every price. It anchors a Pinnacle-based no-vig consensus to flag pre-bet closing-line value and calls out when no book beats the fair number, with an arbitrage scanner running over the same odds snapshots.',
      },
      {
        type: 'video',
        src: '/projects/quant-edge-tracker/accounts.mp4',
        poster: '/projects/quant-edge-tracker/accounts.png',
        caption: 'Accounts and bankroll ledger',
        body: 'A per-account ledger tracks balances across every book, separating cash from freeplay so the bankroll math stays honest. It is the source of truth that the dashboard and reports read from.',
      },
      // Blank, ready-to-fill (D-13): drop the encoded clip + poster at these paths
      // and uncomment once the Strategies page is operational.
      // {
      //   type: 'video',
      //   src: '/projects/quant-edge-tracker/strategies.mp4',
      //   poster: '/projects/quant-edge-tracker/strategies.png',
      //   caption: 'Agent strategy execution and runs',
      //   body: 'Trigger a slate run that spins up the local Windows daemon, which executes versioned strategy skills via the Claude Code SDK, scores each run with post-run audit scripts, and applies git diff updates to the skills repo through a weekly optimizer approval flow.',
      // },
      // Blank, ready-to-fill (D-13): uncomment once the data pipeline view ships.
      // {
      //   type: 'image',
      //   src: '/projects/quant-edge-tracker/pipeline.png',
      //   poster: '/projects/quant-edge-tracker/pipeline.png',
      //   caption: 'The data pipeline',
      //   body: 'Market lines flow in on a schedule, get normalized, and are converted into fair probabilities by stripping the vig and reconciling sources. Background daemons manage the flow and store a consistent, queryable history in Supabase for downstream agent analysis.',
      // },
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
        src: '/projects/ai-news-agent/dashboard.png',
        poster: '/projects/ai-news-agent/dashboard.png',
        caption: 'Dashboard and briefing archive',
        body: 'A dashboard runs the daily briefing on demand and stores every edition in a searchable archive. Briefings filter by section (Anthropic, model releases, research and technical, tools and frameworks, wildcard), a profile editor tunes which topics matter, and a budget meter keeps the agent inside a fixed API spend.',
      },
      {
        type: 'video',
        src: '/projects/ai-news-agent/walkthrough.mp4',
        poster: '/projects/ai-news-agent/walkthrough.png',
        caption: 'The agent in action',
        body: 'A walkthrough of the hand-rolled loop running on a schedule: gather, rank, summarize, send. Open any briefing to read the ranked, deduplicated summary and ask per-item follow-up questions against persistent topic memory. The rebuild on Claude Code Routines plus the Resend MCP replaced most of the glue code while keeping the same daily contract.',
      },
    ],
  },
];
