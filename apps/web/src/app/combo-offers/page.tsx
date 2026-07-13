"use client";

import Link from "next/link";
import { Gift, Check, ShoppingCart, Star } from "lucide-react";
import { Badge } from "@tradehubuae/ui";
import { comboOffers } from "@/data";
import { useCart } from "@/lib/cart-context";

export default function ComboOffersPage() {
  const { addComboToCart } = useCart();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <div className="mb-10 text-center">
        <h1
          className="text-[26px] font-semibold leading-[30px] text-ink"
          style={{ letterSpacing: "-0.01em" }}
        >
          Combo Offers
        </h1>
        <p className="mt-1 text-sm text-ink-2">
          Save more when you buy together. Curated bundles for every need.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {comboOffers.map((combo) => (
          <div
            key={combo.id}
            className="group relative overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-card"
          >
            <Badge
              className="absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold"
              variant={
                combo.badge === "Best Value"
                  ? "success"
                  : combo.badge === "Popular" || combo.badge === "Staff Pick"
                    ? "default"
                    : "warning"
              }
            >
              {combo.badge}
            </Badge>

            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-bg2">
              <Gift
                className="h-20 w-20 text-brand/20"
                strokeWidth={1}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </div>

            <div className="p-5">
              <h3 className="text-[15px] font-semibold leading-[19px] text-ink">
                {combo.name}
              </h3>
              <p className="mt-1 text-sm text-ink-2">{combo.description}</p>

              <ul className="mt-4 space-y-1.5">
                {combo.items.map((item) => (
                  <li
                    key={item.slug}
                    className="flex items-center gap-2 text-sm text-ink-2"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={2.5} />
                    <Link
                      href={`/products/${item.slug}`}
                      className="hover:text-ink transition-colors"
                    >
                      {item.name}
                    </Link>
                    <span className="ml-auto text-xs text-ink-3">
                      &times;{item.quantity}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-xl font-bold text-ink">
                  AED {combo.price.toLocaleString()}
                </span>
                <span className="text-sm text-ink-3 line-through">
                  AED {combo.original.toLocaleString()}
                </span>
                <span className="ml-auto text-xs font-semibold text-brand">
                  -{combo.savingsPercent}%
                </span>
              </div>

              <div className="mt-1 flex items-center gap-1 text-xs text-ink-2">
                <Star className="h-3 w-3 text-brand" fill="currentColor" />
                Save AED {combo.savings.toLocaleString()}
              </div>

              <button
                type="button"
                onClick={() => addComboToCart(combo)}
                className="btn-brand mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base font-semibold text-white"
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                Add Bundle to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
