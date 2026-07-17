"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/supabase/provider";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist";

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
  const { user } = useAuth();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    if (user) {
      getWishlist().then((serverSlugs) => {
        if (serverSlugs.length > 0) {
          setSlugs(serverSlugs);
        } else {
          const local = loadWishlist();
          setSlugs(local);
        }
        setInitialized(true);
      }).catch(() => {
        setSlugs(loadWishlist());
        setInitialized(true);
      });
    } else {
      setSlugs(loadWishlist());
      setInitialized(true);
    }
  }, [user, initialized]);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      saveWishlist(slugs);
    }
  }, [slugs, user, initialized]);

  const add = useCallback((slug: string) => {
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      if (user) addToWishlist(slug);
      return [...prev, slug];
    });
  }, [user]);

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => {
      if (user) removeFromWishlist(slug);
      return prev.filter((s) => s !== slug);
    });
  }, [user]);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      if (prev.includes(slug)) {
        if (user) removeFromWishlist(slug);
        return prev.filter((s) => s !== slug);
      }
      if (user) addToWishlist(slug);
      return [...prev, slug];
    });
  }, [user]);

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
