'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useBootMarkReady } from '@/lib/boot-context';

// === Session keys ===
// Loader plays once per browser session (matches LoadupSequence behavior).
const LOADER_SESSION_KEY = 'es-hero-loader-played-v1';
// Pre-set this so HeroSection's CompileSequence skips its typewriter
// (avoids the name being "stamped" then re-typed). Defined in src/components/sections/hero.tsx.
const HERO_COMPILE_SESSION_KEY = 'es-compile-played-v1';

// =====================================================================
// TIMING (seconds) — adjust freely, each phase is isolated.
// =====================================================================
const PHASE_1_PRELOAD_DUR = 0.9; // dark + indicator bar fill
const PHASE_2_SWEEP_DUR = 0.75; // parted-curtain reveal
const PHASE_3_DROP_DUR = 0.32; // name slams in (heavy ease.in)
const PHASE_4_FADE_DUR = 0.5; // loader exits
const PHASE_4_DELAY = 0.3; // breath after stamp lands

// =====================================================================
// EASING — tweak these to change the feel without restructuring code.
// Tip: import { CustomEase } from 'gsap/CustomEase' for bespoke curves.
// =====================================================================
const EASE_PRELOAD = 'power2.inOut';
const EASE_SWEEP = 'expo.inOut';
const EASE_DROP = 'power4.in'; // heavy descent → impact
const EASE_FLASH_OUT = 'power3.out';
const EASE_FADE = 'power3.inOut';

const NAME = 'EVAN STACHOWIAK';

