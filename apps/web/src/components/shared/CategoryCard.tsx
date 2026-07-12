import Link from "next/link";
import type { Category } from "@/data";

export function CategoryCard({ category, href }: { category: Category; href?: string }) {
  return (
    <Link
      href={href ?? `/categories/${category.slug}`}
      className="group block"
    >
      <div className="flex items-center gap-4 rounded-xl border border-line bg-white p-5 transition-shadow hover:shadow-card">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-bg2 text-base font-semibold text-ink">
          {category.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-[19px] text-ink">{category.name}</h3>
          <p className="mt-0.5 text-sm leading-[18px] text-ink-2">{category.desc}</p>
          <p className="mt-0.5 text-xs text-ink-3">{category.count}</p>
        </div>
      </div>
    </Link>
  );
}
