import Link from "next/link";
import type { Category } from "@/data";

export function CategoryCard({ category, href }: { category: Category; href?: string }) {
  return (
    <Link
      href={href ?? `/categories/${category.slug}`}
      className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
        {category.name.charAt(0)}
      </div>
      <h3 className="text-lg font-semibold group-hover:text-primary">{category.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{category.desc}</p>
      <p className="mt-2 text-xs text-muted-foreground">{category.count}</p>
    </Link>
  );
}
