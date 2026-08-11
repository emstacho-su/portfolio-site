// Single typed source for project content (PORTFOLIO_BRIEF.md §8.1). Both the
// projects section and the resume section read from this file, so statuses and
// copy can never disagree between the two. Long-form copy in `summary` is
// Evan's own LinkedIn write-ups (brief §4) ported near-verbatim; protect the
// numbers when editing. Display order: StyleStack, Quant Edge, AI News Agent
// (bulkDocReformat deliberately left off per Evan, 2026-08-11). Demo media
// uses swappable paths (D-13): drop real assets at the same paths under
// public/ and no code changes are needed. No em or en dashes (D-22).

export interface DemoSection {
  type: 'video' | 'image';
  src: string; // media path under public/ (swappable, D-13)
  poster?: string; // shown under reduced motion / before play
  caption: string; // short label
  body: string; // explanatory text (doubles as the accessible description)
  captionsSrc?: string; // optional WebVTT captions track for videos (§8.3)
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  hook: string; // one line for the overview panel
  overview: string; // short paragraph for the panel
  summary: string[]; // long-form case-study paragraphs (LinkedIn copy, §4)
  period: string; // "Mar 2026 to Jun 2026" (no dashes, D-22)
  tech: string[];
  status: 'shipped' | 'in-progress';
  links: { repo?: string; live?: string };
  heroImage: string; // empty string = media not produced yet (renders empty state)
  demos: DemoSection[]; // ordered demo sections rendered in the pop-out
  resumeBullets: string[]; // compact lines for the resume section
}

