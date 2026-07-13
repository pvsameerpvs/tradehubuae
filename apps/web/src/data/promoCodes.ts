export interface PromoCode {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  description: string;
  isActive: boolean;
}

export const promoCodes: PromoCode[] = [
  {
    code: "SAVE10",
    type: "percentage",
    value: 10,
    maxDiscount: 500,
    description: "10% off your order (up to AED 500)",
    isActive: true,
  },
  {
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    maxDiscount: 200,
    description: "20% off for new customers (up to AED 200)",
    isActive: true,
  },
  {
    code: "SAVE50",
    type: "fixed",
    value: 50,
    minOrderAmount: 200,
    description: "AED 50 off orders over AED 200",
    isActive: true,
  },
  {
    code: "FLASHSALE",
    type: "percentage",
    value: 15,
    maxDiscount: 750,
    description: "15% off flash sale (up to AED 750)",
    isActive: true,
  },
  {
    code: "BULK5",
    type: "percentage",
    value: 5,
    minOrderAmount: 1000,
    description: "5% off bulk orders over AED 1,000",
    isActive: true,
  },
  {
    code: "FREESHIP",
    type: "fixed",
    value: 0,
    description: "Free shipping on your order",
    isActive: true,
  },
];

export function validatePromoCode(
  code: string,
  subtotal: number,
): { valid: boolean; promo?: PromoCode; error?: string } {
  const promo = promoCodes.find(
    (p) => p.code.toUpperCase() === code.toUpperCase(),
  );
  if (!promo) return { valid: false, error: "Invalid promo code" };
  if (!promo.isActive)
    return { valid: false, error: "This promo code has expired" };
  if (promo.minOrderAmount && subtotal < promo.minOrderAmount)
    return {
      valid: false,
      error: `Minimum order of AED ${promo.minOrderAmount.toLocaleString()} required`,
    };
  return { valid: true, promo };
}

export function calculatePromoDiscount(
  promo: PromoCode,
  subtotal: number,
): number {
  if (promo.type === "fixed") return Math.min(promo.value, subtotal);
  const amount = (subtotal * promo.value) / 100;
  return promo.maxDiscount ? Math.min(amount, promo.maxDiscount) : amount;
}
