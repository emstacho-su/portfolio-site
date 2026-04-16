'use client';

import { Mail, Link as LinkIcon, Code } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';

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
] as const;

export function Footer() {
  const { trackContactClick } = useAnalytics();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline mt-10">
      <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {CONTACT.map(({ label, value, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={
                  href.startsWith('mailto')
                    ? undefined
                    : 'noopener noreferrer'
                }
                onClick={() => trackContactClick(label.toLowerCase())}
                className="inline-flex items-center gap-2 text-sm text-foreground hover:text-crimson transition-colors"
              >
                <Icon
                  size={14}
                  className="text-tertiary"
                  aria-hidden="true"
                />
                <span className="font-mono text-xs">{value}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="font-mono text-xs text-tertiary">
          © {year} Evan Stachowiak
        </p>
      </div>
    </footer>
  );
}
