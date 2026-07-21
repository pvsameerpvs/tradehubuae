export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBrands, fetchProducts } from "@/data";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductCard } from "@/components/shared/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brands = await fetchBrands();
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return { title: "Brand Not Found" };
  return {
    title: `${brand.name} | TradeHub UAE`,
    description: brand.description,
  };
}

export default async function BrandSlugPage({ params }: Props) {
  const { slug } = await params;
  const brands = await fetchBrands();
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();

  const { products } = await fetchProducts({ brand: slug, limit: 100 });
  const showCount = products.length;

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
      <div className="pb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Brands", href: "/brands" },
            { label: brand.name },
          ]}
        />
      </div>

      <div className="border-b border-line pb-8">
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          {brand.name}
        </h1>
        <p className="mt-1.5 text-[14px] leading-[18px] text-ink-2">
          {brand.description}
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
            <p className="mt-1 text-sm text-ink-2">No {brand.name} products listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
