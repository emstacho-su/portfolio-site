import { ImageResponse } from 'next/og';

export const alt = 'The harness behind the portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Stable .ttf URLs that satori (next/og) handles cleanly. GitHub raw
// is a build-time fetch only — never read at request time. If these
// network reads fail, fall back to system fonts so the build does
// not break.
const INTER_BOLD =
  'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.otf';
const JBM_REGULAR =
  'https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Regular.ttf';

const PAPER = '#EFEBE3';
const INK = '#1A1A1A';
const SECONDARY = '#5C5853';
const TERTIARY = '#8A857D';
const CRIMSON = '#D7263D';

async function fetchFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const [interBold, jbmRegular] = await Promise.all([
    fetchFont(INTER_BOLD),
    fetchFont(JBM_REGULAR),
  ]);

  const fonts: Array<{
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: 'normal';
  }> = [];
  if (interBold) {
    fonts.push({ name: 'Inter', data: interBold, weight: 700, style: 'normal' });
  }
  if (jbmRegular) {
    fonts.push({ name: 'JetBrains Mono', data: jbmRegular, weight: 400, style: 'normal' });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: PAPER,
          display: 'flex',
          flexDirection: 'column',
          padding: '88px',
          fontFamily: 'Inter',
          color: INK,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 22,
            color: TERTIARY,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Field Notes — 2026-05-07
        </div>

        <div
          style={{
            width: 96,
            height: 4,
            background: CRIMSON,
            marginTop: 36,
            marginBottom: 36,
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 86,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: 1024,
          }}
        >
          The harness behind the portfolio.
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 400,
            color: SECONDARY,
            lineHeight: 1.35,
            marginTop: 28,
            maxWidth: 880,
          }}
        >
          Ten layers, one localhost, and the bug that took two sessions to find.
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'JetBrains Mono',
            fontSize: 22,
            color: TERTIARY,
          }}
        >
          <div style={{ display: 'flex' }}>evanstachowiak.com / harness</div>
          <div style={{ display: 'flex' }}>est. 2026</div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    }
  );
}
