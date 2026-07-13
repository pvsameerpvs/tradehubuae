import { HeroSection, ProductRow, ProductRowScroll, DiscoveryGrid, LatestArrivalsRow } from "@/components/home";
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
      <HeroSection />

      <div className="space-y-16 pb-16">
        <CategoryRow />

        <LatestArrivalsRow products={laptops.slice(0, 7)} />

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
    <section className="group/section">
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
        <div
          className="flex gap-4 overflow-x-auto md:flex-nowrap [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
