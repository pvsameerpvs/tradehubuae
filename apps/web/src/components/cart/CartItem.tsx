"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, AlertTriangle, ImageOff } from "lucide-react";
import type { CartItem as CartItemType } from "@/lib/cart-context";

interface CartItemProps {
  item: CartItemType;
  maxStock: number;
  onUpdateQuantity: (slug: string, quantity: number) => void;
  onRemove: (slug: string) => void;
}

export function CartItem({ item, maxStock, onUpdateQuantity, onRemove }: CartItemProps) {
  const unitPrice = item.price;
  const totalPrice = unitPrice * item.quantity;

  return (
    <div className="flex gap-4 border-b border-line py-5 last:border-0">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-bg2 sm:h-28 sm:w-28"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain"
            sizes="112px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-3">
            <ImageOff className="h-8 w-8" strokeWidth={1} />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <Link
            href={`/products/${item.slug}`}
            className="text-[15px] font-semibold leading-[19px] text-ink hover:text-ink/70 line-clamp-1"
          >
            {item.name}
          </Link>
          <p className="mt-0.5 text-sm text-ink-2">
            AED {unitPrice.toFixed(2)} each
          </p>

          {maxStock <= 3 && maxStock > 0 && (
            <p className="mt-1 flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3 shrink-0" strokeWidth={2} />
              Only {maxStock} left
            </p>
          )}
          {item.quantity >= maxStock && (
            <p className="mt-0.5 text-xs text-sale">Max stock reached</p>
          )}
          {item.quantity >= 2 && (
            <p className="mt-0.5 text-xs text-brand">Bulk pricing applied</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-line">
            <button
              onClick={() => onUpdateQuantity(item.slug, item.quantity - 1)}
              className="flex h-10 w-10 items-center justify-center text-ink-2 hover:bg-bg3 transition-colors rounded-l-lg"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <span className="flex h-10 w-10 items-center justify-center text-sm font-medium text-ink select-none tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.slug, item.quantity + 1)}
              className="flex h-10 w-10 items-center justify-center text-ink-2 hover:bg-bg3 transition-colors rounded-r-lg"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-semibold text-ink tabular-nums whitespace-nowrap">
              AED {totalPrice.toFixed(2)}
            </p>
            <button
              onClick={() => onRemove(item.slug)}
              className="flex items-center justify-center text-ink-3 hover:text-sale transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
