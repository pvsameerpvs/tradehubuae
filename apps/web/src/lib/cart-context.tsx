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
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  shipping: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  shipping: 0,
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

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.slug !== slug));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const shipping = useMemo(
    () => (items.reduce((sum, item) => sum + item.price * item.quantity, 0) >= 500 ? 0 : 25),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      shipping,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, shipping],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
