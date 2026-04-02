export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  technologies: string[];
  status: 'completed' | 'in-progress';
  githubUrl?: string;
  imageLabel: string;
}

export const projects: Project[] = [
  {
    id: 'gto-poker-trainer',
    title: 'GTO Poker Trainer',
    subtitle: 'Interactive Training Application',
    description:
      'An interactive training application built on game theory optimal poker strategy, featuring preflop range visualization and decision-tree logic.',
    detailedDescription:
      'Combines applied game theory with intuitive UI/UX design to accelerate strategic learning. Features deterministic backend logic for hand evaluation, pot equity calculation, and decision-tree analysis. Includes voice-to-text hand analysis for hands-free review of play scenarios, targeting beginner players with guided instruction that blends GTO fundamentals with interactive decision support.',
    technologies: ['TypeScript', 'React', 'Supabase'],
    status: 'in-progress',
    githubUrl: 'https://github.com/emstacho-su/ev-trainer',
    imageLabel: 'GTO Poker Trainer: Range Visualization',
  },
  {
    id: 'algo-trading',
    title: 'Algorithmic Futures Trading System',
    subtitle: 'Quantitative Strategy Development',
    description:
      'A backtested and walk-forward validated algorithmic trading system for E-mini S&P 500 futures, incorporating volatility filtering and risk management.',
    detailedDescription:
      'Developed automated trading strategies on the NinjaTrader platform using C# scripting, implementing quantitative filters including VIX volatility thresholds and opening range breakout patterns to optimize entry/exit timing. Analyzed historical market data in Jupyter notebooks to validate strategy performance, iterating on parameters to improve risk-adjusted returns. A rigorous, data-driven approach to systematic trading, not speculation.',
    technologies: ['Python', 'Jupyter', 'C#/NinjaScript', 'NinjaTrader'],
    status: 'in-progress',
    imageLabel: 'Algo Trading: Backtest Results',
  },
  {
    id: 'bulk-doc-reformat',
    title: 'bulkDocReformat',
    subtitle: 'QA Document Automation',
    description:
      'Python automation tool for bulk document processing and reformatting, built during a QA engineering internship to eliminate manual document handling.',
    detailedDescription:
      'Developed at E.C. Styberg Engineering to programmatically generate, reformat, and version-control approximately 200 quality documents department-wide. Automated the audit-to-revision workflow, replacing manual document control with systematic version tracking and standardized outputs. Directly reduced processing time and human error in an ISO manufacturing environment.',
    technologies: ['Python', 'python-docx'],
    status: 'completed',
    githubUrl: 'https://github.com/emstacho-su/bulkDocReformat',
    imageLabel: 'bulkDocReformat: CLI Output',
  },
  {
    id: 'schoolwork-track',
    title: 'SchoolworkTrack',
    subtitle: 'Academic Management Platform',
    description:
      'A local-first academic management platform for assignment and deadline tracking, built with sprint-based development methodology.',
    detailedDescription:
      'V1.0 delivers a complete workflow for organizing coursework without cloud dependency. Built using sprint-based development methodology with a focus on practical usability for managing academic deadlines, assignments, and course schedules in a single local-first interface.',
    technologies: ['TypeScript', 'JavaScript', 'CSS'],
    status: 'completed',
    imageLabel: 'SchoolworkTrack: Dashboard View',
  },
];
