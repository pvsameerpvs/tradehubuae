import Link from "next/link";
import { ChevronRight } from "@/components/icons";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-6 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <ChevronRight className="mx-2 inline h-3 w-3" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary">{item.label}</Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
