"use client";

import Link from "next/link";
import { Card, CardContent } from "@tradehubuae/ui";
import { Heart } from "lucide-react";
import type { Product } from "@/data";

const BADGE_VALUES = ["Certified", "Great deal", "Like new", "Low stock", "Staff pick"] as const;

export function LatestArrivalsCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="block w-[280px] flex-shrink-0 sm:w-[300px]">
      <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-none transition-shadow duration-200 hover:shadow-card">
        <div className="relative aspect-square overflow-hidden bg-bg2">
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
        <CardContent className="px-4 pb-4 pt-3">
          <h3 className="text-[18px] font-bold leading-[24px] text-ink">
            {product.name}
          </h3>
          <p className="mt-1.5 text-base font-semibold text-ink">
            {product.price.toLocaleString()} AED
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
