import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-6 text-sm text-ink-2">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <ChevronRight className="mx-2 inline h-3 w-3" strokeWidth={1.75} />}
          {item.href ? (
            <Link href={item.href} className="hover:text-ink underline underline-offset-2">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
