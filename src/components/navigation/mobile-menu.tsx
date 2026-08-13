'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { TIMING } from '@/lib/animation';
import { X } from 'lucide-react';

interface NavLink {
  readonly label: string;
  readonly href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: readonly NavLink[];
  // Active section id from scrollspy (without the leading `#`).
  activeId: string;
}

// Navbar height (h-16 = 64px); scroll the target to sit just below the nav.
const NAV_OFFSET = -48;

export function MobileMenu({
  open,
  onClose,
  links,
  activeId,
}: MobileMenuProps) {
  const lenis = useLenis();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();
    // Close first so the body scroll-lock releases, then scroll to the anchor.
    onClose();
    lenis?.scrollTo(href, { offset: NAV_OFFSET });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-6 text-foreground p-2"
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </button>

          <nav className="flex flex-col items-center gap-8">
            {links.map((link, i) => {
              const active = activeId === link.href.slice(1);
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    delay: i * TIMING.MENU_STAGGER,
                    duration: 0.3,
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(event) => handleAnchorClick(event, link.href)}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'font-mono text-2xl transition-colors',
                      active
                        ? 'text-crimson'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </a>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
