import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { InterestedCTA } from '@/components/sections/interested-cta';
import { CursorSpotlight } from '@/components/fx/cursor-spotlight';

export default function Home() {
  return (
    <>
      <CursorSpotlight />
      <main id="main-content" className="flex-1">
        <HeroSection />
        {/* Single faint hairline rule separating hero from about (spec §6.1) */}
        <div
          aria-hidden="true"
          className="mx-auto w-full max-w-[1200px] px-6"
        >
          <div className="hairline-rule" />
        </div>
        <AboutSection />
        <InterestedCTA />
      </main>
    </>
  );
}
