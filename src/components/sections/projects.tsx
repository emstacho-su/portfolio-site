'use client';

import { useState, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { ProjectPanel } from '@/components/projects/project-panel';
import { ProjectPopout } from '@/components/projects/project-popout';
import { projects } from '@/data/projects';
import { EASE } from '@/lib/animation';
import type { Project } from '@/data/projects';

interface ProjectsSectionProps {
  onProjectClick?: (projectId: string) => void;
}

export function ProjectsSection({ onProjectClick }: ProjectsSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  // Lifted pop-out state: one shared Dialog opened with the clicked project's
  // payload (D-12). Closing clears the active project after the dialog reports
  // closed so the title does not flash empty mid-transition.
  const [open, setOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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
      {/* Heading + animated rule, kept from the Wave 1 section. */}
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-10 md:pt-14">
        <div ref={headingRef} className="mb-4">
          <Reveal>
            <h2 className="font-mono text-2xl md:text-3xl text-crimson">
              Projects
            </h2>
          </Reveal>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isHeadingInView ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE.OUT }}
            className="h-px bg-gradient-to-r from-crimson/60 via-crimson/20 to-transparent mt-3 origin-left"
          />
        </div>
      </div>

      {/* Vertically stacked full-viewport overview panels (D-11). Each panel is
          a scroll destination with a GSAP scroll-driven entrance. */}
      <div>
        {projects.map((project) => (
          <ProjectPanel
            key={project.id}
            project={project}
            onOpen={handleOpen}
          />
        ))}
      </div>

      {/* One shared accessible pop-out for whichever panel was clicked. */}
      <ProjectPopout
        open={open}
        project={activeProject}
        onOpenChange={handleOpenChange}
      />
    </section>
  );
}
