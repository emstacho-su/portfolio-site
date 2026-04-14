import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { projects } from '@/data/projects';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} | Evan Stachowiak`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) notFound();

  return (
    <main
      id="main-content"
      className="flex-1 pt-24 px-6 max-w-[900px] mx-auto w-full"
    >
      <article className="py-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 font-mono text-xs text-tertiary hover:text-crimson transition-colors mb-8"
        >
          <ArrowLeft size={12} />
          All projects
        </Link>

        <p className="font-mono text-xs text-tertiary uppercase tracking-wider mb-3">
          Case Study
        </p>
        <h1 className="mb-4">{project.title}</h1>
        <p className="text-lg text-muted-foreground prose-body">
          {project.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[10px] px-2 py-1 border border-hairline text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-12 p-6 border border-hairline bg-surface rounded">
          <p className="font-mono text-xs uppercase tracking-wider text-tertiary mb-2">
            Under construction
          </p>
          <p className="text-sm text-muted-foreground prose-body">
            Full case study — Problem / Approach / Key Decisions / Outcome /
            What I&apos;d Do Differently — coming in Phase 4 of the redesign.
          </p>
        </div>

        <div className="mt-8 prose-body">
          <h2 className="text-xl mt-8 mb-3">Summary</h2>
          <p className="text-foreground/85">{project.detailedDescription}</p>
        </div>

        {project.githubUrl && (
          <p className="mt-8">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-crimson hover:text-crimson-hover underline decoration-crimson/40 underline-offset-2"
            >
              View repository on GitHub →
            </a>
          </p>
        )}
      </article>
    </main>
  );
}
