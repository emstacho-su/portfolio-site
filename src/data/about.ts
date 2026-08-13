// APPROVED about narrative (REDESIGN-SPEC section 4.2, verbatim 2026-05-24;
// cut-project references removed 2026-08-11 per PORTFOLIO_BRIEF.md §6.3).
// Do not paraphrase or invent. Five paragraphs, grounded-confident voice.
// No em dashes (D-22). Both aboutParagraphs and landingAbout.paragraphs
// carry the same approved five-paragraph copy (D-09).

const approvedNarrative = [
  "I'm Evan Stachowiak, and I build things. I grew up between two worlds: a mother with a doctorate in nursing education and a father who ran manufacturing companies. One side gave me a deep respect for understanding how things actually work; the other gave me an early, hands-on feel for how a business runs on the floor. My childhood was split between the suburbs and a horse rescue in Wisconsin, which mostly meant manual labor and weekends building and fixing things next to my dad.",
  "One of those projects was a horse shelter. We built it by measuring the old one, working out every material and how the pieces fit, and turned it into a plan we could actually execute. That loop - understanding the inputs, how it works, then building it, has never left me. A few years later, at 13, I watched my dad run gutters in a way that made no sense to me, suggested a cleaner method, and it worked. That was when I realized I had a knack for seeing how things should work, as long as I understood why they work first.",
  "That curiosity runs through everything, not just code. I started college on a vocal performance scholarship, which is where I learned to drill a hard skill until it becomes automatic, before the build instinct won and I moved into tech. I learn the same way regardless of the subject: break it down to fundamentals, build a working understanding from the bottom up, then get hands on and learn the rest by making mistakes fast. It is how I taught myself to ski and snowboard in a day each and ended up instructing.",
  "My edge is where that curiosity meets discipline. I came up through quality and operations work in manufacturing, which made me genuinely analytical and critical about how things get built. Pair that with a real passion for statistics, the kind that has me thinking in expected value at the poker table as readily as in my work, and my information-management coursework, and you get what I actually do well: build with AI and keep it reliable. As a data science intern I put that to work right away, catching several errors in a costing model in my first week and automating documentation that would have cost a small team a week of manual effort.",
  "Everything else I have built came from the same place: sports analytics tools and an autonomous AI agent that researches and writes my morning briefing. Find the leverage point, learn what I need, and sweat the details until it feels right. I care how things look and not just whether they work, and the same discipline that keeps me consistent in the gym is what keeps me refining a build long after it runs. At this point the question is never whether I can build something. It is what to build next.",
] as const;

export const aboutParagraphs = [...approvedNarrative];

// LinkedIn About (verbatim from Evan's updated LinkedIn, 2026-08-12; this
// version supersedes PORTFOLIO_BRIEF.md §3.2). This LEADS the on-page About
// section (§9.4). Do not paraphrase.
export const linkedinAbout = [
  'I look at systems from angles others tend to overlook, both the big picture and the small details that hold it all together. That instinct led me to quality assurance, where I earned an ISO 9001:2015 Internal Auditor certification and spent two internships analyzing workflows, standardizing documentation, and finding inefficiencies before they became problems.',
  "At E.C. Styberg Engineering, that work has become data work spanning quality systems, inventory, and commercial process. Different problems, same move: find where the record and reality have drifted apart, close the gap, and build something that keeps it closed. Sometimes that's a compliance gap everyone assumed was covered, sometimes it's inventory that doesn't match the floor, sometimes it's a process documented one way and run another. It's also made me the person in the room when outside technology meets the shop, pressure-testing vendor claims against how the plant actually runs.",
  'I build the same way on my own time. An analytics platform that stores every model prediction next to the edge it claimed, so calibration is measurable after the fact. An autonomous research agent with no framework hiding the loop and a budget gate that halts execution when it should. A wardrobe app whose color engine is isolated from the UI by a CI check that fails the build if a framework dependency leaks in.',
  'The through line is caring whether something actually works and being able to prove it. Senior in Information Management and Technology at the Syracuse University iSchool, concentrating in information security. Looking for full time data, AI, or process engineering roles starting summer 2027.',
] as const;

// Landing-page About: the approved five-paragraph narrative with a pull quote.
// about.tsx renders all five paragraphs with the pull quote woven in (D-10).
export const landingAbout = {
  paragraphs: [...approvedNarrative],
  pullQuote: 'The question is never whether I can build it. It is what to build next.',
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
