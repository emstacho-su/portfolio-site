// Source: resume.pdf from context package, extracted 2026-04-02
// Keep this file in sync with public/resume.pdf when updating

export interface ResumeExperience {
  title: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

export interface ResumeProject {
  title: string;
  technologies: string;
  status?: string;
  bullets: string[];
}

export interface ResumeEducation {
  school: string;
  department: string;
  degree: string;
  expectedDate: string;
  coursework: string[];
}

export interface ResumeData {
  highlights: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation;
  skills: Record<string, string[]>;
  certifications: string[];
  interests: string[];
}

export const resumeData: ResumeData = {
  highlights: [
    'Developed Python document automation (python-docx) for ~200 quality documents department-wide',
    'Conducted 5 ISO 9001:2015 internal audits; nonconformances triggered corrective actions and procedure reviews',
    'SFSA Schumo Scholarship recipient; presented at SFSA National Conference, Chicago',
    'Supported 20+ students in HTML/CSS as Teaching Assistant for Front-End Web Development',
  ],

  experience: [
    {
      title: 'Quality Assurance Intern',
      company: 'E.C. Styberg Engineering',
      dateRange: 'May 2025 – Aug 2025',
      bullets: [
        'Developed Python document automation tools (python-docx) to programmatically generate, reformat, and version-control ~200 quality documents department-wide',
        'Conducted 5 ISO 9001:2015 internal audits, flagging nonconformances that triggered corrective actions and scheduled procedure reviews',
        'Automated the audit-to-revision workflow, replacing manual document control with systematic version tracking and standardized outputs',
      ],
    },
    {
      title: 'Quality Assurance Intern',
      company: 'Stainless Engineering',
      dateRange: 'Apr 2023 – Aug 2023',
      bullets: [
        "Overhauled an entire department's document control system, revising procedures, safety documentation, and instructional materials for compliance and clarity",
        'Revised the quality process manual, optimizing language and accessibility including for Spanish-speaking employees',
        'Recognized with the SFSA Schumo Scholarship for outstanding contributions; presented at the SFSA National Conference in Chicago',
      ],
    },
    {
      title: 'Teaching Assistant, IST 263',
      company: 'Syracuse University, Front-End Web Development',
      dateRange: 'Jan 2025 – May 2025',
      bullets: [
        'Supported 20+ students in HTML/CSS debugging through one-on-one guidance and example-based instruction',
        'Created supplemental materials translating complex front-end concepts into accessible, step-by-step demonstrations',
      ],
    },
  ],

  projects: [
    {
      title: 'SchoolworkTrack',
      technologies: 'TypeScript, JavaScript, CSS',
      bullets: [
        'Local-first app for assignment and deadline tracking; v1.0 complete with sprint-based development methodology',
      ],
    },
    {
      title: 'Custom Poker Trainer',
      technologies: 'TypeScript, React, Supabase',
      status: 'In Development',
      bullets: [
        'Building a custom poker training application with deterministic backend logic for hand evaluation, pot equity calculation, and decision-tree analysis',
        'Targeting beginner players with guided instruction combining game theory fundamentals with interactive decision support',
      ],
    },
    {
      title: 'Algorithmic Trading Strategy Development',
      technologies: 'Python (Jupyter), C#/NinjaScript',
      status: 'In Development',
      bullets: [
        'Developed and backtested automated trading strategies for ES futures on the NinjaTrader platform',
        'Implemented quantitative filters including VIX volatility thresholds and opening range breakout patterns',
      ],
    },
  ],

  education: {
    school: 'Syracuse University',
    department: 'School of Information Studies (iSchool)',
    degree: 'Bachelor of Science, Information Management & Technology',
    expectedDate: 'Expected May 2027',
    coursework: [
      'Applied Data Science (ST 387)',
      'Python Programming (IST 256)',
      'Front-End Web Dev (IST 263)',
      'Networks & Cloud (IST 233)',
      'Info Reporting & Presentation (IST 344)',
      'IT & Data Culture (IST 305)',
    ],
  },

  skills: {
    Programming: ['Python', 'HTML/CSS', 'JavaScript', 'TypeScript'],
    'Tools & Platforms': [
      'Microsoft Suite (Excel Cert.)',
      'Git/GitHub',
      'Cursor',
      'Claude Code CLI',
      'Codex CLI',
      'VS Code',
    ],
    'Data & Analytics': [
      'Statistical Modeling',
      'Data Visualization (ggplot2)',
      'Exploratory Data Analysis',
    ],
    'Quality & Compliance': [
      'ISO 9001:2015 Auditing',
      'Process Improvement',
      'Document Control',
    ],
    'AI & Emerging Tech': [
      'Prompt Engineering',
      'Context Engineering',
      'Agentic AI Workflows',
    ],
  },

  certifications: [
    'ISO 9001:2015 Certified Internal Auditor',
    'Microsoft Excel Certified',
    'SFSA Schumo Scholarship Recipient',
    'VPA Leadership Scholarship',
    'SFSA National Conference Presenter',
  ],

  interests: [
    'Philosophy',
    'Quantitative Strategy',
    'Fitness & Nutrition Science',
    'AI Workflow Design',
    'Poker Theory',
  ],
};
