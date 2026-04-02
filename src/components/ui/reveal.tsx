'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { TIMING, EASE } from '@/lib/animation';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

const directionMap = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 30 },
  right: { x: -30 },
};

export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = TIMING.SECTION_REVEAL,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration, delay, ease: EASE.OUT }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
