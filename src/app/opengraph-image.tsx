import { ImageResponse } from 'next/og';

// Social preview card (PORTFOLIO_BRIEF.md §6.1): cream background, name large,
// positioning line beneath, crimson accent rule, domain at the bottom.
// Rendered with satori's bundled sans for now; General Sans / JetBrains Mono
// get wired in once the fonts are self-hosted (Phase 2).

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
        <div
          style={{
            width: 110,
            height: 6,
            backgroundColor: '#b81e33',
            marginBottom: 44,
          }}
        />
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
