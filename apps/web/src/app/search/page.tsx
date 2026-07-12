import type { Metadata } from "next";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search for IT equipment across all categories in UAE",
};

const products = [
  { name: "Dell XPS 15", price: 5499, category: "Laptops", slug: "dell-xps-15", badge: "Best Seller" },
  { name: "MacBook Pro 16", price: 7899, category: "Laptops", slug: "macbook-pro-16", badge: "New" },
  { name: "HP Pavilion Desktop", price: 3299, category: "Desktop PCs", slug: "hp-pavilion-desktop" },
  { name: "Custom Gaming PC RTX 4070", price: 6999, category: "Gaming PCs", slug: "custom-gaming-pc-rtx-4070", badge: "Popular" },
  { name: "Logitech MX Master 3S", price: 349, category: "Accessories", slug: "logitech-mx-master-3s" },
  { name: "Samsung 27\" Monitor", price: 1299, category: "Accessories", slug: "samsung-27-monitor" },
  { name: "Intel Core i7-14700K", price: 1899, category: "Components", slug: "intel-core-i7-14700k" },
  { name: "TP-Link WiFi 6 Router", price: 449, category: "Networking", slug: "tp-link-wifi-6-router" },
];

const categories = ["All", "Laptops", "Desktop PCs", "Gaming PCs", "Components", "Accessories", "Networking"];

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Search Products</h1>

      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="search"
            placeholder="Search by product name, brand, SKU, or spec..."
            className="h-12 w-full rounded-lg border bg-background pl-12 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
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
        <p className="mb-4 text-sm text-muted-foreground">Showing {products.length} results</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group rounded-xl border bg-card shadow-sm transition hover:shadow-md"
            >
              <div className="relative flex aspect-square items-center justify-center bg-muted">
                {product.badge && (
                  <Badge variant={product.badge === "New" ? "default" : product.badge === "Popular" ? "warning" : "success"} className="absolute left-3 top-3">
                    {product.badge}
                  </Badge>
                )}
                <svg className="h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z" />
                </svg>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <h3 className="mt-1 font-medium group-hover:text-primary">{product.name}</h3>
                <p className="mt-2 font-semibold text-primary">AED {product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
