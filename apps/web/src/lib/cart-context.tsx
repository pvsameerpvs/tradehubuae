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
import { searchProducts } from "@/data";
import type { ComboOffer } from "@/data";
import type { PromoCode } from "@/data/promoCodes";
import {
  validatePromoCode,
  calculatePromoDiscount,
} from "@/data/promoCodes";
import { getBulkDiscountPercent } from "@/data/bulkPricing";
import { fetchComboOffers } from "@/data/comboOffers";

export interface CartItem extends Product {
  quantity: number;
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
  activePromo: PromoCode | null;
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState("");
  const [comboOffersList, setComboOffersList] = useState<ComboOffer[]>([]);

  useEffect(() => {
    fetchComboOffers().then(setComboOffersList);
  }, []);

  function getAvailableStock(slug: string): number {
    const product = searchProducts.find((p) => p.slug === slug);
    return product?.stock ?? 99;
  }

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.slug === product.slug);
      const maxStock = getAvailableStock(product.slug);
      if (existing) {
        if (existing.quantity >= maxStock) return prev;
        return prev.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: Math.min(item.quantity + 1, maxStock) }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setActivePromo(null);
  }, []);

  const addComboToCart = useCallback((combo: ComboOffer) => {
    setItems((prev) => {
      const next = prev.map((i) => ({ ...i }));
      for (const ci of combo.items) {
        const existing = next.find((item) => item.slug === ci.slug);
        if (existing) {
          existing.quantity += ci.quantity;
        } else {
          const product = searchProducts.find((p) => p.slug === ci.slug);
          next.push({
            name: ci.name,
            price: product?.price ?? 0,
            category: product?.category ?? "",
            slug: ci.slug,
            quantity: ci.quantity,
          });
        }
      }
      return next;
    });
    setActivePromo(null);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.slug !== slug));
      return;
    }
    const maxStock = getAvailableStock(slug);
    setItems((prev) =>
      prev.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.min(quantity, maxStock) }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setActivePromo(null);
    setPromoError("");
  }, []);

  const applyPromoCode = useCallback(
    (code: string) => {
      const rawSubtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const result = validatePromoCode(code, rawSubtotal);
      if (result.valid && result.promo) {
        setActivePromo(result.promo);
        setPromoError("");
      } else {
        setActivePromo(null);
        setPromoError(result.error ?? "Invalid code");
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
    const base = subtotalAfterBulk - comboDiscount;
    return calculatePromoDiscount(activePromo, base);
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
