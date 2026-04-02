import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="px-6 pb-8 pt-4 max-w-[1200px] mx-auto w-full">
      <Separator className="mb-6 bg-border" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p className="font-mono">
          Built by Evan Stachowiak
        </p>
        <p className="font-mono text-xs">
          Syracuse University // IMT // Info Security
        </p>
      </div>
    </footer>
  );
}
