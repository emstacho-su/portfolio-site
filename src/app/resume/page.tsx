'use client';

import { ResumeSectionClient } from '@/components/sections/resume';
import { useAnalytics } from '@/hooks/use-analytics';

export default function ResumePage() {
  const { trackResumeDownload } = useAnalytics();

  return (
    <main
      id="main-content"
      className="flex-1 pt-16 px-6 max-w-[1200px] mx-auto w-full"
    >
      <ResumeSectionClient onResumeDownload={trackResumeDownload} />
    </main>
  );
}
