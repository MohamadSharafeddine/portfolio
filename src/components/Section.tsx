interface SectionProps {
  id: string;
  /** Section number, shown in mono as the signature index */
  layer: number;
  title: string;
  /** A code-comment style aside shown on the index rule */
  comment?: string;
  children: React.ReactNode;
}

export default function Section({ id, layer, title, comment, children }: SectionProps) {
  const index = String(layer).padStart(2, "0");
  return (
    <section id={id} className="relative scroll-mt-16">
      <div className="mx-auto max-w-[1320px] px-6 py-24 lg:px-8 lg:py-36">
        <header data-reveal className="mb-14 lg:mb-20">
          <div className="flex items-center gap-4 font-mono text-xs text-fg-3">
            <span className="tabular-nums text-fg">{index}</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
            {comment && <span className="hidden sm:inline">{`// ${comment}`}</span>}
          </div>
          <h2 className="mt-6 text-[clamp(44px,7vw,96px)] leading-[0.95] font-medium tracking-[-0.04em] text-fg">
            {title}
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}
