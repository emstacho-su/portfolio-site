import type { Metadata } from 'next';
import { jetbrainsMono } from '@/lib/fonts';
import { AnimationProvider } from './providers/animation-provider';
import { LenisProvider } from './providers/lenis-provider';
import { SkipLink } from '@/components/ui/skip-link';
import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';
import { HeroLoader } from '@/components/fx/hero-loader';
import { BootProvider } from '@/lib/boot-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Evan Stachowiak | AI Systems Builder',
  description:
    'Portfolio of Evan Stachowiak: I build AI systems with a ground-truth understanding of how real operations work. Syracuse IMT, data science, AI engineering.',
  keywords: [
    'portfolio',
    'AI engineering',
    'AI systems',
    'data science',
    'Syracuse University',
    'IMT',
    'software engineer',
  ],
  authors: [{ name: 'Evan Stachowiak' }],
  openGraph: {
    title: 'Evan Stachowiak | AI Systems Builder',
    description:
      'I build AI systems with a ground-truth understanding of how real operations work.',
    type: 'website',
    siteName: 'Evan Stachowiak',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evan Stachowiak | AI Systems Builder',
    description:
      'I build AI systems with a ground-truth understanding of how real operations work.',
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
      className={`${jetbrainsMono.variable} h-full`}
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
