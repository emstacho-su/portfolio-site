'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { useTypingAnimation } from '@/hooks/use-typing-animation';
import { EASE } from '@/lib/animation';

const TAGLINE = 'Building systems that think, automate, and scale.';
const NAME = 'EVAN STACHOWIAK';

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Subtle parallax: hero content translates upward at 0.3x scroll speed
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { displayText, cursorVisible } = useTypingAnimation({
    text: TAGLINE,
    speed: 45,
    startDelay: 1800,
  });

  return (
    <section
      ref={ref}
      id="hero"
      className="min-h-[78vh] flex flex-col items-center justify-center px-6 relative pt-16 overflow-hidden"
    >
      <motion.div
        style={{ y, opacity }}
        className="text-center max-w-3xl"
      >
        <h1 className="font-mono text-4xl sm:text-5xl md:text-7xl text-foreground tracking-tight font-bold flex flex-wrap justify-center gap-x-[0.04em]">
          {NAME.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + i * 0.04,
                duration: 0.3,
                ease: EASE.OUT,
              }}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-6 h-8 flex items-center justify-center"
        >
          <span className="font-mono text-base sm:text-lg md:text-xl text-crimson">
            {displayText}
            <span
              className={`inline-block w-[2px] h-5 bg-crimson ml-0.5 align-middle transition-opacity ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-4 font-mono text-xs sm:text-sm text-muted-foreground tracking-widest uppercase"
        >
          Syracuse University // IMT // Information Security
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6, ease: EASE.OUT }}
          className="mt-10"
        >
          <Link
            href="/projects"
            className="inline-block font-mono text-sm px-8 py-3 border border-crimson text-crimson
                       hover:bg-crimson hover:text-background transition-all duration-300
                       rounded-sm"
          >
            View My Work
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
