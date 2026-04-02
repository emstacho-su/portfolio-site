'use client';

import { useState, useEffect, useCallback } from 'react';
import { TIMING } from '@/lib/animation';

interface UseTypingAnimationOptions {
  text: string;
  speed?: number;
  startDelay?: number;
}

interface UseTypingAnimationReturn {
  displayText: string;
  isTyping: boolean;
  cursorVisible: boolean;
  isComplete: boolean;
}

export function useTypingAnimation({
  text,
  speed = TIMING.HERO_TYPING_SPEED,
  startDelay = 800,
}: UseTypingAnimationOptions): UseTypingAnimationReturn {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      setIsComplete(true);
      setIsTyping(false);
      return;
    }

    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, startDelay, prefersReducedMotion]);

  // Blinking cursor
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, []);

  return { displayText, isTyping, cursorVisible, isComplete };
}
