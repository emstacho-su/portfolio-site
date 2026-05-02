'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ThermodynamicGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Grid density in pixels per cell. Lower = chunky, Higher = smooth.
   * Default: 20
   */
  resolution?: number;
  /**
   * Cooling rate per frame (0..1). Higher = trails fade faster.
   * Default: 0.94
   */
  coolingFactor?: number;
  /**
   * Brush radius in cells. Default: 2
   */
  brushRadius?: number;
  /**
   * Gate cursor heat injection (matches HeroGrid interactive gating).
   * Default: true
   */
  interactive?: boolean;
}

// Paper palette (matches globals.css editorial tokens)
const PAPER_R = 239;
const PAPER_G = 235;
const PAPER_B = 227;

// Crimson accent (#D7263D)
const ACCENT_R = 215;
const ACCENT_G = 38;
const ACCENT_B = 61;

// Cold dot color (border-hairline #D8D3C8)
const COLD_DOT = '#D8D3C8';

const ThermodynamicGrid = ({
  className,
  resolution = 20,
  coolingFactor = 0.94,
  brushRadius = 2,
  interactive = true,
  style,
  ...props
}: ThermodynamicGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef(interactive);

  useEffect(() => {
    interactiveRef.current = interactive;
  }, [interactive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let grid: Float32Array = new Float32Array(0);
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    const mouse = {
      x: -10000,
      y: -10000,
      prevX: -10000,
      prevY: -10000,
      active: false,
      hasPrev: false,
    };

    let rafId: number | null = null;

    // Lerp paper -> crimson on temperature t (0..1)
    const thermalFill = (t: number): string => {
      // Ease so cold stays clean, heat ramps fast
      const k = t * t;
      const r = Math.round(PAPER_R + (ACCENT_R - PAPER_R) * k);
      const g = Math.round(PAPER_G + (ACCENT_G - PAPER_G) * k);
      const b = Math.round(PAPER_B + (ACCENT_B - PAPER_B) * k);
      return `rgb(${r}, ${g}, ${b})`;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / resolution);
      rows = Math.ceil(height / resolution);
      grid = new Float32Array(cols * rows);
      paint();
    };

    const handleMove = (e: PointerEvent) => {
      if (!interactiveRef.current || reduceMotion) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

      if (!inside) {
        mouse.active = false;
        mouse.hasPrev = false;
        return;
      }

      // Reset prev on re-entry to avoid streak across the canvas
      if (!mouse.active || !mouse.hasPrev) {
        mouse.prevX = x;
        mouse.prevY = y;
        mouse.hasPrev = true;
      } else {
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.active = true;
      ensureLoop();
    };

    const handleLeaveWindow = () => {
      mouse.active = false;
      mouse.hasPrev = false;
    };

    const injectHeat = () => {
      if (!mouse.active) return;
      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.ceil(dist / (resolution / 2)));

      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = mouse.prevX + dx * t;
        const py = mouse.prevY + dy * t;
        const col = Math.floor(px / resolution);
        const row = Math.floor(py / resolution);

        for (let i = -brushRadius; i <= brushRadius; i++) {
          for (let j = -brushRadius; j <= brushRadius; j++) {
            const c = col + i;
            const r = row + j;
            if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
            const d = Math.sqrt(i * i + j * j);
            if (d > brushRadius) continue;
            const idx = c + r * cols;
            const falloff = 1 - d / brushRadius;
            grid[idx] = Math.min(1, grid[idx] + 0.35 * falloff);
          }
        }
      }
      // Mark prev consumed; next move event will set prev = current
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    };

    const paint = () => {
      // Paper backdrop
      ctx.fillStyle = `rgb(${PAPER_R}, ${PAPER_G}, ${PAPER_B})`;
      ctx.fillRect(0, 0, width, height);

      let anyActive = false;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = c + r * cols;
          const temp = grid[idx];

          // Cool toward zero
          if (temp > 0) {
            grid[idx] = temp * coolingFactor;
            if (grid[idx] < 0.001) grid[idx] = 0;
          }

          if (temp > 0.04) {
            anyActive = true;
            const x = c * resolution;
            const y = r * resolution;
            const size = resolution * (0.55 + temp * 0.55);
            const offset = (resolution - size) / 2;
            ctx.fillStyle = thermalFill(temp);
            ctx.fillRect(x + offset, y + offset, size, size);
          } else {
            // Cold structure: subtle hairline dot every other cell
            if (c % 2 === 0 && r % 2 === 0) {
              const x = c * resolution;
              const y = r * resolution;
              ctx.fillStyle = COLD_DOT;
              ctx.fillRect(x + resolution / 2 - 0.5, y + resolution / 2 - 0.5, 1, 1);
            }
          }
        }
      }

      return anyActive;
    };

    const tick = () => {
      rafId = null;
      injectHeat();
      const active = paint();
      if (active || mouse.active) {
        ensureLoop();
      }
    };

    const ensureLoop = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    if (!reduceMotion) {
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerdown', handleMove);
      window.addEventListener('pointercancel', handleLeaveWindow);
      window.addEventListener('blur', handleLeaveWindow);
    }

    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleMove);
      window.removeEventListener('pointercancel', handleLeaveWindow);
      window.removeEventListener('blur', handleLeaveWindow);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [resolution, coolingFactor, brushRadius]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('absolute inset-0 z-0 overflow-hidden pointer-events-none', className)}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default ThermodynamicGrid;
