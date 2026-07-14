import { HeroSection, ProductRow, ProductRowScroll, DiscoveryGrid, LatestArrivalsRow, OfferSection } from "@/components/home";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";
import { searchProducts, categories } from "@/data";
import { CategoryCard } from "@/components/shared/CategoryCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const laptops = searchProducts.filter((p) => p.category === "Laptops");
const gaming = searchProducts.filter((p) => p.category === "Gaming PCs");
const accessories = searchProducts.filter((p) => p.category === "Accessories");
const desktops = searchProducts.filter((p) => p.category === "Desktop PCs");
const bulkEligible = searchProducts.filter((p) => p.stock !== undefined && p.stock >= 10);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiveChatWidget />

      <div className="mx-auto max-w-[1760px] px-6 md:px-10 lg:px-20">
        <div className="space-y-16 pb-16">
          <CategoryRow />

          

          <LatestArrivalsRow products={laptops.slice(0, 7)} />
<OfferSection />
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

          {bulkEligible.length > 0 && (
            <ProductRowScroll
              title="Wholesale &amp; bulk deals"
              products={bulkEligible}
              href="/bulk-sales"
            />
          )}

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
    </>
  );
}

function CategoryRow() {
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
        <div
          className="flex flex-nowrap gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <div key={cat.slug} className="min-w-[90px] flex-shrink-0 md:min-w-0 md:flex-1">
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
