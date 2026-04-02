'use client';

import { MotionConfig } from 'motion/react';
import { useReducedMotion } from 'motion/react';

interface AnimationProviderProps {
  children: React.ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion={shouldReduceMotion ? 'always' : 'never'}>
      {children}
    </MotionConfig>
  );
}
