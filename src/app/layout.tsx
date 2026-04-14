import type { Metadata } from 'next';
import { jetbrainsMono } from '@/lib/fonts';
import { AnimationProvider } from './providers/animation-provider';
import { SkipLink } from '@/components/ui/skip-link';
import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Evan Stachowiak | Systems Thinker & Technical Builder',
  description:
    'Portfolio of Evan Stachowiak: Syracuse University IMT student building at the intersection of AI, operations, and quantitative systems.',
  keywords: [
    'portfolio',
    'software engineer',
    'Syracuse University',
    'IMT',
    'information security',
    'full stack developer',
    'AI engineering',
  ],
  authors: [{ name: 'Evan Stachowiak' }],
  openGraph: {
    title: 'Evan Stachowiak | Portfolio',
    description:
      'Systems thinker & technical builder: Syracuse University IMT student.',
    type: 'website',
    siteName: 'Evan Stachowiak',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evan Stachowiak | Portfolio',
    description:
      'Systems thinker & technical builder: Syracuse University IMT student.',
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
        <AnimationProvider>
          <Navbar />
          {children}
          <Footer />
        </AnimationProvider>
      </body>
    </html>
  );
}
