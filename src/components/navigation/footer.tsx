'use client';

import Link from 'next/link';
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

// Manually updated. One line about what's being built this week.
const CURRENTLY = 'Rebuilding the portfolio in editorial paper + crimson.';

export function Footer() {
  const { trackContactClick } = useAnalytics();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline mt-24">
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Contact */}
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-tertiary mb-4">
            Contact
          </p>
          <ul className="space-y-2">
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
        </div>

        {/* Currently */}
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-tertiary mb-4">
            Currently
          </p>
          <p className="text-sm text-muted-foreground">{CURRENTLY}</p>
        </div>

        {/* Colophon */}
        <div className="md:text-right">
          <p className="font-mono text-xs uppercase tracking-wider text-tertiary mb-4">
            Colophon
          </p>
          <p className="text-sm text-muted-foreground">
            Built with{' '}
            <Link
              href="https://claude.com/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-crimson hover:text-crimson-hover underline decoration-crimson/40 underline-offset-2"
            >
              Claude Code
            </Link>
            .
          </p>
          <p className="font-mono text-xs text-tertiary mt-1">
            © {year} Evan Stachowiak
          </p>
        </div>
      </div>
    </footer>
  );
}
