"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  Tag,
  Gift,
  AlertTriangle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { searchProducts } from "@/data";

export default function CartPage() {
  const {
    items,
    subtotal,
    shipping,
    activePromo,
    totalSavings,
    grandTotal,
    savingsBreakdown,
    updateQuantity,
    removeItem,
    removePromoCode,
  } = useCart();

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6">
      <h1
        className="mb-8 text-[26px] font-semibold leading-[30px] text-ink"
        style={{ letterSpacing: "-0.01em" }}
      >
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingCart
            className="mb-4 h-16 w-16 text-ink-3"
            strokeWidth={1}
          />
          <h2 className="mb-2 text-xl font-semibold text-ink">
            Your cart is empty
          </h2>
          <p className="mb-6 text-ink-2">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link
            href="/categories"
            className="btn-brand flex h-12 items-center justify-center rounded-lg px-8 text-base font-semibold text-white"
          >
            Browse Categories
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex gap-4 border-b border-line py-4 last:border-0"
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-bg2">
                  <svg
                    className="h-8 w-8 text-ink-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-[15px] font-semibold leading-[19px] text-ink hover:text-ink/70"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-ink-2">
                      AED {item.price.toFixed(2)} each
                    </p>
                    {(() => {
                      const p = searchProducts.find((p) => p.slug === item.slug);
                      const maxStock = p?.stock ?? 99;
                      return (
                        <>
                          {maxStock <= 3 && maxStock > 0 && (
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-600">
                              <AlertTriangle className="h-3 w-3" strokeWidth={2} />
                              Only {maxStock} left in stock
                            </p>
                          )}
                          {item.quantity >= maxStock && (
                            <p className="mt-0.5 text-xs text-sale">
                              Max stock reached
                            </p>
                          )}
                          {item.quantity >= 2 && (
                            <p className="mt-0.5 text-xs text-brand">
                              Bulk pricing applied
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-line">
                      <button
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity - 1)
                        }
                        className="flex h-11 w-11 items-center justify-center text-ink-2 hover:bg-bg3"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <span className="flex h-11 w-12 items-center justify-center text-sm font-medium text-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity + 1)
                        }
                        className="flex h-11 w-11 items-center justify-center text-ink-2 hover:bg-bg3"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.slug)}
                      className="flex items-center gap-1 text-sm text-ink-2 hover:text-sale"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-ink">
                    AED {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl border border-line bg-white p-6 shadow-panel">
              <h2 className="mb-4 text-lg font-semibold text-ink">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-2">Subtotal</span>
                  <span className="text-ink">
                    AED {subtotal.toFixed(2)}
                  </span>
                </div>

                {savingsBreakdown.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between text-brand"
                  >
                    <span className="flex items-center gap-1">
                      {s.label === "Bulk discount" && (
                        <Package className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      {s.label.startsWith("Promo") && (
                        <Tag className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      {s.label === "Combo savings" && (
                        <Gift className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      {s.label}
                    </span>
                    <span>-AED {s.amount.toFixed(2)}</span>
                  </div>
                ))}

                {totalSavings > 0 && (
                  <div className="flex justify-between text-xs text-ink-3 border-t border-line pt-2">
                    <span>You save</span>
                    <span className="font-medium text-brand">
                      AED {totalSavings.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-ink-2">Shipping</span>
                  <span
                    className={
                      shipping === 0 ? "font-medium text-brand" : "text-ink"
                    }
                  >
                    {shipping === 0 ? "Free" : `AED ${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-ink-3">
                    Free shipping on orders over AED 500
                  </p>
                )}

                <div className="border-t border-line pt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-ink">Total</span>
                    <span className="text-ink">
                      AED {grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {activePromo && (
                <div className="mt-4 flex items-center justify-between rounded-lg border border-brand/30 bg-brand/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-brand" strokeWidth={2} />
                    <span className="text-sm font-semibold text-brand">
                      {activePromo.code}
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-sm text-ink-3 hover:text-sale transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}

              <Link href="/checkout">
                <div className="btn-brand mt-6 flex h-12 w-full items-center justify-center rounded-lg text-base font-semibold text-white">
                  Proceed to Checkout
                </div>
              </Link>
              <Link href="/categories">
                <div className="mt-2 flex h-12 w-full items-center justify-center rounded-lg border border-ink text-base font-semibold text-ink transition-colors hover:bg-bg3">
                  Continue Shopping
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
