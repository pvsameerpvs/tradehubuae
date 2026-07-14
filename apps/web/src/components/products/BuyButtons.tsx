"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus, AlertTriangle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCartFly } from "@/lib/cart-fly-context";
import { Button } from "@tradehubuae/ui";
import { searchProducts } from "@/data";
import type { Product } from "@/data";

function QtySelector({ qty, onChange, compact, max }: { qty: number; onChange: (d: number) => void; compact?: boolean; max?: number }) {
  const size = compact ? "h-8 w-8" : "h-10 w-10";
  const iconSize = compact ? "h-3 w-3" : "h-4 w-4";
  const atMax = max !== undefined && qty >= max;

  return (
    <div className="inline-flex items-center rounded-lg border border-line bg-white">
      <button
        type="button"
        onClick={() => onChange(-1)}
        disabled={qty <= 1}
        aria-label="Decrease quantity"
        className={`${size} flex items-center justify-center text-ink transition-all duration-150 hover:bg-bg3 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <Minus className={iconSize} strokeWidth={1.75} />
      </button>
      <span className="min-w-[36px] text-center text-sm font-semibold text-ink select-none" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={atMax}
        aria-label="Increase quantity"
        className={`${size} flex items-center justify-center text-ink transition-all duration-150 hover:bg-bg3 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <Plus className={iconSize} strokeWidth={1.75} />
      </button>
    </div>
  );
}

function AnimatedPrice({ amount, label }: { amount: number; label?: string }) {
  const [bounce, setBounce] = useState(false);
  const prev = useRef(amount);

  useEffect(() => {
    if (prev.current === amount) return;
    setBounce(true);
    prev.current = amount;
    const t = setTimeout(() => setBounce(false), 300);
    return () => clearTimeout(t);
  }, [amount]);

  return (
    <div className="text-right">
      {label && <p className="text-xs text-ink-2">{label}</p>}
      <p
        className={`text-lg font-bold text-ink transition-all duration-200 ${bounce ? "scale-110 text-brand" : "scale-100"}`}
      >
        AED {amount.toLocaleString()}
      </p>
    </div>
  );
}

export function BuyButtons({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, updateQuantity } = useCart();
  const { flyToCart } = useCartFly();
  const imageRef = useRef<HTMLDivElement>(null);
  const [qty, setQty] = useState(1);

  const productData = searchProducts.find((p) => p.slug === product.slug);
  const maxStock = productData?.stock ?? 99;

  const handleQtyChange = (delta: number) => {
    setQty((prev) => Math.max(1, Math.min(maxStock, prev + delta)));
  };

  const addToCartWithQty = () => {
    addItem(product);
    if (qty > 1) updateQuantity(product.slug, qty);
  };

  const handleBuyNow = () => {
    addToCartWithQty();
    router.push("/checkout");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartWithQty();
    if (imageRef.current) flyToCart(imageRef.current);
  };

  const totalPrice = product.price * qty;

  return (
    <>
      {maxStock <= 3 && maxStock > 0 && (
        <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.75} />
          <span className="text-xs font-medium text-amber-700">Only {maxStock} left — order soon</span>
        </div>
      )}
      {maxStock === 0 && (
        <div className="rounded-lg bg-sale/10 px-3 py-2 text-center text-xs font-medium text-sale">
          Currently out of stock
        </div>
      )}

      <div ref={imageRef} className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-bg2 p-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-ink-2">Qty</span>
            <QtySelector qty={qty} onChange={handleQtyChange} max={maxStock} />
            {qty >= maxStock && (
              <span className="text-[10px] text-ink-3">Max</span>
            )}
          </div>
          <AnimatedPrice amount={totalPrice} label="Total" />
        </div>

        <div className="hidden gap-2 md:flex">
          <Button variant="secondary" size="lg" className="flex-1 transition-all duration-150 active:scale-[0.98]" onClick={handleAddToCart} disabled={maxStock === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" strokeWidth={1.75} />
            Add to cart
          </Button>
          <Button size="lg" className="flex-1 transition-all duration-150 active:scale-[0.98]" onClick={handleBuyNow} disabled={maxStock === 0}>
            Buy now
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
        <div className="flex items-center justify-between gap-2">
          <AnimatedPrice amount={totalPrice} label="Total" />
          <Button size="lg" onClick={handleBuyNow} className="min-w-[100px] transition-all duration-150 active:scale-[0.98]" disabled={maxStock === 0}>
            Buy now
          </Button>
        </div>
      </div>
    </>
  );
}
