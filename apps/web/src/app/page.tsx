export const dynamic = 'force-dynamic';

import { HeroSection, ProductRow, ProductRowScroll, DiscoveryGrid, LatestArrivalsRow, OfferSection } from "@/components/home";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";
import { fetchProducts, fetchCategoryTree } from "@/data";
import { CategoryCard } from "@/components/shared/CategoryCard";
import type { CategoryTree, Category } from "@/data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

function flattenTree(nodes: CategoryTree[]): Category[] {
  const result: Category[] = [];
  for (const n of nodes) {
    result.push({
      id: n.id,
      name: n.name,
      slug: n.slug,
      desc: n.description ?? "",
      count: n.productCount ? `${n.productCount}+ products` : "",
      image: n.image,
      parentId: n.parentId,
    });
    result.push(...flattenTree(n.children));
  }
  return result;
}

function collectChildSlugs(node: CategoryTree): string[] {
  const slugs: string[] = [];
  for (const child of node.children) {
    slugs.push(child.slug);
    slugs.push(...collectChildSlugs(child));
  }
  return slugs;
}

export default async function HomePage() {
  const [productRes, tree] = await Promise.all([
    fetchProducts({ limit: 200 }),
    fetchCategoryTree(),
  ]);

  const all = productRes.products;
  const flatCats = flattenTree(tree);
  const rootCats = tree.filter((n) => n.children.length > 0 || all.some((p) => p.categorySlug === n.slug));

  const productsBySlug: Record<string, typeof all> = {};
  for (const p of all) {
    const slug = p.categorySlug;
    if (!slug) continue;
    if (!productsBySlug[slug]) productsBySlug[slug] = [];
    productsBySlug[slug].push(p);
  }

  const bulkEligible = all.filter((p) => p.stock !== undefined && p.stock >= 10);

  return (
    <>
      <HeroSection />
      <LiveChatWidget />

      <div className="mx-auto max-w-[1760px] px-6 md:px-10 lg:px-20">
        <div className="space-y-16 pb-16">
          <CategoryRow categories={flatCats} />

          <LatestArrivalsRow products={all.slice(0, 6)} />
          <OfferSection />

          {rootCats.map((root) => {
            const childSlugs = collectChildSlugs(root);
            const rootProducts = [...(productsBySlug[root.slug] ?? [])];
            for (const childSlug of childSlugs) {
              const childProds = productsBySlug[childSlug] ?? [];
              rootProducts.push(...childProds);
            }
            if (rootProducts.length === 0) return null;

            const scrollSection = rootProducts.length > 6;

            return scrollSection ? (
              <ProductRowScroll
                key={root.id}
                title={root.name}
                products={rootProducts}
                href={`/categories/${root.slug}`}
              />
            ) : (
              <ProductRow
                key={root.id}
                title={root.name}
                products={rootProducts}
                href={`/categories/${root.slug}`}
              />
            );
          })}

          {bulkEligible.length > 0 && (
            <ProductRowScroll
              title="Wholesale & bulk deals"
              products={bulkEligible}
              href="/bulk-sales"
            />
          )}

          <DiscoveryGrid />
        </div>
      </div>
    </>
  );
}

function CategoryRow({ categories }: { categories: Category[] }) {
  return (
    <section className="group/section pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          Browse by category
        </h2>
        <Link
          href="/categories"
          className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-2"
        >
          All categories
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
      <div className="relative">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