export function HeroLoader() {
  // null = deciding, true = play, false = skip / done
  const [show, setShow] = useState<boolean | null>(null);
  const markReady = useBootMarkReady();
  const rootRef = useRef<HTMLDivElement>(null);

  // Decide whether to play the sequence on mount.
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const alreadyPlayed = sessionStorage.getItem(LOADER_SESSION_KEY);

    if (reduced || alreadyPlayed) {
      // Skip path: also pre-mark hero compile so it shows static state.
      sessionStorage.setItem(HERO_COMPILE_SESSION_KEY, '1');
      setShow(false);
      markReady();
      return;
    }
    sessionStorage.setItem(LOADER_SESSION_KEY, '1');
    setShow(true);
  }, [markReady]);

  // Allow keyboard skip during phases 1–2 (don't break the impact moment).
  useEffect(() => {
    if (show !== true) return;
    const skip = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      sessionStorage.setItem(HERO_COMPILE_SESSION_KEY, '1');
      setShow(false);
      markReady();
    };
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, [show, markReady]);

  // GSAP timeline — built once when show flips true.
  // useGSAP auto-cleans up via scope on unmount.
  useGSAP(
    () => {
      if (show !== true) return;
      let killed = false;

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          // Hand-off: ensure hero typewriter is skipped, then unmount + boot ready.
          sessionStorage.setItem(HERO_COMPILE_SESSION_KEY, '1');
          setShow(false);
          markReady();
        },
      });

      // ===== Initial states =====
      tl.set('.hl-bar', { scaleX: 0, transformOrigin: 'left center' })
        .set('.hl-caption', { opacity: 0, y: 4 })
        .set('.hl-name', {
          opacity: 0,
          scale: 1.8,
          yPercent: -10,
          filter: 'blur(6px)',
          transformOrigin: 'center center',
        })
        .set('.hl-rule', { scaleX: 0, transformOrigin: 'left center' })
        .set('.hl-flash', { opacity: 0 });

      // =====================================================================
      // PHASE 1 — Pre-loader (dark + minimal indicator)
      // =====================================================================
      tl.to('.hl-caption', {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
      })
        .to(
          '.hl-bar',
          { scaleX: 1, duration: PHASE_1_PRELOAD_DUR, ease: EASE_PRELOAD },
          '<'
        )
        .to(
          '.hl-caption',
          { opacity: 0, duration: 0.18, ease: 'power2.in' },
          '>-0.05'
        );

      // =====================================================================
      // PHASE 2 — Parted-curtain sweep (dark splits, cream stage exposed)
      // =====================================================================
      tl.to(
        '.hl-curtain-top',
        { yPercent: -100, duration: PHASE_2_SWEEP_DUR, ease: EASE_SWEEP },
        '+=0.05'
      ).to(
        '.hl-curtain-bottom',
        { yPercent: 100, duration: PHASE_2_SWEEP_DUR, ease: EASE_SWEEP },
        '<'
      );

      // =====================================================================
      // PHASE 3 — Punch-press stamp (drop → impact → settle)
      // =====================================================================
      // Heavy descent: starts slow, accelerates into impact.
      tl.to(
        '.hl-name',
        {
          scale: 1,
          opacity: 1,
          yPercent: 0,
          filter: 'blur(0px)',
          duration: PHASE_3_DROP_DUR,
          ease: EASE_DROP,
        },
        '-=0.08'
      );

      // === IMPACT MOMENT — labeled so all impact effects start in sync. ===
      tl.addLabel('impact');

      // White flash (very short — 40ms in, 220ms out).
      tl.to('.hl-flash', { opacity: 0.7, duration: 0.04 }, 'impact').to(
        '.hl-flash',
        { opacity: 0, duration: 0.22, ease: EASE_FLASH_OUT },
        'impact+=0.04'
      );

      // Camera shake on the cream stage — 4 quick jolts decaying to rest.
      tl.to(
        '.hl-stage',
        {
          keyframes: {
            x: [-6, 5, -3, 2, 0],
            y: [4, -3, 2, -1, 0],
          },
          duration: 0.32,
          ease: 'power1.out',
        },
        'impact'
      );

      // Name overshoot pulse (1 → 1.04 → 1) — implies elastic recoil.
      tl.to(
        '.hl-name',
        {
          scale: 1.04,
          duration: 0.08,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        },
        'impact'
      );

      // Crimson rule draws under name (signature mark).
      tl.to(
        '.hl-rule',
        { scaleX: 1, duration: 0.45, ease: 'power3.out' },
        'impact+=0.05'
      );

      // =====================================================================
      // PHASE 4 — Hand-off (fade + slight upward slide)
      // =====================================================================
      // Drop pointer-events first so user can interact during the fade.
      tl.set(rootRef.current, { pointerEvents: 'none' }, `+=${PHASE_4_DELAY}`)
        .to('.hl-stage', {
          opacity: 0,
          y: -16,
          duration: PHASE_4_FADE_DUR,
          ease: EASE_FADE,
        });

      // Wait for fonts before kicking off — avoids stamping with fallback font.
      // If document.fonts isn't available (very old browsers), play immediately.
      const fontsReady = (document as Document & {
        fonts?: { ready: Promise<unknown> };
      }).fonts?.ready;
      if (fontsReady) {
        fontsReady.then(() => {
          if (!killed) tl.play();
        });
      } else {
        tl.play();
      }

      // useGSAP auto-kills tl on unmount via scope, but cover the
      // fonts-ready race condition explicitly.
      return () => {
        killed = true;
      };
    },
    { scope: rootRef, dependencies: [show] }
  );

  if (show !== true) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: 'auto' }}
    >
      {/* ============================================================
          Cream stage — sits beneath the dark curtain, exposed in phase 2.
          Holds the stamped name + rule. Fades out in phase 4.
          ============================================================ */}
      <div
        className="hl-stage absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: '#EFEBE3' }}
      >
        {/* Faint static grid — visual placeholder until the real HeroGrid is exposed. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: 0.55,
            backgroundImage:
              'linear-gradient(to right, rgba(26,26,26,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,26,26,0.10) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Stamped name + crimson rule */}
        <div className="relative px-6 text-center">
          <h1
            className="hl-name font-mono font-bold text-foreground will-change-transform"
            style={{
              fontSize: 'clamp(2.25rem, 8vw, 6rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {NAME}
          </h1>
          <div
            className="hl-rule mt-4 h-[2px] mx-auto bg-crimson"
            style={{ width: 'clamp(6rem, 18vw, 12rem)' }}
            aria-hidden="true"
          />
        </div>

        {/* White flash overlay — pulses on impact moment. */}
        <div
          className="hl-flash absolute inset-0 bg-white pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* ============================================================
          Dark curtain — split top/bottom, parts in phase 2.
          Top half holds the pre-loader indicator (phase 1).
          ============================================================ */}
      <div className="hl-curtain-top absolute inset-x-0 top-0 h-1/2 bg-[#0A0A0A] flex items-end justify-center pb-10">
        <div className="flex flex-col items-center gap-3">
          <div
            aria-hidden="true"
            className="relative h-[2px] w-[140px] overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <div className="hl-bar absolute inset-y-0 left-0 right-0 bg-crimson" />
          </div>
          <span
            className="hl-caption font-mono text-[11px] uppercase"
            style={{
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.3em',
            }}
          >
            loading
          </span>
        </div>
      </div>
      <div className="hl-curtain-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#0A0A0A]" />
    </div>
  );
}
