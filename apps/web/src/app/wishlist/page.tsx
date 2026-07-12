import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@tradehubuae/ui";
import { Heart } from "@/components/icons";
import { wishlistItems } from "@/data";
import { WishlistCard } from "@/components/shared/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your wishlist at TradeHub UAE",
};

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <span className="text-sm text-muted-foreground">{wishlistItems.length} items</span>
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist."
          action={{ label: "Browse Products", href: "/categories" }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item) => (
            <WishlistCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
