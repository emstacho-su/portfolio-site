import type { HarnessLayer } from '@/data/harness';
import { LayerCard } from './LayerCard';

interface LayerCardListProps {
  layers: HarnessLayer[];
}

// Static, server-rendered layer list. Always present in the SSG output —
// the client-side ArchitectureDiagram (T3) progressively enhances over this
// list once boot is ready and reduced-motion is not preferred.
export function LayerCardList({ layers }: LayerCardListProps) {
  return (
    <ol
      role="list"
      className="border-t border-hairline mt-6"
      aria-label="The 10 layers of the harness"
    >
      {layers.map((layer) => (
        <LayerCard key={layer.id} layer={layer} />
      ))}
    </ol>
  );
}
