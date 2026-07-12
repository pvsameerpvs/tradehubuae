import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Icon className="mb-4 h-16 w-16 text-ink-3" strokeWidth={1} />
      <h2 className="mb-2 text-xl font-semibold text-ink">{title}</h2>
      <p className="mb-6 text-ink-2">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="flex h-12 items-center justify-center rounded-lg bg-brand px-8 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
