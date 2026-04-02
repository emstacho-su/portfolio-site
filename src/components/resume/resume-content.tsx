import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResumeEntry } from './resume-entry';
import { resumeData } from '@/data/resume';

export function ResumeContent() {
  const { experience, projects, education, skills, certifications, interests } =
    resumeData;

  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main column */}
        <div className="space-y-8">
          {/* Experience */}
          <div>
            <h3 className="font-mono text-sm text-terminal-green uppercase tracking-wider mb-5">
              Relevant Experience
            </h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <ResumeEntry
                  key={`${exp.company}-${exp.title}`}
                  title={exp.title}
                  subtitle={exp.company}
                  dateRange={exp.dateRange}
                  bullets={exp.bullets}
                />
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Projects */}
          <div>
            <h3 className="font-mono text-sm text-terminal-green uppercase tracking-wider mb-5">
              Projects
            </h3>
            <div className="space-y-6">
              {projects.map((proj) => (
                <ResumeEntry
                  key={proj.title}
                  title={proj.title}
                  subtitle={proj.technologies}
                  bullets={proj.bullets}
                  status={proj.status}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Education */}
          <div>
            <h3 className="font-mono text-sm text-terminal-green uppercase tracking-wider mb-4">
              Education
            </h3>
            <div>
              <p className="font-mono text-sm text-foreground font-semibold">
                {education.school}
              </p>
              <p className="text-xs text-muted-foreground">
                {education.department}
              </p>
              <p className="text-sm text-foreground/85 mt-1">
                {education.degree}
              </p>
              <p className="font-mono text-xs text-terminal-green/70 mt-1">
                {education.expectedDate}
              </p>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">
                  Relevant Coursework
                </p>
                <div className="flex flex-wrap gap-1">
                  {education.coursework.map((course) => (
                    <Badge
                      key={course}
                      variant="secondary"
                      className="font-mono text-[10px] bg-surface border border-border"
                    >
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Skills */}
          <div>
            <h3 className="font-mono text-sm text-terminal-green uppercase tracking-wider mb-4">
              Skills
            </h3>
            <div className="space-y-4">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {items.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="font-mono text-[10px] bg-surface border border-border"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Certifications */}
          <div>
            <h3 className="font-mono text-sm text-terminal-green uppercase tracking-wider mb-4">
              Certifications & Awards
            </h3>
            <ul className="space-y-2">
              {certifications.map((cert) => (
                <li
                  key={cert}
                  className="text-sm text-foreground/75 pl-3 relative before:content-['✓'] before:absolute before:left-0 before:text-terminal-green/60 before:text-xs"
                >
                  {cert}
                </li>
              ))}
            </ul>
          </div>

          <Separator className="bg-border" />

          {/* Interests */}
          <div>
            <h3 className="font-mono text-sm text-terminal-green uppercase tracking-wider mb-3">
              Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="font-mono text-[10px] border-border text-muted-foreground"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
