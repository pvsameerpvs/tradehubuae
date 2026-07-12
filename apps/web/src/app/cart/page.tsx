import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { cartItems as data, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/data";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and manage your shopping cart at TradeHub UAE",
};

function CartItemRow({ item }: { item: (typeof data)[number] }) {
  return (
    <div className="flex gap-4 border-b border-line py-4 last:border-0">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-bg2">
        <svg className="h-8 w-8 text-ink-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/products/${item.slug}`} className="text-[15px] font-semibold leading-[19px] text-ink hover:text-ink/70">
            {item.name}
          </Link>
          <p className="mt-0.5 text-sm text-ink-2">AED {item.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-line">
            <button className="flex h-11 w-11 items-center justify-center text-ink-2 hover:bg-bg3">
              <Minus className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <span className="flex h-11 w-12 items-center justify-center text-sm font-medium text-ink">{item.quantity}</span>
            <button className="flex h-11 w-11 items-center justify-center text-ink-2 hover:bg-bg3">
              <Plus className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
          <button className="flex items-center gap-1 text-sm text-ink-2 hover:text-sale">
            <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Remove
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-ink">AED {(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default function CartPage() {
  const subtotal = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-8">
      <h1 className="mb-8 text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
        Shopping Cart
      </h1>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingCart className="mb-4 h-16 w-16 text-ink-3" strokeWidth={1} />
          <h2 className="mb-2 text-xl font-semibold text-ink">Your cart is empty</h2>
          <p className="mb-6 text-ink-2">Looks like you haven&apos;t added anything yet.</p>
          <Link
            href="/categories"
            className="flex h-12 items-center justify-center rounded-lg bg-brand px-8 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Browse Categories
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {data.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl border border-line bg-white p-6 shadow-panel">
              <h2 className="mb-4 text-lg font-semibold text-ink">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-2">Subtotal</span>
                  <span className="text-ink">AED {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Shipping</span>
                  <span className="text-ink">{shipping === 0 ? "Free" : `AED ${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-ink-3">Free shipping on orders over AED {FREE_SHIPPING_THRESHOLD}</p>
                )}
                <div className="border-t border-line pt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-ink">Total</span>
                    <span className="text-ink">AED {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout">
                <div className="mt-6 flex h-12 w-full items-center justify-center rounded-lg text-base font-semibold text-white" style={{ background: "linear-gradient(90deg, #0FA06B 0%, #0B8A5B 50%, #086B47 100%)" }}>
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
