'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { TIMING, EASE } from '@/lib/animation';
import { useScrollspy } from '@/hooks/use-scrollspy';
import { MobileMenu } from './mobile-menu';
import { SkLogo } from './sk-logo';
import { Menu } from 'lucide-react';

// In-page anchor links (D-02). href values are hashes; the id after `#` is both
// the scroll target and the scrollspy key.
const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
] as const;

// Every anchored section, in DOM order, for scrollspy (hero is observed so the
// nav shows nothing active while the hero fills the viewport).
const SECTION_IDS = [
  'hero',
  'about',
  'projects',
  'resume',
  'contact',
];

// Navbar height (h-16 = 64px); scroll the target to sit just below the nav.
const NAV_OFFSET = -64;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenis = useLenis();
  const activeId = useScrollspy(SECTION_IDS);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();
    lenis?.scrollTo(href, { offset: NAV_OFFSET });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: TIMING.NAV_TRANSITION, ease: EASE.OUT }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-background/92 backdrop-blur-lg border-b border-hairline'
            : 'bg-transparent'
        )}
      >
        {/* Full-width nav (Evan, 2026-08-12): the brand and links sit near the
            screen edges with a small gutter, matching the edge-driven design
            language (full-bleed slabs, viewport-wrapping ribbon) instead of
            the 1200px text column. */}
        <nav className="w-full px-5 md:px-8 h-16 flex items-center justify-between">
          {/* Monogram replaces the ES_ wordmark (Evan, 2026-08-12). Ink
              linework inherits the link color, so hover tints the whole
              mark crimson to match the old hover behavior. */}
          <Link
            href="/"
            className="text-foreground hover:text-crimson transition-all duration-200 inline-flex items-center hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.96]"
            aria-label="Home"
          >
            <SkLogo className="h-7 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = activeId === link.href.slice(1);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleAnchorClick(event, link.href)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'group font-mono text-sm relative py-1 inline-block transition-all duration-200',
                    'hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.97]',
                    active
                      ? 'text-crimson'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-crimson"
                      transition={{ duration: 0.25 }}
                    />
                  )}
                  {!active && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px bg-crimson/60 w-0 group-hover:w-full transition-[width] duration-200 ease-out"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
        </nav>
      </motion.header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={NAV_LINKS}
        activeId={activeId}
      />
    </>
  );
}
