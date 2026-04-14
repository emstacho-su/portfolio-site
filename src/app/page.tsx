import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { CursorSpotlight } from '@/components/fx/cursor-spotlight';

export default function Home() {
  return (
    <>
      <CursorSpotlight />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <AboutSection />
      </main>
    </>
  );
}
