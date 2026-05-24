// Source: resume.pdf from context package, extracted 2026-04-02
// Keep this file in sync with public/resume.pdf when updating.
//
// Privacy (D-20 / R-21b): employer names rendered on the public page are kept
// GENERIC ("a manufacturing company"). Specific employer names and the phone
// number live ONLY on the downloadable /resume.pdf asset, never in this file.
// No em dashes or en dashes anywhere (D-22): dateRange separators use "to".

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
    'Data Science Intern: caught several costing-model errors in week one and automated documentation worth a small team a week of manual effort',
    'Built Python automation (python-docx) that generated and version-controlled ~200 operations documents department-wide',
    'Ground-truth operations background in manufacturing quality, used as analytical leverage for building reliable systems',
    'Supported 20+ students in HTML/CSS as a Teaching Assistant for Front-End Web Development',
  ],

  experience: [
    {
      title: 'Data Science Intern',
      company: 'A manufacturing company',
      dateRange: 'May 2025 to present',
      bullets: [
        'Caught several errors in a production costing model during the first week, preventing downstream pricing and planning impact',
        'Automated documentation that would have cost a small team a week of manual effort, using Python (python-docx) to generate, reformat, and version-control roughly 200 operations documents department-wide',
        'Translated ground-truth knowledge of how the operation actually runs into analytical, reliable tooling, treating quality and process work as the data layer rather than as auditing',
      ],
    },
    {
      title: 'Quality and Operations Intern',
      company: 'A manufacturing company',
      dateRange: 'Apr 2023 to Aug 2023',
      bullets: [
        "Overhauled a department's document control system, revising procedures, safety documentation, and instructional materials for clarity and consistency",
        'Revised the operations process manual, improving language and accessibility including for Spanish-speaking employees',
        'Recognized with a national scholarship for the contribution and presented the work at a national industry conference',
      ],
    },
    {
      title: 'Teaching Assistant, IST 263',
      company: 'Syracuse University, Front-End Web Development',
      dateRange: 'Jan 2025 to May 2025',
      bullets: [
        'Supported 20+ students in HTML/CSS debugging through one-on-one guidance and example-based instruction',
        'Created supplemental materials translating complex front-end concepts into accessible, step-by-step demonstrations',
      ],
    },
  ],

  projects: [
    {
      title: 'Quant Edge Tracker',
      technologies: 'React 19, TypeScript, Vite, Supabase, Recharts',
      status: 'In Development',
      bullets: [
        'Built a sports analytics platform: a data pipeline plus modeling layer that converts market lines into fair, vig-adjusted probabilities',
        'Tracks closing-line value and model calibration over time and surfaces statistical edges with interactive charts',
      ],
    },
    {
      title: 'AI News Agent',
      technologies: 'FastAPI, Claude API, Resend, Fly.io',
      status: 'Shipped',
      bullets: [
        'Shipped an autonomous daily briefing: a hand-rolled agent loop that researches, ranks, and writes a personalized news summary on a schedule',
        'Added persistent topic memory, per-item Q&A, and budget tracking; later rebuilt on Claude Code Routines and the Resend MCP',
      ],
    },
    {
      title: 'EV Trainer',
      technologies: 'TypeScript, React, Supabase',
      status: 'Shipped',
      bullets: [
        'Built a decision-modeling trainer on applied game theory: expected-value and decision-tree analysis with range and equity computation',
        'Turned the statistics into interactive, voice-enabled drills; taught myself the stack and shipped the first version in under a week',
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
    'Game Theory',
  ],
};
