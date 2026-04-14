import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';

export default function Home() {
  return (
    <main id="main-content" className="flex-1">
      <HeroSection />
      <AboutSection />
    </main>
  );
}
