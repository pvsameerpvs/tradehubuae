import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    <div className="mb-8 flex items-end justify-between">
      <div>
        <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        {description && <p className="mt-1 text-sm leading-[18px] text-ink-2">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-2"
        >
          {action.label}
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      )}
    </div>
  );
}
