export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchUses, fetchProducts } from "@/data";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductCard } from "@/components/shared/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const uses = await fetchUses();
  const useItem = uses.find((u) => u.slug === slug);
  if (!useItem) return { title: "Use Not Found" };
  return {
    title: `${useItem.name} | TradeHub UAE`,
    description: `Browse products for ${useItem.name.toLowerCase()} use case at TradeHub UAE.`,
  };
}

export default async function UseSlugPage({ params }: Props) {
  const { slug } = await params;
  const uses = await fetchUses();
  const useItem = uses.find((u) => u.slug === slug);
  if (!useItem) notFound();

  const { products } = await fetchProducts({ limit: 100, use: slug });
  const showCount = products.length;

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
      <div className="pb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Uses", href: "/uses" },
            { label: useItem.name },
          ]}
        />
      </div>

      <div className="border-b border-line pb-8">
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          {useItem.name}
        </h1>
        <p className="mt-1.5 text-[14px] leading-[18px] text-ink-2">
          Products for {useItem.name.toLowerCase()} use
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-4 text-sm text-ink-2">
          {showCount} {showCount === 1 ? "product" : "products"}
        </p>

        {showCount > 0 ? (
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-line py-20">
            <p className="text-sm font-semibold text-ink">No products found</p>
            <p className="mt-1 text-sm text-ink-2">No products for {useItem.name.toLowerCase()} use case yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
