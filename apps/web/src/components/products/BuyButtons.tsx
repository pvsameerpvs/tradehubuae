"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useCartFly } from "@/lib/cart-fly-context";
import { useRef } from "react";
import type { Product } from "@/data";

export function BuyButtons({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { flyToCart } = useCartFly();
  const imageRef = useRef<HTMLDivElement>(null);

  const handleBuyNow = () => {
    addItem(product);
    router.push("/checkout");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    if (imageRef.current) flyToCart(imageRef.current);
  };

  return (
    <>
      <div ref={imageRef} className="hidden space-y-3 md:block">
        <button
          type="button"
          onClick={handleBuyNow}
          className="btn-brand flex h-12 w-full items-center justify-center rounded-lg text-base font-semibold text-white"
        >
          Buy now
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex h-12 w-full items-center justify-center rounded-lg border border-ink text-base font-semibold text-ink transition-colors hover:bg-bg3"
        >
          Add to cart
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white p-4 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-2">Total</p>
            <p className="text-lg font-semibold text-ink">{product.price.toLocaleString()} AED</p>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            className="btn-brand flex h-12 items-center justify-center rounded-lg px-8 text-base font-semibold text-white"
          >
            Buy now
          </button>
        </div>
      </div>
    </>
  );
}
