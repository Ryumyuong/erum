export function PageStub({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="container-page py-20">
      <h1 className="text-[min(6.31vw,26px)] desktop:text-3xl font-bold">{title}</h1>
      <div className="mt-8 flex min-h-48 items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line text-[min(2.91vw,12px)] desktop:text-sm text-faint">
        {title} — coming in {phase}
      </div>
    </div>
  );
}
