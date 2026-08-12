// Evan's vectorized monogram (Downloads/Logo cleanup and vectorization,
// sk-logo-primary variant, 2026-08-12). Inlined so the colors track the
// theme tokens explicitly instead of the export's hardcoded hexes: the
// linework inherits currentColor (foreground ink normally, and the parent
// link's hover turns the whole mark crimson), while the top and bottom
// rails are pinned to the accent token, matching the export's #B81E33.
interface SkLogoProps {
  className?: string;
}

export function SkLogo({ className }: SkLogoProps) {
  return (
    <svg
      viewBox="18 13 364 174"
      fill="none"
      strokeLinecap="butt"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="9">
        <path d="M140 20 L40 76" />
        <path d="M40 76 L136 102" />
        <path d="M136 102 L40 180" />
        <path d="M140 20 L140 180" />
        <path d="M140 180 L200 20" />
        <path d="M200 20 L260 180" />
        <path d="M140 180 L260 20" />
        <path d="M260 20 L260 180" />
        <path d="M360 20 L264 100" />
        <path d="M264 100 L360 180" />
      </g>
      <g stroke="var(--accent)" strokeWidth="11">
        <path d="M20 20 L380 20" />
        <path d="M20 180 L380 180" />
      </g>
    </svg>
  );
}
