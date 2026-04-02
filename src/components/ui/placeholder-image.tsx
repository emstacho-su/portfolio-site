'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  label: string;
  className?: string;
}

export function PlaceholderImage({ label, className }: PlaceholderImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div
      ref={ref}
      className={cn(
        'bg-surface border-b border-border flex items-center justify-center aspect-video relative overflow-hidden',
        className
      )}
      role="img"
      aria-label={`Screenshot placeholder for ${label}`}
    >
      <div className="text-center px-4 relative z-10">
        <p className="font-mono text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
          1200 x 800
        </p>
      </div>

      {/* Scan-line sweep on scroll reveal */}
      {isInView && (
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '200%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-terminal-green/8 to-transparent pointer-events-none"
        />
      )}
    </div>
  );
}
