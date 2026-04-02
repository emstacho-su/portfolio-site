'use client';

import { useEffect } from 'react';
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
  onNavigate: (href: string) => void;
  activeSection: string;
}

export function MobileMenu({
  open,
  onClose,
  links,
  onNavigate,
  activeSection,
}: MobileMenuProps) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-6 text-foreground p-2"
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </button>

          <nav className="flex flex-col items-center gap-8">
            {links.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  delay: i * TIMING.MENU_STAGGER,
                  duration: 0.3,
                }}
                onClick={() => onNavigate(link.href)}
                className={cn(
                  'font-mono text-2xl transition-colors',
                  activeSection === link.href
                    ? 'text-terminal-green'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </motion.button>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
