'use client';

import { useCallback } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useLenis } from 'lenis/react';
// lucide dropped its brand icons (Github/Linkedin), so the socials use
// generic glyphs: repo folder for GitHub, briefcase for LinkedIn.
import {
  X,
  Mail,
  FolderGit2,
  Briefcase,
  Phone,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CONTACT_ITEMS, type ContactItem } from '@/data/contact';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ICONS: Record<ContactItem['kind'], typeof Mail> = {
  email: Mail,
  github: FolderGit2,
  linkedin: Briefcase,
  phone: Phone,
};

const CAPTIONS: Record<ContactItem['kind'], string> = {
  email: 'Email',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  phone: 'Phone',
};

/**
 * Contact pop-up (Evan, 2026-08-13): the nav's Contact action opens this
 * dialog with the addresses as explicit links, replacing the old snap to the
 * footer — the footer is copyright-only now and the ribbon strip is
 * aria-hidden, so this is where contact info is actually actionable. Built on
 * Base UI Dialog for the same reasons as ProjectPopout (focus trap, ESC,
 * scroll lock, focus return; the mobile-menu pattern lacks a focus trap).
 * Lenis pauses while open so smooth scroll cannot fight the body lock.
 */
export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const lenis = useLenis();

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      onOpenChange(nextOpen);
      if (nextOpen) {
        lenis?.stop();
      } else {
        lenis?.start();
      }
    },
    [lenis, onOpenChange]
  );

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-background/85 backdrop-blur-sm" />
        <Dialog.Viewport
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain p-6"
        >
          <Dialog.Popup
            className={cn(
              'w-full max-w-md bg-background border border-hairline rounded-lg',
              'shadow-lg outline-none p-8'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <Dialog.Title className="font-sans font-bold text-2xl text-foreground tracking-tight">
                  Contact
                </Dialog.Title>
                <div className="h-[2px] bg-crimson mt-3 w-16" aria-hidden="true" />
              </div>
              <Dialog.Close
                aria-label="Close contact"
                className={cn(
                  'rounded-md p-2 -mr-2 -mt-2 text-foreground/70 transition-colors',
                  'hover:text-crimson focus-visible:outline-none',
                  'focus-visible:ring-2 focus-visible:ring-crimson/50'
                )}
              >
                <X size={20} />
              </Dialog.Close>
            </div>

            <ul className="mt-7 space-y-2">
              {CONTACT_ITEMS.map((item) => {
                const Icon = ICONS[item.kind];
                const external = item.href.startsWith('http');
                return (
                  <li key={item.kind}>
                    <a
                      href={item.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'group flex items-center gap-4 rounded-md border border-transparent px-3 py-3',
                        'transition-colors hover:border-hairline hover:bg-surface'
                      )}
                    >
                      <Icon
                        size={18}
                        className="shrink-0 text-crimson"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-tertiary">
                          {CAPTIONS[item.kind]}
                        </span>
                        <span className="block truncate text-sm text-foreground group-hover:text-crimson transition-colors">
                          {item.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-foreground/30 transition-all group-hover:text-crimson group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
