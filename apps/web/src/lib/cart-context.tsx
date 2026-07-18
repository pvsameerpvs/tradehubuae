"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import type { Product } from "@/data";
import type { ComboOffer } from "@/data";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/supabase/provider";
import { getBulkDiscountPercent } from "@/data/bulkPricing";
import { fetchComboOffers } from "@/data/comboOffers";

export interface CartItem extends Product {
  quantity: number;
}

export interface ActivePromo {
  code: string;
  description?: string;
  type: string;
  discount: number;
}

export interface SavingsEntry {
  label: string;
  amount: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  addItem: (product: Product) => void;
  addComboToCart: (combo: ComboOffer) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shipping: number;
  bulkSavings: number;
  comboDiscount: number;
  activePromo: ActivePromo | null;
  promoDiscount: number;
  promoError: string;
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;
  totalSavings: number;
  grandTotal: number;
  savingsBreakdown: SavingsEntry[];
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  addItem: () => {},
  addComboToCart: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  subtotal: 0,
  shipping: 0,
  bulkSavings: 0,
  comboDiscount: 0,
  activePromo: null,
  promoDiscount: 0,
  promoError: "",
  applyPromoCode: () => {},
  removePromoCode: () => {},
  totalSavings: 0,
  grandTotal: 0,
  savingsBreakdown: [],
});

const CART_KEY = "tradehub_cart";

