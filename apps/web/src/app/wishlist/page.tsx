import type { Metadata } from "next";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your wishlist at TradeHub UAE",
};

const wishlistItems = [
  { name: "Dell XPS 15", price: 5499, slug: "dell-xps-15", inStock: true },
  { name: "MacBook Pro 16", price: 7899, slug: "macbook-pro-16", inStock: true },
  { name: "Custom Gaming PC RTX 4070", price: 6999, slug: "custom-gaming-pc-rtx-4070", inStock: false },
  { name: "Samsung 49\" UltraWide", price: 3299, slug: "samsung-49-ultrawide", inStock: true },
  { name: "Logitech G Pro X", price: 549, slug: "logitech-g-pro-x", inStock: true },
];

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-sm text-muted-foreground">{wishlistItems.length} items</span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="mb-4 h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <h2 className="mb-2 text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mb-6 text-muted-foreground">Save items you love to your wishlist.</p>
          <Link href="/categories">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item) => (
            <div key={item.slug} className="group relative rounded-xl border bg-card shadow-sm transition hover:shadow-md">
              <div className="flex aspect-square items-center justify-center bg-muted">
                <svg className="h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z" />
                </svg>
              </div>
              <button className="absolute right-3 top-3 rounded-full bg-background p-1.5 shadow-sm">
                <svg className="h-4 w-4 fill-destructive text-destructive" viewBox="0 0 24 24">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
              <div className="p-4">
                {!item.inStock && <Badge variant="destructive" className="mb-2">Out of Stock</Badge>}
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-medium transition-colors hover:text-primary">{item.name}</h3>
                </Link>
                <p className="mt-1 font-semibold text-primary">AED {item.price.toLocaleString()}</p>
                <Button className="mt-3 w-full" size="sm" disabled={!item.inStock}>
                  {item.inStock ? "Add to Cart" : "Notify Me"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
