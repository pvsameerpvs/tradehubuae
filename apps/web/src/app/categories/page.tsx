import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse IT equipment by category - Laptops, PCs, Gaming, Components and more in UAE",
};

const categories = [
  { name: "Laptops", slug: "laptops", desc: "Business, gaming & ultrabooks", count: "45+" },
  { name: "Desktop PCs", slug: "desktop-pcs", desc: "Pre-built & custom configurations", count: "30+" },
  { name: "Gaming PCs", slug: "gaming-pcs", desc: "High-performance gaming rigs", count: "20+" },
  { name: "Components", slug: "components", desc: "CPUs, GPUs, motherboards, RAM", count: "100+" },
  { name: "Accessories", slug: "accessories", desc: "Monitors, keyboards, mice & more", count: "80+" },
  { name: "Networking", slug: "networking", desc: "Routers, switches, cables & servers", count: "50+" },
  { name: "Storage", slug: "storage", desc: "SSDs, HDDs, NAS & external drives", count: "40+" },
  { name: "Software", slug: "software", desc: "Operating systems & productivity suites", count: "25+" },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Product Categories</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
              {cat.name.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold group-hover:text-primary">{cat.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{cat.desc}</p>
            <p className="mt-2 text-xs text-muted-foreground">{cat.count} products</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
