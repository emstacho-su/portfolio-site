'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { ProjectCard } from '@/components/projects/project-card';
import { projects } from '@/data/projects';
import { staggerContainer, staggerItem, EASE } from '@/lib/animation';

interface ProjectsSectionProps {
  onProjectClick?: (projectId: string) => void;
}

export function ProjectsSection({ onProjectClick }: ProjectsSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <Section id="projects">
      <div ref={headingRef} className="mb-10">
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

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {projects.map((project) => (
          <motion.div key={project.id} variants={staggerItem}>
            <ProjectCard project={project} onExpand={onProjectClick} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
