'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';

// Tab definitions. Counts are intentionally omitted here — the hero stat
// strip already shows the harness-wide numbers; duplicating them in the
// nav added 18 micro-elements to a single bar without new information.
export const TAB_DEFS = [
  { id: 'arch', num: '01', label: 'Architecture' },
  { id: 'hooks', num: '02', label: 'Hooks Pipeline' },
  { id: 'skills', num: '03', label: 'Skills Map' },
  { id: 'plugins', num: '04', label: 'Plugins & MCP' },
  { id: 'memory', num: '05', label: 'Memory Layer' },
  { id: 'gsd', num: '06', label: 'GSD Workflow' },
] as const;

export type HarnessTabId = (typeof TAB_DEFS)[number]['id'];

interface HarnessTabsProps {
  panels: Record<HarnessTabId, ReactNode>;
}

export function HarnessTabs({ panels }: HarnessTabsProps) {
  const [active, setActive] = useState<HarnessTabId>('arch');
  const buttonRefs = useRef<Map<HarnessTabId, HTMLButtonElement>>(new Map());

  const focusTab = useCallback((id: HarnessTabId) => {
    setActive(id);
    buttonRefs.current.get(id)?.focus();
  }, []);

  const handleKey = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      let nextIdx = idx;
      if (event.key === 'ArrowRight' || event.key === ']') {
        nextIdx = (idx + 1) % TAB_DEFS.length;
      } else if (event.key === 'ArrowLeft' || event.key === '[') {
        nextIdx = (idx - 1 + TAB_DEFS.length) % TAB_DEFS.length;
      } else if (event.key === 'Home') {
        nextIdx = 0;
      } else if (event.key === 'End') {
        nextIdx = TAB_DEFS.length - 1;
      } else {
        return;
      }
      event.preventDefault();
      focusTab(TAB_DEFS[nextIdx].id);
    },
    [focusTab]
  );

  return (
    <>
      <nav
        aria-label="Harness sections"
        className="sticky top-16 z-30 mt-10 mb-6"
      >
        <div
          role="tablist"
          aria-orientation="horizontal"
          className="flex gap-1 overflow-x-auto bg-background/85 backdrop-blur-md border border-hairline rounded-md p-1.5 shadow-sm"
        >
          {TAB_DEFS.map((tab, idx) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) buttonRefs.current.set(tab.id, el);
                }}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => setActive(tab.id)}
                onKeyDown={(event) => handleKey(event, idx)}
                className={`flex items-baseline gap-2 whitespace-nowrap px-3 py-2 rounded font-mono text-xs tracking-wide transition-colors duration-150 ${
                  isActive
                    ? 'bg-surface text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface/60'
                }`}
              >
                <span className="font-semibold">{tab.num}.</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {TAB_DEFS.map((tab) => (
        <section
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          className="pt-2 pb-12"
        >
          {panels[tab.id]}
        </section>
      ))}
    </>
  );
}
