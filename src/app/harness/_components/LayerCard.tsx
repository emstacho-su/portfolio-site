import type { HarnessLayer } from '@/data/harness';

interface LayerCardProps {
  layer: HarnessLayer;
}

export function LayerCard({ layer }: LayerCardProps) {
  return (
    <li
      role="listitem"
      className="grid grid-cols-[60px_1fr] gap-x-6 py-6 border-b border-hairline last:border-b-0"
    >
      <span
        className="font-mono text-sm text-muted-foreground self-start pt-1 tabular-nums"
        aria-hidden="true"
      >
        {String(layer.index).padStart(2, '0')}
      </span>

      <div className="flex flex-col gap-2">
        <h3 className="font-sans font-semibold text-foreground">
          {layer.name}
        </h3>

        <p className="text-foreground/85 leading-relaxed max-w-[64ch]">
          {layer.oneLiner}
        </p>

        <ul className="flex flex-wrap gap-1.5 mt-1" aria-label={`${layer.name} tooling`}>
          {layer.badges.map((badge) => (
            <li
              key={badge}
              className="font-mono text-[10px] tracking-wide px-2 py-1 border border-hairline text-muted-foreground"
            >
              {badge}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
