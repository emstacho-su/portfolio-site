import type { Metadata } from 'next';
import { generalSans, jetbrainsMono } from '@/lib/fonts';
import { AnimationProvider } from './providers/animation-provider';
import { LenisProvider } from './providers/lenis-provider';
import { SkipLink } from '@/components/ui/skip-link';
import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';
import { HeroLoader } from '@/components/fx/hero-loader';
import { BootProvider } from '@/lib/boot-context';
import './globals.css';

// First-person description, assembled only from approved copy: the hero
// tagline (D-08), the §3.2 positioning, and the §3.1 availability line.
// Voice: talking to the recruiter directly, not "Portfolio of ...".
const DESCRIPTION =
  'I build AI systems with a ground-truth understanding of how real operations work. Syracuse iSchool senior concentrating in information security. Looking for full-time data, AI, or process engineering roles starting summer 2027.';

export const metadata: Metadata = {
  metadataBase: new URL('https://estachowiak.dev'),
  title: 'Evan Stachowiak | Data, AI, and Process Engineering',
  description: DESCRIPTION,
  keywords: [
    'AI engineering',
    'AI systems',
    'data science',
    'Syracuse University',
    'IMT',
    'information security',
  ],
  authors: [{ name: 'Evan Stachowiak' }],
  openGraph: {
    title: 'Evan Stachowiak | Data, AI, and Process Engineering',
    description: DESCRIPTION,
    type: 'website',
    siteName: 'Evan Stachowiak',
    url: 'https://estachowiak.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evan Stachowiak | Data, AI, and Process Engineering',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <SkipLink />
        <BootProvider>
          {/* Cinematic loader: dark pre-load → cream sweep → name stamp → handoff. */}
          <HeroLoader />
          {/* Lenis smooth scroll — gated internally on bootReady. */}
          <LenisProvider>
            <AnimationProvider>
              <Navbar />
              {children}
              <Footer />
            </AnimationProvider>
          </LenisProvider>
        </BootProvider>
      </body>
    </html>
  );
}
