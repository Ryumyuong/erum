export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="container-page pb-8 pt-14 md:pt-20">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">{subtitle}</p>
      )}
    </div>
  );
}
