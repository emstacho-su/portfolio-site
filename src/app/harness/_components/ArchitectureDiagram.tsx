'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { HarnessLayer } from '@/data/harness';

interface ArchitectureDiagramProps {
  layers: HarnessLayer[];
}

export function ArchitectureDiagram({ layers }: ArchitectureDiagramProps) {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const focusIndex = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(layers.length - 1, next));
    const el = itemRefs.current[clamped];
    if (el) el.focus();
  }, [layers.length]);

  const onItemKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLLIElement>, index: number) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusIndex(index + 1);
          return;
        case 'ArrowUp':
          event.preventDefault();
          focusIndex(index - 1);
          return;
        case 'Home':
          event.preventDefault();
          focusIndex(0);
          return;
        case 'End':
          event.preventDefault();
          focusIndex(layers.length - 1);
          return;
        case 'Escape':
          event.preventDefault();
          setActiveId(null);
          (event.currentTarget as HTMLLIElement).blur();
          return;
        default:
          return;
      }
    },
    [focusIndex, layers.length]
  );

  const active = layers.find((layer) => layer.id === activeId) ?? null;

  return (
    <div className="grid gap-8 mt-6 md:grid-cols-[1fr_minmax(280px,360px)] md:items-start">
      <ol
        role="list"
        aria-label="Harness architecture — interactive layer stack"
        className="border-y border-hairline"
      >
        {layers.map((layer, index) => {
          const isActive = layer.id === activeId;
          return (
            <li
              key={layer.id}
              ref={(el) => { itemRefs.current[index] = el; }}
              role="listitem"
              tabIndex={0}
              aria-label={`Layer ${layer.index}: ${layer.name}`}
              aria-current={isActive ? 'true' : undefined}
              onMouseEnter={() => setActiveId(layer.id)}
              onMouseLeave={() => setActiveId((current) => (current === layer.id ? null : current))}
              onFocus={() => setActiveId(layer.id)}
              onBlur={(event) => {
                const next = event.relatedTarget as Node | null;
                if (!next || !event.currentTarget.parentElement?.contains(next)) {
                  setActiveId((current) => (current === layer.id ? null : current));
                }
              }}
              onKeyDown={(event) => onItemKeyDown(event, index)}
              className="relative grid grid-cols-[44px_1fr] gap-x-4 px-4 py-5 border-b border-hairline last:border-b-0 cursor-default outline-none transition-colors duration-150 hover:bg-surface focus-visible:bg-surface"
            >
              {/* Crimson accent rail when active */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 bottom-0 w-[3px] origin-top transition-transform duration-150 bg-crimson ${
                  isActive ? 'scale-y-100' : 'scale-y-0'
                }`}
              />

              <span
                className={`font-mono text-sm self-start tabular-nums transition-colors duration-150 ${
                  isActive ? 'text-crimson font-semibold' : 'text-tertiary'
                }`}
                aria-hidden="true"
              >
                {String(layer.index).padStart(2, '0')}
              </span>

              <div>
                <h3 className="font-sans text-base font-semibold text-foreground">
                  {layer.name}
                </h3>
                <ul
                  className="flex flex-wrap gap-1.5 mt-2"
                  aria-label={`${layer.name} tooling`}
                >
                  {layer.badges.map((badge) => (
                    <li
                      key={badge}
                      className={`font-mono text-[10px] tracking-wide px-2 py-1 border transition-colors duration-150 ${
                        isActive
                          ? 'border-crimson text-foreground'
                          : 'border-hairline text-tertiary'
                      }`}
                    >
                      {badge}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Active-layer detail panel */}
      <aside
        role="region"
        aria-live="polite"
        aria-label="Layer details"
        className="md:sticky md:top-24 min-h-[160px] border-l border-hairline pl-6 hidden md:block"
      >
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -4 }}
              transition={reduce ? { duration: 0 } : { duration: 0.18, ease: [0, 0, 0.2, 1] }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-tertiary mb-2">
                Layer {String(active.index).padStart(2, '0')} · {active.subsystem}
              </p>
              <h4 className="font-sans text-lg font-semibold text-foreground mb-3">
                {active.name}
              </h4>
              <p className="text-sm text-foreground/85 leading-relaxed">
                {active.oneLiner}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.18 }}
              className="font-mono text-xs text-tertiary"
            >
              Hover or tab through a layer to read its description.
            </motion.p>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
