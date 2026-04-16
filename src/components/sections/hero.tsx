'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { EASE } from '@/lib/animation';

const TAGLINE = 'From ISO audits to AI agents — I build the systems in between.';
const META = "SYRACUSE IMT '27 / ISO 9001 AUDITOR / AI-ENGINEERING";
const NAME_MONO = 'EVAN\nSTACHOWIAK';

const SESSION_KEY = 'es-compile-played-v1';
const LOADUP_KEY = 'es-loadup-played-v1';
const LOADUP_OFFSET_MS = 1400;

// Compile-sequence timing (spec §4), ms from compile start
const T_GRID = 400;
const T_UNDERLINE = 800;
const T_TYPE_START = 1200;
const T_CROSSFADE = 1700;
const T_TAGLINE = 1800;
const T_META_CTA = 2200;
const T_CURSOR = 2600;

const TYPE_INTERVAL_MS = 32;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [mounted, setMounted] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY);
    if (!reduced && !alreadyPlayed) {
      sessionStorage.setItem(SESSION_KEY, '1');
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client capability detection must happen post-mount
      setPlay(true);
    }
    setMounted(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-[78vh] flex flex-col items-center justify-center px-6 relative pt-16 overflow-hidden text-center"
    >
      {mounted && (
        <motion.div
          style={{ y, opacity }}
          className="relative w-full max-w-[1200px] mx-auto"
        >
          <CompileSequence play={play} />
        </motion.div>
      )}
    </section>
  );
}

interface CompileSequenceProps {
  play: boolean;
}

function CompileSequence({ play }: CompileSequenceProps) {
  // step 0 = nothing; 1 = grid; 2 = underline; 3 = name typing mono;
  // 4 = crossfade to sans; 5 = tagline; 6 = meta+cta; 7 = cursor + done
  const [step, setStep] = useState<number>(play ? 0 : 7);
  const [typed, setTyped] = useState<string>(play ? '' : NAME_MONO);
  const [skipped, setSkipped] = useState<boolean>(false);

  useEffect(() => {
    if (!play) return;

    const loadupWillPlay = !sessionStorage.getItem(LOADUP_KEY);
    const offset = loadupWillPlay ? LOADUP_OFFSET_MS : 0;

    const timers: number[] = [];
    let typeInterval: number | null = null;
    let cancelled = false;

    const startTyping = () => {
      let i = 0;
      typeInterval = window.setInterval(() => {
        i += 1;
        setTyped(NAME_MONO.slice(0, i));
        if (i >= NAME_MONO.length && typeInterval !== null) {
          window.clearInterval(typeInterval);
          typeInterval = null;
        }
      }, TYPE_INTERVAL_MS);
    };

    timers.push(window.setTimeout(() => setStep(1), T_GRID + offset));
    timers.push(window.setTimeout(() => setStep(2), T_UNDERLINE + offset));
    timers.push(
      window.setTimeout(() => {
        setStep(3);
        startTyping();
      }, T_TYPE_START + offset)
    );
    timers.push(window.setTimeout(() => setStep(4), T_CROSSFADE + offset));
    timers.push(window.setTimeout(() => setStep(5), T_TAGLINE + offset));
    timers.push(window.setTimeout(() => setStep(6), T_META_CTA + offset));
    timers.push(window.setTimeout(() => setStep(7), T_CURSOR + offset));

    const cleanup = () => {
      timers.forEach(window.clearTimeout);
      if (typeInterval !== null) {
        window.clearInterval(typeInterval);
        typeInterval = null;
      }
    };

    const onSkip = () => {
      if (cancelled) return;
      cancelled = true;
      cleanup();
      setSkipped(true);
      setTyped(NAME_MONO);
      setStep(7);
    };

    window.addEventListener('keydown', onSkip, { once: true });
    window.addEventListener('pointerdown', onSkip, { once: true });

    return () => {
      cancelled = true;
      cleanup();
      window.removeEventListener('keydown', onSkip);
      window.removeEventListener('pointerdown', onSkip);
    };
  }, [play]);

  const t = (duration: number) =>
    skipped
      ? { duration: 0 }
      : { duration, ease: EASE.OUT };

  return (
    <div className="relative">
      {/* Hairline grid — draws from top-left, settles at 6% opacity (spec §4.2) */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-x-12 -inset-y-20 bg-hairline-grid pointer-events-none"
        initial={false}
        animate={{
          opacity: step >= 1 ? 0.06 : 0,
          clipPath: step >= 1 ? 'inset(0 0% 0% 0)' : 'inset(0 100% 100% 0)',
        }}
        transition={t(0.4)}
      />

      <div className="relative">
        {/* Crimson underline draws L→R where the name will land (spec §4.3) */}
        <motion.div
          aria-hidden="true"
          className="h-[2px] bg-crimson origin-left mb-8 mx-auto"
          style={{ width: 'clamp(6rem, 18vw, 12rem)' }}
          initial={false}
          animate={{ scaleX: step >= 2 ? 1 : 0 }}
          transition={t(0.4)}
        />

        {/* Name: mono types in, then crossfades to sans (spec §4.4) */}
        <h1 className="relative leading-[0.95]">
          {/* Sans final — positioned, takes layout height */}
          <motion.span
            className="block font-sans font-bold text-foreground"
            initial={false}
            animate={{ opacity: step >= 4 ? 1 : 0 }}
            transition={t(0.25)}
          >
            EVAN
            <br />
            STACHOWIAK
          </motion.span>

          {/* Mono typewriter overlay — absolute on top, fades out at crossfade */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 block font-mono font-bold text-foreground whitespace-pre"
            initial={false}
            animate={{ opacity: step >= 3 && step < 4 ? 1 : 0 }}
            transition={t(0.2)}
          >
            {typed}
            {step === 3 && (
              <span className="cursor-blink inline-block w-[0.4em] h-[0.82em] bg-crimson align-baseline ml-1" />
            )}
          </motion.span>
        </h1>

        {/* Tagline with trailing blinking cursor (spec §4.5, §4.7) */}
        <motion.p
          className="mt-10 text-lg sm:text-xl md:text-2xl text-foreground max-w-[40rem] mx-auto prose-body"
          initial={false}
          animate={{
            opacity: step >= 5 ? 1 : 0,
            y: step >= 5 ? 0 : 8,
          }}
          transition={t(0.4)}
        >
          {TAGLINE}
          <span
            aria-hidden="true"
            className={`inline-block w-[2px] h-[1.05em] bg-crimson ml-1 align-middle ${
              step >= 7 ? 'cursor-blink' : 'opacity-0'
            }`}
          />
        </motion.p>

        {/* Meta line (spec §6.5) */}
        <motion.p
          className="mt-6 font-mono text-xs sm:text-sm text-tertiary tracking-widest uppercase"
          initial={false}
          animate={{ opacity: step >= 6 ? 1 : 0 }}
          transition={t(0.4)}
        >
          {META}
        </motion.p>

        {/* CTA: "Projects →" (spec §6.6) */}
        <motion.div
          className="mt-10"
          initial={false}
          animate={{ opacity: step >= 6 ? 1 : 0 }}
          transition={t(0.4)}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-sans text-base sm:text-lg text-crimson link-underline hover:text-crimson-hover transition-colors"
          >
            Projects
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
