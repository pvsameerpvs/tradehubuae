export interface ComboOfferItem {
  name: string;
  slug: string;
  quantity: number;
}

export interface ComboOffer {
  id: string;
  name: string;
  description: string;
  items: ComboOfferItem[];
  original: number;
  price: number;
  badge: string;
  image: string;
  savings: number;
  savingsPercent: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function fetchComboOffers(): Promise<ComboOffer[]> {
  try {
    const res = await fetch(`${API_BASE}/combo-offers/active`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();

    return data.map((offer: any) => {
      const totalOriginal = offer.items.reduce((sum: number, item: any) => {
        const price = Number(item.product?.price ?? 0);
        return sum + price * item.quantity;
      }, 0);

      let price = totalOriginal;
      if (offer.discountType === "PERCENTAGE") {
        price = totalOriginal - (totalOriginal * Number(offer.discountValue) / 100);
      } else {
        price = totalOriginal - Number(offer.discountValue);
      }
      price = Math.max(0, price);

      return {
        id: offer.id,
        name: offer.name,
        description: offer.description ?? "",
        items: offer.items.map((item: any) => ({
          name: item.product?.name ?? "Unknown",
          slug: item.product?.slug ?? "",
          quantity: item.quantity,
        })),
        original: Math.round(totalOriginal),
        price: Math.round(price),
        badge: offer.discountType === "PERCENTAGE" ? `-${offer.discountValue}%` : `Save AED ${offer.discountValue}`,
        image: offer.image ?? "",
        savings: Math.round(totalOriginal - price),
        savingsPercent: totalOriginal > 0 ? Math.round(((totalOriginal - price) / totalOriginal) * 100) : 0,
      };
    });
  } catch {
    return [];
  }
}

export async function getComboSavings(cartItemSlugs: string[]): Promise<{
  applicableCombo: ComboOffer | null;
  savings: number;
}> {
  const offers = await fetchComboOffers();
  const slugSet = new Set(cartItemSlugs);
  for (const combo of offers) {
    const comboSlugs = combo.items.map((i) => i.slug);
    if (comboSlugs.every((s) => slugSet.has(s))) {
      return { applicableCombo: combo, savings: combo.original - combo.price };
    }
  }
  return { applicableCombo: null, savings: 0 };
}

export const comboOffers: ComboOffer[] = [];
