'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EASE } from '@/lib/animation';
import type { Project } from '@/data/projects';

interface ProjectPanelProps {
  project: Project;
  // Opens the shared pop-out case study with this project's payload (S-5 fires
  // analytics in the parent section, not here).
  onOpen: (project: Project) => void;
}

export function ProjectPanel({ project, onOpen }: ProjectPanelProps) {
  // Entrance reveal via motion's whileInView (IntersectionObserver). This
  // replaces a GSAP ScrollTrigger entrance that did NOT work in this Lenis +
  // gsap.ticker setup: ScrollTrigger progress never advanced for panels below
  // the first, so their content stayed near opacity 0 ("barely visible"). Only
  // the first panel escaped because it completed during the initial load
  // refresh. IntersectionObserver is independent of the scroll/ticker math and
  // fires reliably when the panel enters the viewport. The reveal is on the
  // grid container (one fade-up for the whole panel); the inner [data-animate]
  // markers are retained for the D-23 reduced-motion audit. Under reduced motion
  // we pass initial=false / no whileInView so content renders in its final,
  // visible state with no inline animation style (R-30 / D-23 / S-3).
  const reduce = useReducedMotion();

  return (
    <section
      aria-label={`${project.title} overview`}
      // Full-viewport panels only when real media exists; without media the
      // emptiness should not be the experience (brief §8.2).
      className={cn(
        'w-full flex items-center px-6',
        project.heroImage ? 'min-h-screen py-20' : 'py-24 md:py-32'
      )}
    >
      <motion.div
        className="mx-auto w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        initial={reduce ? false : { opacity: 0, y: 48 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: EASE.OUT }}
      >
        {/* Visual */}
        <div data-animate className="order-2 lg:order-1">
          <div className="rounded-lg border border-border overflow-hidden bg-surface aspect-video relative">
            {project.heroImage ? (
              project.heroImage.endsWith('.mp4') ? (
                <video
                  src={project.heroImage}
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="h-full w-full object-cover aspect-video block"
                  aria-label={`${project.title} showcase`}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="h-full w-full object-cover aspect-video block"
                />
              )
            ) : (
              // Genuine empty state, not a fake image box (§8.2). Assets land
              // per public/projects/<slug>/README.md.
              <div className="h-full w-full flex flex-col items-center justify-center gap-2 p-8 text-center">
                <p className="font-mono text-xs uppercase tracking-wider text-tertiary">
                  Demo media in production
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Screenshots and a video walkthrough of the live app are being
                  produced.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <div data-animate className="flex items-center gap-3 mb-4">
            <Badge
              variant="outline"
              className="font-mono text-xs border-crimson/40 text-crimson"
            >
              {project.status === 'shipped' ? 'Shipped' : 'In Progress'}
            </Badge>
            <span className="font-mono text-xs text-tertiary">
              {project.period}
            </span>
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-crimson transition-colors"
                aria-label={`View ${project.title} on GitHub`}
              >
                <ExternalLink size={16} />
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-crimson transition-colors"
                aria-label={`View the live ${project.title}`}
              >
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>

          <h3
            data-animate
            className="font-sans text-2xl md:text-3xl text-foreground font-semibold mb-4"
          >
            {project.title}
          </h3>

          <p
            data-animate
            className="text-base md:text-lg text-foreground/80 leading-relaxed mb-5"
          >
            {project.hook}
          </p>

          <p
            data-animate
            className="text-sm text-foreground/65 leading-relaxed mb-6"
          >
            {project.overview}
          </p>

          <div data-animate className="flex flex-wrap gap-1.5 mb-8">
            {project.tech.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="font-mono text-xs bg-surface border border-border"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <button
            data-animate
            type="button"
            onClick={() => onOpen(project)}
            className={cn(
              'group inline-flex items-center gap-2 rounded-md border border-crimson/40 px-5 py-2.5',
              'font-mono text-sm text-crimson transition-colors',
              'hover:bg-crimson/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50'
            )}
            aria-label={`See more about the ${project.title} case study`}
          >
            See More
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
