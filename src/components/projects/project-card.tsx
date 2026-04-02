'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  onExpand?: (projectId: string) => void;
}

export function ProjectCard({ project, onExpand }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.article
      ref={cardRef}
      layout
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className={cn(
        'group bg-card border border-border rounded-lg overflow-hidden',
        'hover:border-terminal-green/30 hover:terminal-glow'
      )}
    >
      <PlaceholderImage label={project.imageLabel} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-mono text-lg text-foreground font-semibold">
              {project.title}
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              {project.subtitle}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'font-mono text-[10px] shrink-0',
              project.status === 'completed'
                ? 'border-terminal-green/40 text-terminal-green'
                : 'border-terminal-amber/40 text-terminal-amber'
            )}
          >
            {project.status === 'completed' ? 'Completed' : 'In Progress'}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/75 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="font-mono text-[10px] bg-surface border border-border"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!expanded) onExpand?.(project.id);
              setExpanded(!expanded);
            }}
            className={cn(
              'font-mono text-xs flex items-center gap-1 transition-colors',
              expanded
                ? 'text-terminal-green'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {expanded ? 'Collapse' : 'View Details'}
            <ChevronDown
              size={14}
              className={cn(
                'transition-transform duration-200',
                expanded && 'rotate-180'
              )}
            />
          </button>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-terminal-green transition-colors ml-auto"
              aria-label={`View ${project.title} on GitHub`}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-border">
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {project.detailedDescription}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
