'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface HeroGridProps {
  interactive: boolean;
  className?: string;
}

interface CellMeta {
  row: number;
  col: number;
  max: number;
}

interface CellLive {
  intensity: number;
  lastSeen: number;
}

const CELL_SIZE = 40;
const TRAIL_RADIUS = 2;
const FADE_MS = 250;
const CENTER_FULL_PCT = 0.2;
const ACCENT_RGB = '215, 38, 61';
const LINE_COLOR = 'rgba(26, 26, 26, 0.10)';

export function HeroGrid({ interactive, className }: HeroGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ cols: 0, rows: 0, w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setDims({
        cols: Math.ceil(r.width / CELL_SIZE),
        rows: Math.ceil(r.height / CELL_SIZE),
        w: r.width,
        h: r.height,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cellsMeta = useMemo<CellMeta[]>(() => {
    if (!dims.cols || !dims.rows) return [];
    const cx = dims.w / 2;
    const cy = dims.h / 2;
    const minDim = Math.min(dims.w, dims.h);
    const fullRadius = minDim * CENTER_FULL_PCT;
    const maxRadius = Math.hypot(cx, cy);
    const meta: CellMeta[] = [];
    for (let r = 0; r < dims.rows; r++) {
      for (let c = 0; c < dims.cols; c++) {
        const x = c * CELL_SIZE + CELL_SIZE / 2;
        const y = r * CELL_SIZE + CELL_SIZE / 2;
        const d = Math.hypot(x - cx, y - cy);
        let max: number;
        if (d <= fullRadius) {
          max = 1;
        } else if (d >= maxRadius) {
          max = 0;
        } else {
          max = 1 - (d - fullRadius) / (maxRadius - fullRadius);
        }
        meta.push({ row: r, col: c, max });
      }
    }
    return meta;
  }, [dims]);

  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plusRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const liveRef = useRef<CellLive[]>([]);
  const cursorRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    cellRefs.current = new Array(cellsMeta.length).fill(null);
    plusRefs.current = new Array(cellsMeta.length).fill(null);
    liveRef.current = cellsMeta.map(() => ({ intensity: 0, lastSeen: 0 }));
  }, [cellsMeta]);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!interactive || reducedRef.current) return;
    const el = containerRef.current;
    if (!el) return;

    const updateCursorFromEvent = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      cursorRef.current = { x, y, active: inside };
      if (inside) ensureLoop();
    };

    const onMove = (e: PointerEvent) => updateCursorFromEvent(e);
    const onDown = (e: PointerEvent) => updateCursorFromEvent(e);
    const onLeaveWindow = () => {
      cursorRef.current.active = false;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointercancel', onLeaveWindow);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointercancel', onLeaveWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, dims.cols, dims.rows]);

  const ensureLoop = () => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(loop);
  };

  const loop = (now: number) => {
    rafRef.current = null;
    const cursor = cursorRef.current;
    const live = liveRef.current;
    const cols = dims.cols;
    const rows = dims.rows;
    let anyActive = false;

    if (cursor.active && cols > 0 && rows > 0) {
      const cc = Math.floor(cursor.x / CELL_SIZE);
      const cr = Math.floor(cursor.y / CELL_SIZE);
      for (let dr = -TRAIL_RADIUS; dr <= TRAIL_RADIUS; dr++) {
        for (let dc = -TRAIL_RADIUS; dc <= TRAIL_RADIUS; dc++) {
          const r = cr + dr;
          const c = cc + dc;
          if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
          const d = Math.hypot(dr, dc);
          if (d > TRAIL_RADIUS) continue;
          const idx = r * cols + c;
          const meta = cellsMeta[idx];
          if (!meta) continue;
          const falloff = Math.max(0, 1 - d / (TRAIL_RADIUS + 0.3));
          const target = meta.max * falloff;
          const cell = live[idx];
          const elapsed = now - cell.lastSeen;
          const effective = elapsed >= FADE_MS ? 0 : cell.intensity * (1 - elapsed / FADE_MS);
          if (target > effective) {
            cell.intensity = target;
            cell.lastSeen = now;
          }
        }
      }
    }

    for (let i = 0; i < live.length; i++) {
      const cell = live[i];
      if (cell.intensity <= 0) continue;
      const elapsed = now - cell.lastSeen;
      let display: number;
      if (elapsed >= FADE_MS) {
        display = 0;
        cell.intensity = 0;
      } else {
        display = cell.intensity * (1 - elapsed / FADE_MS);
      }
      const el = cellRefs.current[i];
      const plus = plusRefs.current[i];
      if (el) {
        el.style.backgroundColor = display > 0.005 ? `rgba(${ACCENT_RGB}, ${display})` : '';
      }
      if (plus) {
        plus.style.opacity = display > 0.005 ? String(Math.min(1, display * 2)) : '0';
      }
      if (display > 0.005) anyActive = true;
    }

    if (anyActive || cursor.active) {
      rafRef.current = requestAnimationFrame(loop);
    }
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundImage: `linear-gradient(to right, ${LINE_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${LINE_COLOR} 1px, transparent 1px)`,
        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
      }}
    >
      {cellsMeta.map((m, i) => (
        <div
          key={i}
          ref={(el) => {
            cellRefs.current[i] = el;
          }}
          style={{
            position: 'absolute',
            left: m.col * CELL_SIZE,
            top: m.row * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        >
          <span
            ref={(el) => {
              plusRefs.current[i] = el;
            }}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -7,
              left: -7,
              width: 14,
              height: 14,
              opacity: 0,
              color: `rgb(${ACCENT_RGB})`,
              pointerEvents: 'none',
              lineHeight: 0,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              width="14"
              height="14"
            >
              <path d="M7 2v10M2 7h10" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
}
