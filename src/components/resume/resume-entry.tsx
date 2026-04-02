interface ResumeEntryProps {
  title: string;
  subtitle: string;
  dateRange?: string;
  bullets: string[];
  status?: string;
}

export function ResumeEntry({
  title,
  subtitle,
  dateRange,
  bullets,
  status,
}: ResumeEntryProps) {
  return (
    <div className="relative pl-5 border-l border-border hover:border-terminal-green/40 transition-colors">
      <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-[4.5px] rounded-full bg-terminal-green/60" />
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
        <div>
          <h4 className="font-mono text-sm text-foreground font-semibold">
            {title}
            {status && (
              <span className="ml-2 text-terminal-amber text-xs font-normal">
                ({status})
              </span>
            )}
          </h4>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {dateRange && (
          <p className="font-mono text-xs text-terminal-green/70 shrink-0">
            {dateRange}
          </p>
        )}
      </div>
      <ul className="space-y-1.5">
        {bullets.map((bullet, i) => (
          <li
            key={i}
            className="text-sm text-foreground/70 leading-relaxed pl-3 relative before:content-['▸'] before:absolute before:left-0 before:text-terminal-green/50 before:text-xs"
          >
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
