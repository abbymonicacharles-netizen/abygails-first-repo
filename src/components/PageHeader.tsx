export function PageHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-14 border-b border-cream-dark pb-10">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blush">{label}</p>
      <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">{title}</h1>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">{description}</p>
      )}
    </div>
  );
}
