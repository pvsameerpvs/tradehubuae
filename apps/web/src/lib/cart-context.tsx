"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Product } from "@/data";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  addItem: () => {},
  removeItem: () => {},
  total: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.slug === product.slug);
      if (existing) {
        return prev.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addItem,
      removeItem,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    [items, addItem, removeItem],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
