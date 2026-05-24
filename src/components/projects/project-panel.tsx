'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from 'motion/react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import { useBootReady } from '@/lib/boot-context';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/projects';

// GSAP needs both plugins registered for useGSAP scoped ScrollTrigger entrances.
// Registering at module scope is idempotent and safe in Next 16 client modules.
gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProjectPanelProps {
  project: Project;
  // Opens the shared pop-out case study with this project's payload (S-5 fires
  // analytics in the parent section, not here).
  onOpen: (project: Project) => void;
}

export function ProjectPanel({ project, onOpen }: ProjectPanelProps) {
  const panel = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const bootReady = useBootReady();

  // Scroll-driven entrance for every [data-animate] child. Under reduced motion
  // (D-23 / S-3) we return early so the content stays in its final, visible
  // state with no transform or opacity animation. useGSAP scopes the animation
  // to the panel ref and auto-reverts on unmount. The reduce + bootReady deps
  // re-run the effect when the loader hands off or the preference changes;
  // ScrollTrigger.refresh() after boot/fonts corrects start/end positions that
  // were measured before layout settled (Pitfall 3).
  useGSAP(
    () => {
      if (reduce || !panel.current) return;

      gsap.from(panel.current.querySelectorAll('[data-animate]'), {
        y: 60,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panel.current,
          start: 'top 70%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      });

      if (bootReady) {
        ScrollTrigger.refresh();
      }
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    },
    { scope: panel, dependencies: [reduce, bootReady] }
  );

  return (
    <section
      ref={panel}
      aria-label={`${project.title} overview`}
      className="min-h-screen w-full flex items-center px-6 py-20"
    >
      <div className="mx-auto w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Visual */}
        <div data-animate className="order-2 lg:order-1">
          <div className="rounded-lg border border-border overflow-hidden">
            <PlaceholderImage label={project.title} />
          </div>
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <div data-animate className="flex items-center gap-3 mb-4">
            <Badge
              variant="outline"
              className="font-mono text-[10px] border-crimson/40 text-crimson"
            >
              {project.status === 'shipped' ? 'Shipped' : 'In Progress'}
            </Badge>
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
            className="font-mono text-2xl md:text-3xl text-foreground font-semibold mb-4"
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
                className="font-mono text-[10px] bg-surface border border-border"
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
            aria-label={`Open the ${project.title} case study`}
          >
            Open case study
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
