import type { Metadata } from "next";
import { Search } from "lucide-react";
import { searchProducts, searchCategories } from "@/data";
import { ProductCard } from "@/components/shared/ProductCard";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search for IT equipment across all categories in UAE",
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
      <h1 className="mb-8 text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
        Search Products
      </h1>

      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
          <input
            type="search"
            placeholder="Search by product name, brand, SKU, or spec..."
            className="h-12 w-full rounded-lg border border-line bg-white pl-12 pr-4 text-sm text-ink placeholder:text-ink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {searchCategories.map((cat) => (
            <button
              key={cat}
              className={`rounded-full border border-line px-4 py-1.5 text-sm transition hover:bg-bg3 ${
                cat === "All"
                  ? "bg-ink text-white hover:bg-ink"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-4 text-sm text-ink-2">Showing {searchProducts.length} results</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
