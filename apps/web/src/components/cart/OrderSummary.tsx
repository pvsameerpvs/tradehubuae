"use client";

import Link from "next/link";
import { Package, Tag, Gift } from "lucide-react";
import type { SavingsEntry } from "@/lib/cart-context";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  totalSavings: number;
  grandTotal: number;
  savingsBreakdown: SavingsEntry[];
}

function SavingsIcon({ label }: { label: string }) {
  if (label === "Bulk discount") return <Package className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />;
  if (label.startsWith("Promo")) return <Tag className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />;
  if (label === "Combo savings") return <Gift className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />;
  return null;
}

export function OrderSummary({
  subtotal,
  shipping,
  totalSavings,
  grandTotal,
  savingsBreakdown,
}: OrderSummaryProps) {
  return (
    <div className="rounded-xl border border-line bg-white p-6 shadow-panel">
      <h2 className="mb-5 text-lg font-semibold text-ink">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-2">Subtotal</span>
          <span className="text-ink tabular-nums">AED {subtotal.toFixed(2)}</span>
        </div>

        {savingsBreakdown.length > 0 && (
          <div className="space-y-2 border-b border-line pb-3">
            {savingsBreakdown.map((s) => (
              <div key={s.label} className="flex justify-between text-brand">
                <span className="flex items-center gap-1.5">
                  <SavingsIcon label={s.label} />
                  <span className="text-xs">{s.label}</span>
                </span>
                <span className="tabular-nums">-AED {s.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {totalSavings > 0 && (
          <div className="flex justify-between text-xs text-ink-3">
            <span>You save</span>
            <span className="font-medium text-brand tabular-nums">
              AED {totalSavings.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-ink-2">Shipping</span>
          <span
            className={
              shipping === 0
                ? "font-medium text-brand tabular-nums"
                : "text-ink tabular-nums"
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

        <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
          <span className="text-ink">Total</span>
          <span className="text-ink tabular-nums">
            AED {grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <Link href="/checkout">
        <div className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-brand to-brand-dark text-base font-semibold text-white transition-all duration-200 hover:from-brand-dark hover:to-brand-dark">
          Proceed to Checkout
        </div>
      </Link>

      <Link href="/categories">
        <div className="mt-2 flex h-12 w-full items-center justify-center rounded-lg border border-ink text-base font-semibold text-ink transition-colors hover:bg-bg3">
          Continue Shopping
        </div>
      </Link>
    </div>
  );
}
