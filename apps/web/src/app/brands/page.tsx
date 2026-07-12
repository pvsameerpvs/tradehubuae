import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brands",
  description: "Browse top IT brands available at TradeHub UAE - Dell, HP, Lenovo, Apple, ASUS, and more",
};

const brands = [
  { name: "Dell", slug: "dell", description: "Premium laptops, desktops & workstations" },
  { name: "HP", slug: "hp", description: "Reliable business & consumer PCs" },
  { name: "Lenovo", slug: "lenovo", description: "ThinkPad & IdeaPad series" },
  { name: "Apple", slug: "apple", description: "MacBooks, iMacs & accessories" },
  { name: "ASUS", slug: "asus", description: "Gaming & creator laptops" },
  { name: "Acer", slug: "acer", description: "Affordable laptops & desktops" },
  { name: "Microsoft", slug: "microsoft", description: "Surface devices & accessories" },
  { name: "Logitech", slug: "logitech", description: "Keyboards, mice & webcams" },
  { name: "Samsung", slug: "samsung", description: "Monitors, storage & accessories" },
  { name: "Intel", slug: "intel", description: "Processors & components" },
  { name: "AMD", slug: "amd", description: "Processors & graphics cards" },
  { name: "NVIDIA", slug: "nvidia", description: "Graphics cards & AI solutions" },
  { name: "Corsair", slug: "corsair", description: "Gaming peripherals & components" },
  { name: "TP-Link", slug: "tp-link", description: "Networking equipment" },
  { name: "Seagate", slug: "seagate", description: "Storage solutions" },
  { name: "Western Digital", slug: "western-digital", description: "HDDs, SSDs & storage" },
];

export default function BrandsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold md:text-4xl">Brands We Carry</h1>
      <p className="mb-10 text-lg text-muted-foreground">
        Top brands from around the world, available right here in the UAE.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/search?brand=${brand.slug}`}
            className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
              {brand.name.charAt(0)}
            </div>
            <h2 className="text-lg font-semibold group-hover:text-primary">{brand.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{brand.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
