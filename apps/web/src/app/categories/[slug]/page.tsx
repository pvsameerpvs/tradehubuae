export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchCategoryTree, fetchProducts } from "@/data";
import type { CategoryTree } from "@/data";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductCard } from "@/components/shared/ProductCard";
import { cn } from "@tradehubuae/ui";

interface CategorySlugPageProps {
  params: Promise<{ slug: string }>;
}

function findInTree(
  nodes: CategoryTree[],
  slug: string,
  parent?: CategoryTree,
): { node: CategoryTree; parent: CategoryTree | null } | null {
  for (const n of nodes) {
    if (n.slug === slug) return { node: n, parent: parent ?? null };
    const found = findInTree(n.children, slug, n);
    if (found) return found;
  }
  return null;
}

function buildBreadcrumbs(
  node: CategoryTree,
  parent: CategoryTree | null,
  roots: CategoryTree[],
): { label: string; href?: string }[] {
  const crumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
  ];

  if (parent) {
    crumbs.push({ label: parent.name, href: `/categories/${parent.slug}` });
  }

  crumbs.push({ label: node.name });
  return crumbs;
}

export async function generateMetadata({ params }: CategorySlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tree = await fetchCategoryTree();
  const found = findInTree(tree, slug);
  if (!found) return { title: "Category Not Found" };
  return {
    title: `${found.node.name} | TradeHub UAE`,
    description: found.node.description
      ? `Browse ${found.node.description.toLowerCase()} at TradeHub UAE. Best prices in Dubai, Abu Dhabi & UAE.`
      : `Browse ${found.node.name} at TradeHub UAE. Best prices in Dubai, Abu Dhabi & UAE.`,
  };
}

export default async function CategorySlugPage({ params }: CategorySlugPageProps) {
  const { slug } = await params;
  const tree = await fetchCategoryTree();
  const found = findInTree(tree, slug);
  if (!found) notFound();

  const { node, parent } = found;
  const children = node.children;
  const siblings = parent ? parent.children.filter((c) => c.slug !== slug) : [];

  const { products } = await fetchProducts({ category: slug, limit: 100 });
  const showCount = products.length;

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
      <div className="pb-6">
        <Breadcrumb items={buildBreadcrumbs(node, parent, tree)} />
      </div>

      <div className="border-b border-line pb-8">
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          {node.name}
        </h1>
        {node.description && (
          <p className="mt-1.5 text-[14px] leading-[18px] text-ink-2">{node.description}</p>
        )}
      </div>

      {children.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {children.map((child) => (
            <Link
              key={child.slug}
              href={`/categories/${child.slug}`}
              className="rounded-full bg-bg2 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand hover:text-white"
            >
              {child.name}
              {child.productCount ? ` (${child.productCount})` : ""}
            </Link>
          ))}
        </div>
      )}

      {siblings.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="font-medium text-ink-2">Related:</span>
          {siblings.map((sibling) => (
            <Link
              key={sibling.slug}
              href={`/categories/${sibling.slug}`}
              className="text-ink-2 underline underline-offset-2 hover:text-ink"
            >
              {sibling.name}
            </Link>
          ))}
          {parent && (
            <Link
              href={`/categories/${parent.slug}`}
              className="font-semibold text-ink underline underline-offset-2"
            >
              All {parent.name}
            </Link>
          )}
        </div>
      )}

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
            <p className="mt-1 text-sm text-ink-2">
              This category has no products listed yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
