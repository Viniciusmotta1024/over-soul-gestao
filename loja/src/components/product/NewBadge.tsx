export function NewBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-brand px-2.5 py-1 text-caption font-medium text-on-brand ${className}`}
    >
      Lançamento
    </span>
  );
}