export const projects: Project[] = [
  {
    id: 'stylestack',
    slug: 'stylestack',
    title: 'StyleStack',
    hook: "A wardrobe app built on a single premise: if you extract a garment's actual color properly, outfit compatibility becomes a solvable problem rather than a matter of taste.",
    overview:
      "The center of the project is a pure TypeScript engine, deliberately isolated from the UI. It takes an item plus the outfit in progress and returns a verdict with reasons, and every grey-out and badge in the interface is that one function's output. CI enforces the isolation rather than trusting convention: if a framework dependency leaks into the engine, the build fails.",
    summary: [
      'The center of the project is a pure TypeScript engine, deliberately isolated from the UI. It takes an item plus the outfit in progress and returns a verdict with reasons. Every grey-out and badge in the interface is that one function\'s output, and no rule logic lives in a component. Color is handled in OKLab and OKLCh rather than RGB, so "close colors" means perceptually close, and k-means clustering over background-removed pixels extracts dominant colors before snapping them to a curated palette.',
      "CI enforces the engine's isolation rather than trusting convention. ESLint bans framework and DOM imports inside the package, it builds standalone, and a plain Node smoke test imports the built output outside any bundler. If a dependency leaked in, the build fails. The core compatibility function is held at 100% branch coverage and tested with property-based generation.",
      'Authorization is tested rather than assumed. A dedicated suite covers row-level security across the social graph, private fields on public profiles, query scoping, and cascade behavior on account deletion. 82 test files across the workspace.',
    ],
    period: 'Jun 2026 to Present',
    tech: [
      'Next.js App Router',
      'TypeScript',
      'Supabase RLS',
      'pnpm monorepo',
      'Vitest',
      'fast-check',
    ],
    status: 'in-progress',
    links: {
      live: 'https://fsn-wardrobe.vercel.app',
    },
    heroImage: '', // media in production; see public/projects/stylestack/README.md
    demos: [
      // Ready-to-fill (D-13 / §8.3): drop the assets at these paths and
      // uncomment. Captions are Evan's own from the brief (§4.1).
      // {
      //   type: 'image',
      //   src: '/projects/stylestack/engine-pipeline.png',
      //   poster: '/projects/stylestack/engine-pipeline.png',
      //   caption: 'Engine architecture and the CI purity gate',
      //   body: 'The pipeline from a garment photo to an outfit verdict. Background removal runs client-side, k-means clustering pulls dominant colors off the masked pixels, and those snap to a curated palette in OKLab. Everything downstream flows through one function, compatible(), which returns a verdict plus the reasons behind it. The gate is enforced by CI on every push, so the engine cannot quietly pick up a framework dependency.',
      // },
      // {
      //   type: 'video',
      //   src: '/projects/stylestack/landing.mp4',
      //   poster: '/projects/stylestack/landing.png',
      //   caption: 'Landing: every piece you own, every fit it makes',
      //   body: 'Type-driven layout with a scroll-linked sequence that builds an outfit as you move down the page.',
      // },
      // {
      //   type: 'video',
      //   src: '/projects/stylestack/counters.mp4',
      //   poster: '/projects/stylestack/counters.png',
      //   caption: 'Scroll-linked counters and color extraction',
      //   body: 'Counters animate with scroll position to show items cut out, hues resolved onto a single wheel, and rules applied. The swatch band below is real extracted color, not decoration.',
      // },
    ],
    resumeBullets: [
      'Built a wardrobe app around a pure TypeScript compatibility engine, isolated from the UI, held at 100% branch coverage, and tested with property-based generation',
      'CI enforces the engine isolation: ESLint bans framework imports, the package builds standalone, and the build fails if a dependency leaks in; 82 test files across the workspace',
    ],
  },
  {
    id: 'quant-edge-tracker',
    slug: 'quant-edge-tracker',
    title: 'Quant Edge Tracker',
    hook: 'A sports analytics platform powered by a headless agent SDK and background strategy daemons.',
    overview:
      "A personal analytics platform for tracking position performance across sports markets. I built it to answer one question: is there a measurable edge here, or is it just variance? Every position stores the model's claimed edge at the time it was taken, so calibration is measurable after the fact. Across 59 predictions on one strategy it projected 53.0% and realized 39.6%, a 13.4 point overconfidence gap.",
    summary: [
      'It runs as three repos. A React 19 and TypeScript web app handles ingestion, reporting, and visualization. A headless Node daemon executes modeling runs through the Claude Code SDK and writes audited results back to Supabase. A third repo holds versioned strategy specifications that the daemon feeds to the model, so every prediction traces back to the exact spec version that produced it.',
      'The measurement layer is the part I care about most. Every position stores the model\'s claimed edge at the time it was taken, which makes calibration measurable after the fact. You can ask what actually happened when the model said 53%. Across 59 predictions on one strategy it projected 53.0% and realized 39.6%, a 13.4 point overconfidence gap. I would not have caught that without building the measurement layer first.',
      'Other pieces: an append-only capital ledger with a hard invariant that prevents negative balances at any point in history, including backdated inserts. Closing line value tracked against a Pinnacle-anchored no-vig fair price. Price ingestion across 30+ venues with a best-price and arbitrage scanner.',
    ],
    period: 'Mar 2026 to Jun 2026',
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
    resumeBullets: [
      'Built a sports analytics platform: a data pipeline plus modeling layer that converts market lines into fair, vig-adjusted probabilities',
      'Stores every prediction next to the edge it claimed: across 59 predictions one strategy projected 53.0% and realized 39.6%, a 13.4 point overconfidence gap the measurement layer exists to catch',
    ],
  },
  {
    id: 'ai-news-agent',
    slug: 'ai-news-agent',
    title: 'AI News Agent',
    hook: 'An autonomous agent that researches the day and writes my morning briefing before I am awake to read it.',
    overview:
      'AI News Agent is a self-running daily briefing. A hand-rolled agent loop gathers and ranks the day\'s news against a profile of what I care about, drafts a tight summary, and emails it on a schedule. It keeps persistent topic memory so the briefing sharpens over time, includes per-item Q&A and budget tracking, and was later rebuilt on Claude Code Routines and the Resend MCP.',
    summary: [
      'I built it without an agent framework on purpose. The loop is a single Python function of roughly 150 lines that calls the Anthropic SDK directly, dispatches its own tool calls, retries transient failures, and enforces per-run iteration caps. I wanted to understand agent loop fundamentals rather than have a library hide them from me.',
      "Six client tools handle web search, memory matching, and briefing finalization. Persistent topic memory means a recurring story shows up as an update instead of as new, which needed a cheap Haiku call for semantic matching after naive string comparison kept failing. Follow-up questions on any briefing item run through a narrowed loop with a restricted tool subset, so a follow-up structurally cannot overwrite the day's output.",
      'Cost control is enforced rather than advisory. Every run records token spend against a monthly cap, and the loop refuses to start once the budget is used up. A typical daily run costs between 20 and 50 cents.',
      '373 tests passing, with every Anthropic call mocked so the suite costs nothing to run.',
    ],
    period: 'Apr 2026 to May 2026',
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
    resumeBullets: [
      'Shipped an autonomous daily briefing: a hand-rolled agent loop of roughly 150 lines that researches, ranks, and writes a personalized news summary on a schedule',
      'Added persistent topic memory, per-item Q&A, and enforced budget caps; 373 tests with every Anthropic call mocked; later rebuilt on Claude Code Routines and the Resend MCP',
    ],
  },
];
