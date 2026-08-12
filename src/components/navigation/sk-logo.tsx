// Evan's vectorized monogram (Downloads/Logo cleanup and vectorization,
// sk-logo-primary variant, 2026-08-12). Path data is exported so the
// favicon (app/icon.tsx) and social card (app/opengraph-image.tsx) render
// the same mark without duplicating geometry; those runtimes need literal
// colors, while this component binds to theme tokens: linework inherits
// currentColor (foreground ink normally, and the parent link's hover turns
// the whole mark crimson), rails pin to the accent token, matching the
// export's #B81E33.
export const SK_VIEWBOX = '18 13 364 174';

export const SK_INK_PATHS = [
  'M140 20 L40 76',
  'M40 76 L136 102',
  'M136 102 L40 180',
  'M140 20 L140 180',
  'M140 180 L200 20',
  'M200 20 L260 180',
  'M140 180 L260 20',
  'M260 20 L260 180',
  'M360 20 L264 100',
  'M264 100 L360 180',
] as const;

export const SK_RAIL_PATHS = ['M20 20 L380 20', 'M20 180 L380 180'] as const;

export const SK_INK_STROKE = 9;
export const SK_RAIL_STROKE = 11;

interface SkLogoProps {
  className?: string;
}

export function SkLogo({ className }: SkLogoProps) {
  return (
    <svg
      viewBox={SK_VIEWBOX}
      fill="none"
      strokeLinecap="butt"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <g stroke="currentColor" strokeWidth={SK_INK_STROKE}>
        {SK_INK_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g stroke="var(--accent)" strokeWidth={SK_RAIL_STROKE}>
        {SK_RAIL_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
