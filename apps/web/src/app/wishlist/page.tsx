"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/data";
import type { Product } from "@/data";
import { WishlistCard } from "@/components/shared/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistPage() {
  const { slugs } = useWishlist();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slugs.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    fetchProducts({ limit: 100 })
      .then((res) => setItems(res.products.filter((p) => slugs.includes(p.slug))))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [slugs]);

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          My Wishlist
        </h1>
        <span className="text-sm text-ink-2">{items.length} items</span>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-line p-4">
              <div className="aspect-square animate-pulse rounded-lg bg-bg2" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-bg2" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-bg2" />
              <div className="h-8 w-full animate-pulse rounded-lg bg-bg2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist."
          action={{ label: "Browse Products", href: "/categories" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <WishlistCard key={item.slug} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
