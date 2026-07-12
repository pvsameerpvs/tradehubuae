import { SearchBar, ProductRow, ProductRowScroll, DiscoveryGrid } from "@/components/home";
import { searchProducts, categories } from "@/data";
import { CategoryCard } from "@/components/shared/CategoryCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const laptops = searchProducts.filter((p) => p.category === "Laptops");
const gaming = searchProducts.filter((p) => p.category === "Gaming PCs");
const accessories = searchProducts.filter((p) => p.category === "Accessories");
const desktops = searchProducts.filter((p) => p.category === "Desktop PCs");

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1760px] px-6 md:px-10 lg:px-20">
      <div className="py-12 md:py-16 lg:py-20">
        <h1 className="mb-3 text-center text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          Find your next laptop in the UAE
        </h1>
        <p className="mb-8 text-center text-sm leading-[18px] text-ink-2">
          New, certified refurbished, and like-new — from top brands
        </p>
        <SearchBar />
      </div>

      <div className="space-y-16 pb-16">
        <CategoryRow />

        <ProductRowScroll
          title="Latest arrivals"
          products={laptops.slice(0, 7)}
          href="/search?sort=newest"
        />

        <ProductRow
          title="All laptops"
          products={laptops.slice(0, 6)}
          href="/search?category=laptops"
        />

        <ProductRowScroll
          title="Gaming"
          products={gaming}
          href="/categories/gaming-pcs"
        />

        <DiscoveryGrid />

        <div className="border-t border-line pt-16">
          <ProductRow
            title="Accessories & peripherals"
            products={accessories}
            href="/categories/accessories"
          />
        </div>

        <ProductRow
          title="Desktop PCs"
          products={desktops}
          href="/categories/desktop-pcs"
        />
      </div>
    </div>
  );
}

function CategoryRow() {
  return (
    <section>
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
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>
    </section>
  );
}
