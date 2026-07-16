"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";

const WISHLIST_KEY = "tradehub_wishlist";

function loadWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(slugs: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(slugs));
  } catch {
    /* quota exceeded */
  }
}

interface WishlistContextType {
  slugs: string[];
  count: number;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  slugs: [],
  count: 0,
  add: () => {},
  remove: () => {},
  toggle: () => {},
  isWishlisted: () => false,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>(loadWishlist);

  useEffect(() => {
    saveWishlist(slugs);
  }, [slugs]);

  const add = useCallback((slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const isWishlisted = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const value = useMemo(
    () => ({ slugs, count: slugs.length, add, remove, toggle, isWishlisted }),
    [slugs, add, remove, toggle, isWishlisted],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
