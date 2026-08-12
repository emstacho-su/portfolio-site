'use client';

import { useState, useCallback, useEffect } from 'react';
import { CollapsingHeader } from '@/components/sections/collapsing-header';
import { HorizontalGallery } from '@/components/projects/horizontal-gallery';
import { ProjectPanel } from '@/components/projects/project-panel';
import { ProjectPopout } from '@/components/projects/project-popout';
import { projects } from '@/data/projects';
import type { Project } from '@/data/projects';

interface ProjectsSectionProps {
  onProjectClick?: (projectId: string) => void;
}

export function ProjectsSection({ onProjectClick }: ProjectsSectionProps) {
  // Lifted pop-out state: one shared Dialog opened with the clicked project's
  // payload (D-12). Closing clears the active project after the dialog reports
  // closed so the title does not flash empty mid-transition.
  const [open, setOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Build-visible TODO (brief §8.3): surface missing demo media in dev so an
  // empty media set cannot silently ship unnoticed.
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    for (const p of projects) {
      if (!p.heroImage || p.demos.length === 0) {
        console.warn(
          `[media TODO] ${p.slug}: demo media missing, expected assets under public/projects/${p.slug}/ (see that folder's README.md)`
        );
      }
    }
  }, []);

  const handleOpen = useCallback(
    (project: Project) => {
      setActiveProject(project);
      setOpen(true);
      // S-5: fire the project_click analytics event on open.
      onProjectClick?.(project.id);
    },
    [onProjectClick]
  );

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setActiveProject(null);
  }, []);

  return (
    <section id="projects" className="w-full">
      {/* Full-bleed crimson transition slab; its giant wordmark carries the
          section's h2, so no separate heading renders here. On scroll-past it
          collapses into the sticky bar pinned under the nav; the bar's sticky
          range is this whole section. */}
      <CollapsingHeader
        title="Projects"
        as="h2"
        size="lg"
        captions={['Built end to end.', 'Scroll for the work.']}
      />

      {/* Apple-style horizontal gallery (Evan, 2026-08-12): the section pins
          and vertical scroll slides the panels between each other. Reduced
          motion renders the prior vertical stack via the gallery's fallback. */}
      <HorizontalGallery>
        {projects.map((project) => (
          <ProjectPanel
            key={project.id}
            project={project}
            onOpen={handleOpen}
            // The gallery's slide + depth falloff is the entrance; the panel's
            // own whileInView could be skipped by a fast flick mid-pin.
            entrance={false}
          />
        ))}
      </HorizontalGallery>

      {/* One shared accessible pop-out for whichever panel was clicked. */}
      <ProjectPopout
        open={open}
        project={activeProject}
        onOpenChange={handleOpenChange}
      />
    </section>
  );
}
