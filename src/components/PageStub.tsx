export function PageStub({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="container-page py-20">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      <div className="mt-8 flex min-h-48 items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line text-sm text-faint">
        {title} — coming in {phase}
      </div>
    </div>
  );
}
