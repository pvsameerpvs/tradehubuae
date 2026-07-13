import Link from "next/link";
import type { Product } from "@/data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl bg-white transition-shadow duration-200 hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-bg2">
        <div className="flex h-full w-full items-center justify-center text-ink-3">
          <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
        <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-105" />
      </div>
      <div className="p-3">
        <p className="truncate text-[15px] font-semibold leading-[19px] text-ink">
          {product.name}
        </p>
        <p className="mt-0.5 text-[14px] font-semibold leading-[18px] text-brand">
          AED {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export function WishlistCard({ product, onToggle }: { product: Product; onToggle?: () => void }) {
  return (
    <div className="group overflow-hidden rounded-xl bg-white transition-shadow duration-200 hover:shadow-card">
      <div className="relative aspect-square overflow-hidden bg-bg2">
        <div className="flex h-full w-full items-center justify-center text-ink-3">
          <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
      </div>
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <p className="truncate text-[15px] font-semibold leading-[19px] text-ink transition-colors hover:text-ink/70">
            {product.name}
          </p>
        </Link>
        <p className="mt-0.5 text-[14px] font-semibold leading-[18px] text-brand">
          AED {product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
