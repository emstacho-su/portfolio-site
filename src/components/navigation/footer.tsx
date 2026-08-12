'use client';

import { Mail, Phone, Link as LinkIcon, Code, Download } from 'lucide-react';
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
    label: 'Phone',
    value: '(262) 933-0228',
    // No tel: link (Evan, 2026-08-12): the number renders as plain text.
    href: null,
    icon: Phone,
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
    // Slim footer (Evan, 2026-08-12): the explicit Contact block (heading +
    // availability line) is gone; just the addresses and the copyright. The
    // id stays so the Contact nav link, scrollspy, and section_view analytics
    // keep resolving here; no top margin so the docked contact marquee sits
    // flush on the border.
    <footer id="contact" className="border-t border-hairline scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-6">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {CONTACT.map(({ label, value, href, icon: Icon }) => {
            // Entries without an href (phone) render as plain text.
            if (!href) {
              return (
                <li key={label}>
                  <span className="inline-flex items-center gap-2 text-sm text-foreground">
                    <Icon size={14} className="text-tertiary" aria-hidden="true" />
                    <span className="font-mono text-xs">{value}</span>
                  </span>
                </li>
              );
            }
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

        <p className="mt-8 pt-5 border-t border-hairline font-mono text-xs text-tertiary">
          © {year} Evan Stachowiak
        </p>
      </div>
    </footer>
  );
}
