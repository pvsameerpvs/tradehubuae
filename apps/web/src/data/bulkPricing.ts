export interface BulkTier {
  minQty: number;
  maxQty: number | null;
  discountPercent: number;
  label: string;
}

export const defaultBulkTiers: BulkTier[] = [
  { minQty: 2, maxQty: 4, discountPercent: 3, label: "3% off" },
  { minQty: 5, maxQty: 9, discountPercent: 5, label: "5% off" },
  { minQty: 10, maxQty: 24, discountPercent: 8, label: "8% off" },
  { minQty: 25, maxQty: 49, discountPercent: 12, label: "12% off" },
  { minQty: 50, maxQty: null, discountPercent: 15, label: "15% off" },
];

export const productBulkPricing: Record<string, BulkTier[]> = {};

export function getBulkDiscountPercent(
  quantity: number,
  productSlug?: string,
): number {
  const tiers =
    productSlug && productBulkPricing[productSlug]
      ? productBulkPricing[productSlug]
      : defaultBulkTiers;
  for (const tier of tiers) {
    if (
      quantity >= tier.minQty &&
      (tier.maxQty === null || quantity <= tier.maxQty)
    )
      return tier.discountPercent;
  }
  return 0;
}

export function getBulkTierForQuantity(
  quantity: number,
  productSlug?: string,
): BulkTier | null {
  const tiers =
    productSlug && productBulkPricing[productSlug]
      ? productBulkPricing[productSlug]
      : defaultBulkTiers;
  for (const tier of tiers) {
    if (
      quantity >= tier.minQty &&
      (tier.maxQty === null || quantity <= tier.maxQty)
    )
      return tier;
  }
  return null;
}
