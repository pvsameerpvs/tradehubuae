"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { fetchProducts } from "@/data";
import type { Product } from "@/data";
import { CartItem } from "@/components/cart/CartItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";

export default function CartPage() {
  const {
    items,
    subtotal,
    shipping,
    activePromo,
    promoError,
    totalSavings,
    grandTotal,
    savingsBreakdown,
    updateQuantity,
    removeItem,
    applyPromoCode,
    removePromoCode,
  } = useCart();
  const [productMap, setProductMap] = useState<Map<string, Product>>(new Map());

  useEffect(() => {
    const slugs = items.map((i) => i.slug);
    if (slugs.length === 0) return;
    fetchProducts({ limit: 50 }).then((res) => {
      const map = new Map<string, Product>();
      res.products.forEach((p) => map.set(p.slug, p));
      setProductMap(map);
    });
  }, [items.length > 0 ? items.map((i) => i.slug).join(",") : ""]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-bg2">
            <ShoppingCart className="h-10 w-10 text-ink-3" strokeWidth={1} />
          </div>
          <h1 className="mb-2 text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
            Your cart is empty
          </h1>
          <p className="mb-8 text-center text-ink-2">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link
            href="/categories"
            className="flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-brand to-brand-dark px-8 text-base font-semibold text-white transition-all duration-200 hover:from-brand-dark hover:to-brand-dark"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/categories"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 hover:bg-bg3 transition-colors"
          aria-label="Continue shopping"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </Link>
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          Shopping Cart
        </h1>
        <span className="text-sm text-ink-3">({items.length} {items.length === 1 ? "item" : "items"})</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-line">
            {items.map((item) => {
              const p = productMap.get(item.slug);
              const maxStock = p?.stock ?? 99;
              return (
                <CartItem
                  key={item.slug}
                  item={item}
                  maxStock={maxStock}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            totalSavings={totalSavings}
            grandTotal={grandTotal}
            savingsBreakdown={savingsBreakdown}
          />

          <PromoCodeInput
            activePromo={activePromo}
            promoError={promoError}
            onApply={applyPromoCode}
            onRemove={removePromoCode}
          />
        </div>
      </div>
    </div>
  );
}
