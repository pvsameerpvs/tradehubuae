"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";

export function WishlistButton({ slug }: { slug: string }) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(slug);

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); toggle(slug); }}
      aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-bg3"
    >
      <Heart
        className="h-4 w-4 transition-colors"
        strokeWidth={1.75}
        fill={active ? "currentColor" : "none"}
        color={active ? "#134A7C" : undefined}
      />
    </button>
  );
}
