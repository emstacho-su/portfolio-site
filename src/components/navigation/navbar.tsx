'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { TIMING, EASE } from '@/lib/animation';
import { MobileMenu } from './mobile-menu';
import { Menu } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Harness', href: '/harness' },
  { label: 'Resume', href: '/resume' },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <nav className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="group font-mono text-sm text-foreground hover:text-crimson transition-all duration-200 inline-flex items-baseline hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.96]"
            aria-label="Home"
          >
            ES
            <motion.span
              className="text-crimson inline-block"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              _
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
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
        pathname={pathname}
      />
    </>
  );
}
