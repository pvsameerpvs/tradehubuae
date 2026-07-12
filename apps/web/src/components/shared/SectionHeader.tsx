import Link from "next/link";

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-10 flex items-end justify-between">
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="text-sm font-medium text-primary hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  );
}
