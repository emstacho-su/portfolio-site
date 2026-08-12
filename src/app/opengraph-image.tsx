import { ImageResponse } from 'next/og';
import {
  SK_VIEWBOX,
  SK_INK_PATHS,
  SK_RAIL_PATHS,
  SK_INK_STROKE,
  SK_RAIL_STROKE,
} from '@/components/navigation/sk-logo';

// Social preview card (PORTFOLIO_BRIEF.md §6.1): cream background, the SK
// monogram (replacing the bare accent rule, 2026-08-12), name large,
// positioning line beneath, domain at the bottom. Literal token hexes;
// ImageResponse cannot read CSS variables.

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt =
  'Evan Stachowiak. I build AI systems with a ground-truth understanding of how real operations work. estachowiak.dev';

// Positioning line, verbatim from the approved hero copy (D-08 / brief §9.1).
const TAGLINE =
  'I build AI systems with a ground-truth understanding of how real operations work';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#efebe3',
          padding: '80px',
          position: 'relative',
        }}
      >
        <svg
          width="150"
          height="72"
          viewBox={SK_VIEWBOX}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="round"
          style={{ marginBottom: 44 }}
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
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          Evan Stachowiak
        </div>
        <div
          style={{
            fontSize: 34,
            color: '#5c5853',
            marginTop: 30,
            maxWidth: 940,
            lineHeight: 1.4,
          }}
        >
          {TAGLINE}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 80,
            fontSize: 26,
            color: '#67625a',
          }}
        >
          estachowiak.dev
        </div>
      </div>
    ),
    size
  );
}
