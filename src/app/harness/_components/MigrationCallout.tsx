interface MigrationCalloutProps {
  kind: 'why' | 'phantom' | 'configs';
  title: string;
  children: React.ReactNode;
}

const KIND_LABEL: Record<MigrationCalloutProps['kind'], string> = {
  why: 'why',
  phantom: 'phantom port',
  configs: 'configs',
};

// Editorial inline callout used in §3 of the harness page only.
// §4 is plain prose — do not import this component there.
export function MigrationCallout({ kind, title, children }: MigrationCalloutProps) {
  return (
    <aside
      role="note"
      className="my-8 border-l-2 border-crimson pl-5 py-1 max-w-[64ch]"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-tertiary mb-1">
        {KIND_LABEL[kind]}
      </p>
      <h4 className="font-sans text-base font-semibold text-foreground mb-2">
        {title}
      </h4>
      <div className="text-sm text-foreground/85 leading-relaxed">
        {children}
      </div>
    </aside>
  );
}
