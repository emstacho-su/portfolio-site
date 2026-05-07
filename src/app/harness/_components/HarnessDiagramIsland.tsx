'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'motion/react';
import { useBootReady } from '@/lib/boot-context';
import { LayerCardList } from './LayerCardList';
import type { HarnessLayer } from '@/data/harness';

// next/dynamic with ssr:false must live inside a Client Component (Next 16
// rejects ssr:false in Server Components). The dynamic boundary keeps the
// interactive diagram out of the initial client bundle until it's actually
// rendered.
const ArchitectureDiagram = dynamic(
  () =>
    import('./ArchitectureDiagram').then((mod) => ({
      default: mod.ArchitectureDiagram,
    })),
  { ssr: false, loading: () => null }
);

interface HarnessDiagramIslandProps {
  layers: HarnessLayer[];
}

// Progressive enhancement gate. The static <LayerCardList> always renders in
// the SSG output (T2a) and is what visitors with JS disabled or reduced-motion
// preferred will see. Once boot is ready and reduced-motion is not preferred,
// the interactive diagram replaces the list.
export function HarnessDiagramIsland({ layers }: HarnessDiagramIslandProps) {
  const ready = useBootReady();
  const reduce = useReducedMotion();
  const showInteractive = ready && reduce !== true;

  if (!showInteractive) {
    return <LayerCardList layers={layers} />;
  }

  return <ArchitectureDiagram layers={layers} />;
}
