import { JetBrains_Mono } from 'next/font/google';

// General Sans is loaded via Fontshare CDN @import in globals.css.
// JetBrains Mono stays via next/font/google for nav logo, code blocks, meta timestamps.
export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});
