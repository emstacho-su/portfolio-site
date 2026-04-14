'use client';

import { ProjectsSection } from '@/components/sections/projects';
import { useAnalytics } from '@/hooks/use-analytics';

export default function ProjectsPage() {
  const { trackProjectClick } = useAnalytics();

  return (
    <main
      id="main-content"
      className="flex-1 pt-16 px-6 max-w-[1200px] mx-auto w-full"
    >
      <ProjectsSection onProjectClick={trackProjectClick} />
    </main>
  );
}
