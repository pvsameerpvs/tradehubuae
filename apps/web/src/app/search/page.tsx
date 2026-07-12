import type { Metadata } from "next";
import { Search } from "@/components/icons";
import { searchProducts, searchCategories } from "@/data";
import { ProductCard } from "@/components/shared/ProductCard";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search for IT equipment across all categories in UAE",
};

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Search Products</h1>

      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by product name, brand, SKU, or spec..."
            className="h-12 w-full rounded-lg border bg-background pl-12 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {searchCategories.map((cat) => (
            <button
              key={cat}
              className={`rounded-full border px-4 py-1.5 text-sm transition hover:bg-accent ${cat === "All" ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-4 text-sm text-muted-foreground">Showing {searchProducts.length} results</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
