import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-10 md:py-14 px-6 max-w-[1200px] mx-auto w-full',
        className
      )}
    >
      {children}
    </section>
  );
}
