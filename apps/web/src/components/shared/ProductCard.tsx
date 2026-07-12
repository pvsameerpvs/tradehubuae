"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/data";

const BADGE_VALUES = ["Certified", "Great deal", "Like new", "Low stock", "Staff pick"] as const;

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-bg2">
        <div className="flex h-full w-full items-center justify-center text-ink-3">
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
        <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-105" />
        {product.badge && BADGE_VALUES.includes(product.badge as typeof BADGE_VALUES[number]) && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink shadow-chip">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label="Save to wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center"
        >
          <Heart className="h-5 w-5 stroke-white drop-shadow-lg" strokeWidth={2} fill="rgba(0,0,0,0.35)" />
        </button>
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="truncate text-[15px] font-semibold leading-[19px] text-ink">
          {product.name}
        </p>
        {product.specs && (
          <p className="truncate text-sm leading-[18px] text-ink-2">
            {product.specs}
          </p>
        )}
        <div className="flex items-baseline gap-1.5 text-sm">
          <span className="font-semibold text-ink">{product.price.toLocaleString()} AED</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-ink-2 line-through">{product.originalPrice.toLocaleString()} AED</span>
          )}
          {product.rating && (
            <>
              <span className="text-ink-3">·</span>
              <Star className="h-3.5 w-3.5 fill-ink text-ink" strokeWidth={0} />
              <span className="font-medium text-ink">{product.rating}</span>
              {product.reviewCount && (
                <span className="text-ink-2">({product.reviewCount})</span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export function WishlistCard({ product, onToggle }: { product: Product; onToggle?: () => void }) {
  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-bg2">
        <div className="flex h-full w-full items-center justify-center text-ink-3">
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
        <button
          type="button"
          aria-label="Remove from wishlist"
          onClick={(e) => {
            e.preventDefault();
            onToggle?.();
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm"
        >
          <Heart className="h-4 w-4 fill-brand text-brand" strokeWidth={2} />
        </button>
      </div>
      <div className="mt-2 space-y-0.5">
        <Link href={`/products/${product.slug}`}>
          <p className="truncate text-[15px] font-semibold leading-[19px] text-ink transition-colors hover:text-ink/70">
            {product.name}
          </p>
        </Link>
        <p className="text-sm font-semibold text-ink">{product.price.toLocaleString()} AED</p>
      </div>
    </div>
  );
}
