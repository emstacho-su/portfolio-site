import { ImageResponse } from 'next/og';
import {
  SK_VIEWBOX,
  SK_INK_PATHS,
  SK_RAIL_PATHS,
  SK_INK_STROKE,
  SK_RAIL_STROKE,
} from '@/components/navigation/sk-logo';

// Favicon: the SK monogram on a paper tile (replaces the old favicon.ico).
// Literal token hexes; ImageResponse cannot read CSS variables.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#efebe3',
        }}
      >
        <svg
          width="30"
          height="14"
          viewBox={SK_VIEWBOX}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="round"
        >
          <g stroke="#1a1a1a" strokeWidth={SK_INK_STROKE}>
            {SK_INK_PATHS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g stroke="#b81e33" strokeWidth={SK_RAIL_STROKE}>
            {SK_RAIL_PATHS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </svg>
      </div>
    ),
    size
  );
}
