'use client';

import { useAnalytics } from '@/hooks/use-analytics';
import { HeroSection } from './hero';
import { AboutSection } from './about';
import { ProjectsSection } from './projects';
import { ResumeSectionClient } from './resume';
import { ContactSectionClient } from './contact';

export function AnalyticsWrapper() {
  const { trackProjectClick, trackResumeDownload, trackContactClick } =
    useAnalytics();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection onProjectClick={trackProjectClick} />
      <ResumeSectionClient onResumeDownload={trackResumeDownload} />
      <ContactSectionClient onContactClick={trackContactClick} />
    </>
  );
}