function normalizeItem(item: Partial<CartItem>): CartItem {
  return { ...item, price: Number(item.price ?? 0) } as CartItem;
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]).map(normalizeItem) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded, silently ignore */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [activePromo, setActivePromo] = useState<ActivePromo | null>(null);
  const [promoError, setPromoError] = useState("");
  const [comboOffersList, setComboOffersList] = useState<ComboOffer[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchComboOffers().then(setComboOffersList);
  }, []);

  useEffect(() => {
    if (initialized) return;
    if (user) {
      api.get<{ items: CartItem[] }>("/cart").then((res) => {
        if (res.items && res.items.length > 0) {
          setItems(res.items.map(normalizeItem));
        } else {
          const local = loadCart();
          if (local.length > 0) setItems(local);
        }
        setInitialized(true);
      }).catch(() => {
        setItems(loadCart());
        setInitialized(true);
      });
    } else {
      setItems(loadCart());
      setInitialized(true);
    }
  }, [user, initialized]);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      saveCart(items);
    }
  }, [items, user, initialized]);

  const getAvailableStock = useCallback((slug: string): number => {
    const item = items.find((i) => i.slug === slug);
    return item?.stock ?? 99;
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.slug === product.slug);
      const maxStock = product.stock ?? 99;
      let newItems: CartItem[];
      if (existing) {
        if (existing.quantity >= maxStock) return prev;
        newItems = prev.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: Math.min(item.quantity + 1, maxStock) }
            : item,
        );
      } else {
        newItems = [...prev, normalizeItem({ ...product, quantity: 1 })];
      }
      if (user) {
        const updatedItem = newItems.find((i) => i.slug === product.slug);
        if (updatedItem) {
          api.post("/cart", { slug: product.slug, quantity: updatedItem.quantity }).catch((err) => console.error("[Cart] Sync failed:", err));
        }
      }
      return newItems;
    });
    setActivePromo(null);
  }, [user]);

  const addComboToCart = useCallback((combo: ComboOffer) => {
    setItems((prev) => {
      const next = prev.map((i) => ({ ...i }));
      for (const ci of combo.items) {
        const existing = next.find((item) => item.slug === ci.slug);
        if (existing) {
          existing.quantity += ci.quantity;
        } else {
          next.push(normalizeItem({
            id: ci.id ?? ci.slug,
            name: ci.name,
            price: ci.price,
            categoryName: "",
            categorySlug: "",
            slug: ci.slug,
            quantity: ci.quantity,
            stock: 99,
          }));
        }
      }
      if (user) {
        for (const ci of combo.items) {
          const updatedItem = next.find((i) => i.slug === ci.slug);
          if (updatedItem) {
            api.post("/cart", { slug: ci.slug, quantity: updatedItem.quantity }).catch((err) => console.error("[Cart] Sync failed:", err));
          }
        }
      }
      return next;
    });
    setActivePromo(null);
  }, [user]);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => {
      if (user) {
        api.delete(`/cart/${encodeURIComponent(slug)}`).catch((err) => console.error("[Cart] Sync failed:", err));
      }
      return prev.filter((item) => item.slug !== slug);
    });
  }, [user]);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => {
        if (user) {
        api.delete(`/cart/${encodeURIComponent(slug)}`).catch((err) => console.error("[Cart] Sync failed:", err));
        }
        return prev.filter((item) => item.slug !== slug);
      });
      return;
    }
    const maxStock = getAvailableStock(slug);
    setItems((prev) => {
      if (user) {
        api.put(`/cart/${encodeURIComponent(slug)}`, { quantity: Math.min(quantity, maxStock) }).catch(() => {});
      }
      return prev.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.min(quantity, maxStock) }
          : item,
      );
    });
  }, [getAvailableStock, user]);

  const clearCart = useCallback(() => {
    setItems([]);
    setActivePromo(null);
    setPromoError("");
    if (user) {
      api.delete("/cart").catch((err) => console.error("[Cart] Sync failed:", err));
    }
  }, [user]);

  const applyPromoCode = useCallback(
    async (code: string) => {
      const rawSubtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      try {
        const result = await api.get<{ valid: boolean; promo?: ActivePromo; error?: string }>(
          `/coupons/validate/${encodeURIComponent(code)}`,
          { orderTotal: rawSubtotal },
        );
        if (result.valid && result.promo) {
          setActivePromo({ code: result.promo.code, description: result.promo.description, type: result.promo.type, discount: result.promo.discount });
          setPromoError("");
        } else {
          setActivePromo(null);
          setPromoError(result.error ?? "Invalid code");
        }
      } catch {
        setActivePromo(null);
        setPromoError("Failed to validate code");
      }
    },
    [items],
  );

  const removePromoCode = useCallback(() => {
    setActivePromo(null);
    setPromoError("");
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const itemBulkDiscounts = useMemo(() => {
    return items.map((item) => {
      const pct = getBulkDiscountPercent(item.quantity, item.slug);
      return { slug: item.slug, saving: (item.price * item.quantity * pct) / 100 };
    });
  }, [items]);

  const bulkSavings = useMemo(
    () => itemBulkDiscounts.reduce((s, d) => s + d.saving, 0),
    [itemBulkDiscounts],
  );

  const subtotalAfterBulk = subtotal - bulkSavings;

  const comboDiscount = useMemo(() => {
    const slugs = items.map((i) => i.slug);
    const slugSet = new Set(slugs);
    for (const combo of comboOffersList) {
      const comboSlugs = combo.items.map((i) => i.slug);
      if (comboSlugs.every((s) => slugSet.has(s))) {
        return combo.original - combo.price;
      }
    }
    return 0;
  }, [items, comboOffersList]);

  const promoDiscount = useMemo(() => {
    if (!activePromo) return 0;
    return Math.min(activePromo.discount, Math.max(0, subtotalAfterBulk - comboDiscount));
  }, [activePromo, subtotalAfterBulk, comboDiscount]);

  const totalAfterDiscounts =
    subtotalAfterBulk - comboDiscount - promoDiscount;

  const shipping = useMemo(
    () => (totalAfterDiscounts >= 500 ? 0 : 25),
    [totalAfterDiscounts],
  );

  const totalSavings = useMemo(
    () => bulkSavings + comboDiscount + promoDiscount,
    [bulkSavings, comboDiscount, promoDiscount],
  );

  const savingsBreakdown = useMemo(() => {
    const breakdown: SavingsEntry[] = [];
    if (bulkSavings > 0)
      breakdown.push({ label: "Bulk discount", amount: bulkSavings });
    if (comboDiscount > 0)
      breakdown.push({ label: "Combo savings", amount: comboDiscount });
    if (promoDiscount > 0)
      breakdown.push({
        label: `Promo ${activePromo?.code ?? ""}`,
        amount: promoDiscount,
      });
    return breakdown;
  }, [bulkSavings, comboDiscount, promoDiscount, activePromo]);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addItem,
      addComboToCart,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      shipping,
      bulkSavings,
      comboDiscount,
      activePromo,
      promoDiscount,
      promoError,
      applyPromoCode,
      removePromoCode,
      totalSavings,
      grandTotal: Math.max(0, totalAfterDiscounts + shipping),
      savingsBreakdown,
    }),
    [
      items,
      addItem,
      addComboToCart,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      shipping,
      bulkSavings,
      comboDiscount,
      activePromo,
      promoDiscount,
      promoError,
      applyPromoCode,
      removePromoCode,
      totalSavings,
      totalAfterDiscounts,
      savingsBreakdown,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
