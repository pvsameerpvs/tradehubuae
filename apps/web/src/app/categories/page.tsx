export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { fetchCategoryTree } from "@/data";
import { CategoryCard } from "@/components/shared/CategoryCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse IT equipment by category - Laptops, PCs, Gaming, Components and more in UAE",
};

export default async function CategoriesPage() {
  const tree = await fetchCategoryTree();

  const allCount = tree.reduce((sum, root) => {
    const count = root.productCount ?? 0;
    const childCount = root.children.reduce((s, c) => s + (c.productCount ?? 0), 0);
    return sum + count + childCount;
  }, 0);

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
      <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
        Product Categories
      </h1>
      <p className="mt-2 text-[14px] leading-[18px] text-ink-2">
        {allCount} products across {tree.length} categories
      </p>

      <div className="mt-8 space-y-12">
        {tree.map((root) => {
          const rootCat = {
            id: root.id,
            name: root.name,
            slug: root.slug,
            desc: root.description ?? "",
            count: root.productCount ? `${root.productCount}+ products` : "",
            image: root.image,
            parentId: root.parentId,
          };

          return (
            <section key={root.id}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">{root.name}</h2>
                <Link
                  href={`/categories/${root.slug}`}
                  className="text-sm font-semibold text-ink underline underline-offset-2"
                >
                  View all
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {root.children.length > 0 ? (
                  root.children.map((child) => (
                    <CategoryCard
                      key={child.slug}
                      category={{
                        id: child.id,
                        name: child.name,
                        slug: child.slug,
                        desc: child.description ?? "",
                        count: child.productCount ? `${child.productCount}+ products` : "",
                        image: child.image,
                        parentId: child.parentId ?? null,
                      }}
                    />
                  ))
                ) : (
                  <CategoryCard category={rootCat} />
                )}
              </div>

              {root.children.some((c) => c.children.length > 0) && (
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {root.children.flatMap((child) =>
                    child.children.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/categories/${sub.slug}`}
                        className="text-sm text-ink-2 underline underline-offset-2 hover:text-ink"
                      >
                        {sub.name}
                      </Link>
                    )),
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
