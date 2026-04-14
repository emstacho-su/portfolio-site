'use client';

import { motion } from 'motion/react';
import { useTypingAnimation } from '@/hooks/use-typing-animation';
import { EASE } from '@/lib/animation';
import { ChevronDown } from 'lucide-react';

const TAGLINE = 'Building systems that think, automate, and scale.';
const NAME = 'EVAN STACHOWIAK';

export function HeroSection() {
  const { displayText, cursorVisible } = useTypingAnimation({
    text: TAGLINE,
    speed: 45,
    startDelay: 1800,
  });

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
    >
      <div className="text-center max-w-3xl">
        {/* Name with per-letter glitch flicker */}
        <h1 className="font-mono text-4xl sm:text-5xl md:text-7xl text-foreground tracking-tight font-bold flex flex-wrap justify-center gap-x-[0.04em]">
          {NAME.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + i * 0.04,
                duration: 0.01,
                ease: 'linear',
              }}
              className="inline-block"
              style={{
                animationDelay: `${0.3 + i * 0.06}s`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        {/* Typing tagline */}
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

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-4 font-mono text-xs sm:text-sm text-muted-foreground tracking-widest uppercase"
        >
          Syracuse University // IMT // Information Security
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6, ease: EASE.OUT }}
          className="mt-10"
        >
          <button
            onClick={scrollToProjects}
            className="font-mono text-sm px-8 py-3 border border-crimson text-crimson
                       hover:bg-crimson hover:text-background transition-all duration-300
                       rounded-sm"
          >
            View My Work
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute bottom-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
