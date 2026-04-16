export const aboutParagraphs = [
  "I'm a junior at Syracuse University's School of Information Studies, pursuing a B.S. in Information Management & Technology, concentrating in Infosec. I'm also an ISO 9001:2015 Certified Internal Auditor, a credential I earned while automating quality processes in manufacturing environments.",
  "My path into tech started on the operations side. During two QA internships at Stainless Engineering and E.C. Styberg Engineering, I overhauled document control systems, conducted internal audits, and built Python automation that replaced hours of manual reformatting across hundreds of quality documents. That experience taught me to look for the process behind the problem before writing a single line of code.",
  "Outside of work, I build across whatever domain grabs my attention. I've developed algorithmic trading strategies for E-mini S&P 500 futures on NinjaTrader, built a game-theory-optimal poker training application with React and Supabase, and created academic workflow tools to manage my own coursework. Each project is different, but the pattern is the same.",
  "The common thread across everything I do is systems thinking. I don't specialize in one stack or one industry. I connect dots across quantitative analysis, process improvement, and software development. That range isn't a distraction. It's how I approach every problem I encounter.",
];

// Landing-page condensed About per spec §6.7 + §13 copy edits.
// Structure: 3 paragraphs with a pull-quote between #2 and #3.
export const landingAbout = {
  paragraphs: [
    "I'm a junior at Syracuse University's School of Information Studies, pursuing a B.S. in Information Management & Technology, concentrating in Infosec. I'm also an ISO 9001:2015 Certified Internal Auditor — a credential I earned during two QA internships at Stainless Engineering and E.C. Styberg Engineering, where I overhauled document control systems, ran internal audits, and built Python automation that replaced hours of manual reformatting across hundreds of quality documents.",
    "Outside of work, I build across whatever domain grabs my attention. I've developed algorithmic trading strategies for E-mini S&P 500 futures on NinjaTrader, built a game-theory-optimal poker training application with React and Supabase, and created academic workflow tools to manage my own coursework.",
    "The common thread across everything I do is systems thinking. I don't specialize in one stack or one industry — I connect dots across quantitative analysis, process improvement, and software development. That range isn't a distraction; it's how I approach every problem I encounter.",
  ],
  pullQuote:
    'Identify an inefficiency, model the problem quantitatively, and build something to solve it.',
} as const;

export interface SkillCategory {
  label: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    label: 'Languages',
    skills: ['Python', 'TypeScript', 'JavaScript', 'R', 'SQL', 'C', 'HTML/CSS', 'NinjaScript'],
  },
  {
    label: 'Frameworks & Tools',
    skills: ['React', 'Next.js', 'Supabase', 'Git/GitHub', 'VS Code', 'Cursor', 'NinjaTrader', 'Jupyter'],
  },
  {
    label: 'AI & Automation',
    skills: ['Prompt Engineering', 'Context Engineering', 'Agentic AI Workflows', 'Claude Code CLI', 'Codex CLI'],
  },
  {
    label: 'Data & Quality',
    skills: ['Statistical Modeling', 'Data Visualization', 'ggplot2', 'ISO 9001:2015', 'Process Improvement', 'Document Control'],
  },
];
