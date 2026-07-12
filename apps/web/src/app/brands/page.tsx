import type { Metadata } from "next";
import { brands } from "@/data";
import { BrandCard } from "@/components/shared/BrandCard";

export const metadata: Metadata = {
  title: "Brands",
  description: "Browse top IT brands available at TradeHub UAE - Dell, HP, Lenovo, Apple, ASUS, and more",
};

export default function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold md:text-4xl">Brands We Carry</h1>
      <p className="mb-10 text-lg text-muted-foreground">
        Top brands from around the world, available right here in the UAE.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {brands.map((brand) => (
          <BrandCard key={brand.slug} brand={brand} />
        ))}
      </div>
    </div>
  );
}
