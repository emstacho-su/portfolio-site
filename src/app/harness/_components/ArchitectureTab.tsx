'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { HarnessLayer } from '@/data/harness';

interface ArchitectureTabProps {
  layers: HarnessLayer[];
}

// Inline accordion. One layer open at a time — clicking a different layer
// collapses the previous. Replaces the hover-aside pattern from Phase 1.
export function ArchitectureTab({ layers }: ArchitectureTabProps) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const focusLayer = useCallback((id: string) => {
    triggerRefs.current.get(id)?.focus();
  }, []);

  const handleKey = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        const next = (idx + delta + layers.length) % layers.length;
        focusLayer(layers[next].id);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        focusLayer(layers[0].id);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        focusLayer(layers[layers.length - 1].id);
        return;
      }
      if (event.key === 'Escape' && openId) {
        event.preventDefault();
        setOpenId(null);
      }
    },
    [focusLayer, layers, openId]
  );

  const layerById = (id: string): HarnessLayer | undefined =>
    layers.find((l) => l.id === id);

  return (
    <div>
      <header className="mb-8">
        <h2 className="mb-3">Ten layers, host first.</h2>
        <p className="prose-body text-foreground/85 mt-3">
          Click a row to open its detail — files on disk and related layers.
        </p>
      </header>

      <ol
        role="list"
        aria-label="Harness layers"
        className="border-y border-hairline"
      >
        {layers.map((layer, idx) => {
          const isOpen = layer.id === openId;
          return (
            <li
              key={layer.id}
              className="border-b border-hairline last:border-b-0"
            >
              <button
                type="button"
                ref={(el) => {
                  if (el) triggerRefs.current.set(layer.id, el);
                }}
                aria-expanded={isOpen}
                aria-controls={`layer-detail-${layer.id}`}
                onClick={() => setOpenId(isOpen ? null : layer.id)}
                onKeyDown={(event) => handleKey(event, idx)}
                className="relative grid w-full grid-cols-[44px_1fr_auto] items-start gap-x-4 px-4 py-5 text-left outline-none transition-colors duration-150 hover:bg-surface focus-visible:bg-surface"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 bottom-0 w-[3px] origin-top transition-transform duration-150 bg-crimson ${
                    isOpen ? 'scale-y-100' : 'scale-y-0'
                  }`}
                />

                <span
                  className={`font-mono text-sm self-start tabular-nums transition-colors duration-150 ${
                    isOpen ? 'text-crimson font-semibold' : 'text-muted-foreground'
                  }`}
                  aria-hidden="true"
                >
                  {String(layer.index).padStart(2, '0')}
                </span>

                <div className="min-w-0">
                  <h3 className="font-sans text-base font-semibold text-foreground">
                    {layer.name}
                  </h3>
                  <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed">
                    {layer.oneLiner}
                  </p>
                  <ul
                    className="flex flex-wrap gap-1.5 mt-3"
                    aria-label={`${layer.name} tooling`}
                  >
                    {layer.badges.map((badge) => (
                      <li
                        key={badge}
                        className={`font-mono text-[10px] tracking-wide px-2 py-1 border transition-colors duration-150 ${
                          isOpen
                            ? 'border-crimson text-foreground'
                            : 'border-hairline text-muted-foreground'
                        }`}
                      >
                        {badge}
                      </li>
                    ))}
                  </ul>
                </div>

                <span
                  aria-hidden="true"
                  className={`font-mono text-xs text-muted-foreground self-start mt-1 transition-transform duration-150 ${
                    isOpen ? 'rotate-90 text-crimson' : ''
                  }`}
                >
                  ▶
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`layer-detail-${layer.id}`}
                    role="region"
                    aria-label={`${layer.name} detail`}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: 0.22, ease: [0, 0, 0.2, 1] }
                    }
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 px-4 pb-6 pt-1">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                          Detail · {layer.subsystem}
                        </p>
                        <p className="text-sm text-foreground/90 leading-relaxed max-w-[60ch]">
                          {layer.description}
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                            Files
                          </p>
                          <ul className="space-y-1">
                            {layer.files.map((file) => (
                              <li
                                key={file}
                                className="font-mono text-[11px] text-foreground/80 break-all"
                              >
                                {file}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {layer.related.length > 0 && (
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                              Related
                            </p>
                            <ul className="flex flex-wrap gap-1.5">
                              {layer.related.map((relId) => {
                                const rel = layerById(relId);
                                if (!rel) return null;
                                return (
                                  <li key={relId}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenId(rel.id);
                                        focusLayer(rel.id);
                                      }}
                                      className="font-mono text-[10px] tracking-wide px-2 py-1 border border-hairline text-muted-foreground hover:text-foreground hover:border-crimson transition-colors"
                                    >
                                      → {rel.name}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
