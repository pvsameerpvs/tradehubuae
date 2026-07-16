"use client";

import Link from "next/link";
import { Card, CardContent } from "@tradehubuae/ui";
import { ShoppingCart, Heart } from "lucide-react";
import { useRef, useState } from "react";
import type { Product } from "@/data";
import { useCart } from "@/lib/cart-context";
import { useCartFly } from "@/lib/cart-fly-context";
import { useWishlist } from "@/lib/wishlist-context";

export function LatestArrivalsCard({ product }: { product: Product }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { flyToCart } = useCartFly();
  const { isWishlisted, toggle } = useWishlist();
  const [imgError, setImgError] = useState(false);
  const wishlisted = isWishlisted(product.slug);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    if (imageRef.current) flyToCart(imageRef.current);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.slug);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block w-[300px] flex-shrink-0 sm:w-[340px]">
      <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-none transition-shadow duration-200 group-hover:shadow-card">
        <div ref={imageRef} className="relative aspect-square overflow-hidden bg-bg2">
          {!imgError && product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105" onError={() => setImgError(true)} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-3">
              <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-105" />

          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 opacity-100 backdrop-blur-sm transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:bg-white hover:scale-110"
          >
            <Heart
              className="h-[18px] w-[18px] transition-colors"
              strokeWidth={2}
              fill={wishlisted ? "currentColor" : "none"}
              color={wishlisted ? "#134A7C" : "rgba(0,0,0,0.35)"}
            />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 opacity-100 backdrop-blur-sm transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:bg-white hover:scale-110"
          >
            <ShoppingCart className="h-[18px] w-[18px] text-ink" strokeWidth={2} />
          </button>
        </div>
        <CardContent className="px-4 pb-4 pt-3">
          <h3 className="truncate text-[15px] font-semibold leading-[19px] text-ink">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[14px] font-semibold leading-[18px] text-brand">
            AED {product.price.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
