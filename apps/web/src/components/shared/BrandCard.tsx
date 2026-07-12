import Link from "next/link";
import type { Brand } from "@/data";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/search?brand=${brand.slug}`}
      className="group block rounded-xl border border-line bg-white p-6 transition-shadow hover:shadow-card"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-bg2 text-lg font-bold text-ink">
        {brand.name.charAt(0)}
      </div>
      <h2 className="text-[15px] font-semibold leading-[19px] text-ink">{brand.name}</h2>
      <p className="mt-1 text-sm text-ink-2">{brand.description}</p>
    </Link>
  );
}
