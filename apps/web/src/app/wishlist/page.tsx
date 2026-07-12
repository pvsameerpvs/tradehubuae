import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { wishlistItems } from "@/data";
import { WishlistCard } from "@/components/shared/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your wishlist at TradeHub UAE",
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          My Wishlist
        </h1>
        <span className="text-sm text-ink-2">{wishlistItems.length} items</span>
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist."
          action={{ label: "Browse Products", href: "/categories" }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item) => (
            <WishlistCard key={item.slug} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
