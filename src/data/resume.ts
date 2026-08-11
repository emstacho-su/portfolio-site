// Source: PORTFOLIO_BRIEF.md §3 (2026-08-11), which mirrors the live LinkedIn
// profile. Every claim here must trace to §3/§4 of the brief; do not invent.
// Employers are NAMED per Evan's locked decision (reverses the earlier D-20
// anonymization; phone number still lives only on /resume.pdf).
// No em dashes or en dashes anywhere (D-22): dateRange separators use "to".
// Project statuses derive from src/data/projects.ts (single source of truth).

import { projects } from './projects';

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
  concentration: string;
  expectedDate: string;
  coursework: string[];
}

export interface ResumeData {
  highlights: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  volunteering: ResumeExperience[];
  education: ResumeEducation;
  skills: Record<string, string[]>;
  certifications: string[];
  interests: string[];
}

// The resume section's project list is DERIVED from src/data/projects.ts
// (single source of truth, brief §8.1): title, stack, status, and compact
// bullets all come from the same objects the projects section renders.
const resumeProjects: ResumeProject[] = projects.map((p) => ({
  title: p.title,
  technologies: p.tech.join(', '),
  status: p.status === 'shipped' ? 'Shipped' : 'In Progress',
  bullets: p.resumeBullets,
}));

export const resumeData: ResumeData = {
  highlights: [
    'Extracted control plan and PFMEA data from a legacy quality planning tool into auditable form, mapping process characteristics to failure modes to surface IATF compliance gaps',
    'Built a Python application that parses 100+ legacy documents across four formats into a standardized company-wide template (bulkDocReformat)',
    'Ground-truth operations background in manufacturing quality, used as analytical leverage for building reliable systems',
    'Supported 20+ students in HTML/CSS as a Teaching Assistant for Front-End Web Development',
  ],

  experience: [
    {
      title: 'Data Science Intern',
      company: 'E.C. Styberg Engineering & Manufacturing',
      dateRange: 'May 2026 to Present',
      bullets: [
        'Built a new business tracker that consolidated opportunity data previously scattered across spreadsheets and inboxes, so pipeline status is visible in one place rather than reconstructed on request',
        'Rebuilt tooling room inventory records, reconciling system data against what was physically on the floor and establishing a process to keep the two aligned',
        'Reviewed internal estimating processes, documenting how they work in practice against how they were designed to work',
        'Acted as technical liaison for a third-party AI tool evaluation, translating between the vendor and internal stakeholders and pressure-testing vendor claims against how the shop actually operates',
        'Extracted control plan and PFMEA data from a legacy quality planning tool into auditable form, standardized operation descriptions across the corpus, and mapped process characteristics to failure modes to surface IATF compliance gaps',
      ],
    },
    {
      title: 'Quality Assurance Intern',
      company: 'E.C. Styberg Engineering & Manufacturing',
      dateRange: 'May 2025 to Aug 2025',
      bullets: [
        'Reformatted instructions and policies into a standardized company-wide format, and built a Python application to parse legacy documents into the new template (bulkDocReformat)',
        'Ensured all documents were properly controlled under the quality system',
        'Earned ISO 9001 Internal Auditor certification',
      ],
    },
    {
      title: 'Undergraduate Teaching Assistant, IST 263',
      company: 'Syracuse University iSchool (Intro to HTML & Front-End Web Design)',
      dateRange: 'Jan 2025 to May 2025',
      bullets: [
        'Selected as an undergraduate TA; supported 20+ students in HTML/CSS debugging through one-on-one guidance and example-based instruction',
        'Created supplemental materials translating complex front-end concepts into accessible, step-by-step demonstrations',
      ],
    },
    {
      title: 'Quality Assurance Intern',
      company: 'Stainless Foundry & Engineering, LLC',
      dateRange: 'May 2023 to Aug 2023',
      bullets: [
        'Managed and standardized outdated melt procedures, converting physical documents into organized digital records',
        'Created new documentation for each melt material, including reference images, to prevent misidentification',
        'Improved department accessibility for floor workers who did not speak English by restructuring the filing system',
        'Recognized with the SFSA Schumo Scholarship for this work and presented it at a national industry conference',
      ],
    },
  ],

  projects: resumeProjects,

  // Twelve documented years is a real line item, not narrative color (§3.6).
  volunteering: [
    {
      title: 'Volunteer Caretaker',
      company: 'Local animal rescues',
      dateRange: '2013 to 2025',
      bullets: [
        'Grew up living on a horse rescue and volunteered across multiple animal rescue organizations for over a decade',
        'Daily feeding, grooming, exercising, and stall maintenance for rescued horses; pen cleaning, walking, and behavioral training assistance for rescue dogs',
      ],
    },
  ],

  education: {
    school: 'Syracuse University',
    department: 'School of Information Studies (iSchool)',
    degree: 'Bachelor of Science, Information Management & Technology',
    concentration: 'Concentration in Information Security',
    expectedDate: 'Expected May 2027 (Senior)',
    coursework: [
      'Applied Data Science (IST 387)',
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
