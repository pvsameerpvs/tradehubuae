import Link from "next/link";
import { Button } from "@tradehubuae/ui";
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
      <Icon className="mb-4 h-16 w-16 text-muted-foreground" strokeWidth={1} />
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <p className="mb-6 text-muted-foreground">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button size="lg">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
