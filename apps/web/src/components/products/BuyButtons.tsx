"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus, AlertTriangle, LogIn } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCartFly } from "@/lib/cart-fly-context";
import { Button } from "@tradehubuae/ui";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/lib/supabase/provider";
import { getBulkDiscountPercent } from "@/data/bulkPricing";
import type { Product } from "@/data";

function QtySelector({ qty, onChange, compact, max, disabled: outOfStock }: { qty: number; onChange: (d: number) => void; compact?: boolean; max?: number; disabled?: boolean }) {
  const size = compact ? "h-8 w-8" : "h-10 w-10";
  const iconSize = compact ? "h-3 w-3" : "h-4 w-4";
  const atMin = qty <= 1;
  const atMax = max !== undefined && qty >= max;

  return (
    <div className={`inline-flex items-center rounded-lg border ${outOfStock ? "border-line bg-bg2" : "border-line bg-white"}`}>
      <button
        type="button"
        onClick={() => onChange(-1)}
        disabled={outOfStock || atMin}
        aria-label="Decrease quantity"
        className={`${size} flex items-center justify-center text-ink transition-all duration-150 hover:bg-bg3 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <Minus className={iconSize} strokeWidth={1.75} />
      </button>
      <span className={`min-w-[36px] text-center text-sm font-semibold select-none ${outOfStock ? "text-ink-3" : "text-ink"}`} aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={outOfStock || atMax}
        aria-label="Increase quantity"
        className={`${size} flex items-center justify-center text-ink transition-all duration-150 hover:bg-bg3 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <Plus className={iconSize} strokeWidth={1.75} />
      </button>
    </div>
  );
}

let nextPopId = 0;

export function BuyButtons({ product }: { product: Product }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, updateQuantity } = useCart();
  const { flyToCart } = useCartFly();
  const imageRef = useRef<HTMLDivElement>(null);
  const stock = product.stock;
  const outOfStock = stock === undefined || stock === 0;
  const maxStock = outOfStock ? 0 : stock;
  const [qty, setQty] = useState(outOfStock ? 0 : 1);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingAction, setPendingAction] = useState<"cart" | "buy" | null>(null);

  const [pops, setPops] = useState<{ id: number; percent: number }[]>([]);
  const prevBulkPct = useRef(0);
  const bulkTimer = useRef<ReturnType<typeof setTimeout>>();

  const bulkDiscountPct = getBulkDiscountPercent(qty, product.slug);

  useEffect(() => {
    if (outOfStock) return;
    if (bulkDiscountPct > prevBulkPct.current) {
      const id = nextPopId++;
      setPops((prev) => [...prev, { id, percent: bulkDiscountPct }]);
      clearTimeout(bulkTimer.current);
      bulkTimer.current = setTimeout(() => {
        setPops((prev) => prev.filter((p) => p.id !== id));
      }, 2100);
    }
    prevBulkPct.current = bulkDiscountPct;
    return () => clearTimeout(bulkTimer.current);
  }, [qty, bulkDiscountPct, outOfStock]);

  const handleQtyChange = (delta: number) => {
    setQty((prev) => Math.max(outOfStock ? 0 : 1, Math.min(maxStock, prev + delta)));
  };

  const addToCartWithQty = () => {
    addItem(product);
    if (qty > 1) updateQuantity(product.slug, qty);
  };

  const handleBuyNow = () => {
    if (!user) {
      setPendingAction("buy");
      setShowAuth(true);
      return;
    }
    addToCartWithQty();
    router.push("/checkout");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setPendingAction("cart");
      setShowAuth(true);
      return;
    }
    addToCartWithQty();
    if (imageRef.current) flyToCart(imageRef.current, product.image);
  };

  const handleSignedIn = () => {
    setShowAuth(false);
    if (pendingAction === "buy") {
      addToCartWithQty();
      router.push("/checkout");
    } else if (pendingAction === "cart") {
      addToCartWithQty();
      if (imageRef.current) flyToCart(imageRef.current, product.image);
    }
    setPendingAction(null);
  };

  const totalPrice = product.price * qty;

  return (
    <>
      {!outOfStock && maxStock <= 3 && (
        <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.75} />
          <span className="text-xs font-medium text-amber-700">Only {maxStock} left — order soon</span>
        </div>
      )}
      {outOfStock && (
        <div className="rounded-lg bg-sale/10 px-3 py-2 text-center text-xs font-medium text-sale">
          Out of stock
        </div>
      )}

      <div ref={imageRef} className="space-y-3">
        <div className={`flex items-center justify-between rounded-xl p-3 ${outOfStock ? "bg-bg2" : "bg-bg2"}`}>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${outOfStock ? "text-ink-3" : "text-ink-2"}`}>Qty</span>
            <QtySelector qty={qty} onChange={handleQtyChange} max={maxStock} disabled={outOfStock} />
            {!outOfStock && qty >= maxStock && (
              <span className="text-[10px] text-ink-3">Max</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-2">Total</p>
            <div className="flex items-center gap-2 justify-end">
              <p className="text-lg font-bold text-ink">
                AED {totalPrice.toLocaleString()}
              </p>
              {bulkDiscountPct > 0 && (
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-bold text-brand animate-in fade-in zoom-in-75 duration-200">
                  -{bulkDiscountPct}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="hidden gap-2 md:flex">
          <Button variant="secondary" size="lg" className="flex-1 transition-all duration-150 active:scale-[0.98]" onClick={handleAddToCart} disabled={outOfStock}>
            <ShoppingCart className="mr-2 h-4 w-4" strokeWidth={1.75} />
            Add to cart
          </Button>
          <Button size="lg" className="flex-1 transition-all duration-150 active:scale-[0.98]" onClick={handleBuyNow} disabled={outOfStock}>
            Buy now
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="text-left">
            <p className="text-xs text-ink-2">Total</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-ink">
                AED {totalPrice.toLocaleString()}
              </p>
              {bulkDiscountPct > 0 && (
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-bold text-brand animate-in fade-in zoom-in-75 duration-200">
                  -{bulkDiscountPct}%
                </span>
              )}
            </div>
          </div>
          <Button size="lg" onClick={handleBuyNow} className="min-w-[100px] transition-all duration-150 active:scale-[0.98]" disabled={outOfStock}>
            {outOfStock ? "Out of Stock" : "Buy now"}
          </Button>
        </div>
      </div>

      {typeof document !== "undefined" && pops.length > 0 && createPortal(
        <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center">
          {pops.map((p) => (
            <span
              key={p.id}
              className="animate-bulk-pop text-5xl font-extrabold text-brand drop-shadow-xl"
            >
              {p.percent}% OFF
            </span>
          ))}
        </div>,
        document.body,
      )}

      {/* AUTH MODAL */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
              <LogIn className="h-6 w-6 text-brand" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-semibold text-ink">Sign in to continue</h3>
            <p className="mt-1 text-sm text-ink-2">
              {pendingAction === "buy" ? "Sign in to proceed with your purchase." : "Sign in to add items to your cart."}
            </p>
            <div className="mt-5">
              <GoogleSignInButton onSignIn={handleSignedIn} onClose={() => { setShowAuth(false); setPendingAction(null); }} closeLabel="Continue browsing" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
