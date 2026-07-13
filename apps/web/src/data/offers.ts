export type OfferType = "bundle" | "percentage" | "bogo";

export interface Offer {
  id: string;
  title: string;
  description: string;
  type: OfferType;
  badge: string;
  href: string;
  coverGradient: string;
  coverIcon: string;
  details: string;
  cta: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const res = await fetch(`${API_BASE}/combo-offers/active`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();

    const gradients = [
      "from-[#1A5A8C] to-[#103E68]",
      "from-[#C13515] to-[#8B1A0A]",
      "from-[#0F766E] to-[#0D5E57]",
      "from-[#6D28D9] to-[#4C1D95]",
      "from-[#0369A1] to-[#075985]",
      "from-[#4F46E5] to-[#3730A3]",
    ];

    const icons = ["briefcase", "gamepad", "monitor", "keyboard", "laptop", "wifi"];

    return data.map((offer: any, idx: number) => {
      const totalOriginal = offer.items.reduce((sum: number, item: any) => {
        return sum + Number(item.product?.price ?? 0) * item.quantity;
      }, 0);

      const savings = offer.discountType === "PERCENTAGE"
        ? totalOriginal * Number(offer.discountValue) / 100
        : Number(offer.discountValue);

      return {
        id: offer.id,
        title: offer.name,
        description: offer.description ?? "Curated bundle for every need",
        type: "bundle" as OfferType,
        badge: offer.discountType === "PERCENTAGE" ? `-${offer.discountValue}%` : "Bundle Deal",
        href: "/combo-offers",
        coverGradient: gradients[idx % gradients.length],
        coverIcon: icons[idx % icons.length],
        details: savings > 0 ? `Save up to AED ${Math.round(savings).toLocaleString()}` : "Great value bundle",
        cta: "Shop bundles",
      };
    });
  } catch {
    return [];
  }
}

export const offers: Offer[] = [];
