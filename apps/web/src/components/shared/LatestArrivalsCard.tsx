import Link from "next/link";
import { Card, CardContent } from "@tradehubuae/ui";
import type { Product } from "@/data";

export function LatestArrivalsCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="block w-[300px] flex-shrink-0 sm:w-[340px]">
      <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-none transition-shadow duration-200 hover:shadow-card">
        <div className="relative aspect-square overflow-hidden bg-bg2">
          <div className="flex h-full w-full items-center justify-center text-ink-3">
            <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-105" />
        </div>
        <CardContent className="px-4 pb-4 pt-3">
          <h3 className="text-[17px] font-semibold leading-[22px] text-ink">
            {product.name}
          </h3>
          <p className="mt-1 text-[15px] font-semibold leading-[19px] text-brand">
            AED {product.price.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
