"use client";

import Link from "next/link";
import { ShoppingCart, Heart, ImageOff } from "lucide-react";
import { useRef, useState } from "react";
import type { Product } from "@/data";
import { useCart } from "@/lib/cart-context";
import { useCartFly } from "@/lib/cart-fly-context";
import { useWishlist } from "@/lib/wishlist-context";

export function ProductCard({ product }: { product: Product }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { flyToCart } = useCartFly();
  const [imgError, setImgError] = useState(false);
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.slug);
  const outOfStock = product.stock === undefined || product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product);
    if (imageRef.current) flyToCart(imageRef.current, product.image);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.slug);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl bg-white transition-shadow duration-200 hover:shadow-card"
    >
        <div ref={imageRef} className="relative aspect-square overflow-hidden bg-bg2">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-3">
            <ImageOff className="h-20 w-20" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-105" />

        {!outOfStock && product.stock! <= 3 && (
          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-amber-600 shadow-chip backdrop-blur-sm">
            Only {product.stock} left
          </div>
        )}
        {outOfStock && (
          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-sale shadow-chip backdrop-blur-sm">
            Out of stock
          </div>
        )}

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 opacity-100 backdrop-blur-sm transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:bg-white hover:scale-110"
        >
          <Heart
            className="h-[18px] w-[18px] transition-colors"
            strokeWidth={2}
            fill={wishlisted ? "currentColor" : "none"}
            color={wishlisted ? "#134A7C" : "rgba(0,0,0,0.35)"}
          />
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          aria-label="Add to cart"
          className={`absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 ${outOfStock ? "bg-bg2 text-ink-3 cursor-not-allowed" : "bg-white/80 hover:bg-white"}`}
        >
          <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </div>
      <div className="p-3">
        <p className="truncate text-[15px] font-semibold leading-[19px] text-ink">
          {product.name}
        </p>
        <p className="mt-0.5 text-[14px] font-semibold leading-[18px] text-brand">
          AED {product.price.toLocaleString()}
        </p>
        {!outOfStock && product.stock! <= 3 && (
          <p className="mt-0.5 text-[11px] text-amber-600">Only {product.stock} left</p>
        )}
        {outOfStock && (
          <p className="mt-0.5 text-[11px] text-sale">Out of stock</p>
        )}
      </div>
    </Link>
  );
}

export function WishlistCard({ product }: { product: Product }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();
  const { flyToCart } = useCartFly();
  const { remove } = useWishlist();
  const outOfStock = product.stock === undefined || product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product);
    if (imageRef.current) flyToCart(imageRef.current, product.image);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    remove(product.slug);
  };

  return (
    <div className="group overflow-hidden rounded-xl bg-white transition-shadow duration-200 hover:shadow-card">
      <div ref={imageRef} className="relative aspect-square overflow-hidden bg-bg2">
        {!imgError && product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-contain" onError={() => setImgError(true)} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-3">
            <ImageOff className="h-20 w-20" strokeWidth={1} />
          </div>
        )}

        {!outOfStock && product.stock! <= 3 && (
          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-amber-600 shadow-chip backdrop-blur-sm">
            Only {product.stock} left
          </div>
        )}
        {outOfStock && (
          <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-sale shadow-chip backdrop-blur-sm">
            Out of stock
          </div>
        )}

        <button
          type="button"
          onClick={handleRemove}
          aria-label="Remove from wishlist"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 opacity-100 backdrop-blur-sm transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:bg-white hover:scale-110"
        >
          <Heart className="h-[18px] w-[18px] fill-brand text-brand" strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          aria-label="Add to cart"
          className={`absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 ${outOfStock ? "bg-bg2 text-ink-3 cursor-not-allowed" : "bg-white/80 hover:bg-white"}`}
        >
          <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </div>
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <p className="truncate text-[15px] font-semibold leading-[19px] text-ink transition-colors hover:text-ink/70">
            {product.name}
          </p>
        </Link>
        <p className="mt-0.5 text-[14px] font-semibold leading-[18px] text-brand">
          AED {product.price.toLocaleString()}
        </p>
        {!outOfStock && (
          <p className="mt-0.5 text-[11px] text-ink-3">{product.stock} in stock</p>
        )}
        {outOfStock && (
          <p className="mt-0.5 text-[11px] text-sale">Out of stock</p>
        )}
      </div>
    </div>
  );
}
