import Link from "next/link";
import type { Brand } from "@/data";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/search?brand=${brand.slug}`}
      className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
        {brand.name.charAt(0)}
      </div>
      <h2 className="text-lg font-semibold group-hover:text-primary">{brand.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{brand.description}</p>
    </Link>
  );
}
