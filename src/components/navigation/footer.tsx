'use client';

import { Mail, Link as LinkIcon, Code, Download } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';

// Real contact section (brief §9.3): the nav advertises Contact as a
// destination, so this renders an actual block, not three bare links. The
// availability line (§3.1, verbatim) leads; email, LinkedIn, GitHub, and the
// resume PDF cover every recruiter path.
const CONTACT = [
  {
    label: 'Email',
    value: 'emstacho@syr.edu',
    href: 'mailto:emstacho@syr.edu',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    value: 'evan-stachowiak',
    href: 'https://www.linkedin.com/in/evan-stachowiak-449119349',
    icon: LinkIcon,
  },
  {
    label: 'GitHub',
    value: 'emstacho-su',
    href: 'https://github.com/emstacho-su',
    icon: Code,
  },
  {
    label: 'Resume',
    value: 'resume.pdf',
    href: '/resume.pdf',
    icon: Download,
  },
] as const;

export function Footer() {
  const { trackContactClick } = useAnalytics();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-hairline mt-10 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-6">
        <h2 className="font-sans font-semibold text-2xl md:text-3xl text-crimson">
          Contact
        </h2>
        <div className="h-px bg-gradient-to-r from-crimson/60 via-crimson/20 to-transparent mt-3" />

        {/* Availability line, verbatim per §3.1 — the single most useful
            sentence a recruiter can see. */}
        <p className="mt-8 text-lg md:text-xl text-foreground max-w-[40rem]">
          Looking for full-time data, AI, or process engineering roles starting
          summer 2027.
        </p>

        <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {CONTACT.map(({ label, value, href, icon: Icon }) => {
            const isExternal = href.startsWith('http');
            return (
              <li key={label}>
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  download={label === 'Resume' ? 'Evan_Stachowiak_Resume.pdf' : undefined}
                  onClick={() => trackContactClick(label.toLowerCase())}
                  className="inline-flex items-center gap-2 text-sm text-foreground hover:text-crimson transition-colors"
                >
                  <Icon size={14} className="text-tertiary" aria-hidden="true" />
                  <span className="font-mono text-xs">{value}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-12 pt-5 border-t border-hairline font-mono text-xs text-tertiary">
          © {year} Evan Stachowiak
        </p>
      </div>
    </footer>
  );
}
