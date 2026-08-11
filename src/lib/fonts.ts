import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

// General Sans self-hosted via next/font/local (brief §7.1). The old Fontshare
// CDN @import was silently dropped by the CSS build, so the font never loaded
// in production. Files fetched from Fontshare (free license), weights 400-700.
export const generalSans = localFont({
  src: [
    { path: '../fonts/GeneralSans-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/GeneralSans-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/GeneralSans-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/GeneralSans-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-general-sans',
  display: 'swap',
});

// JetBrains Mono stays via next/font/google for nav logo, code blocks, meta timestamps.
export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});
