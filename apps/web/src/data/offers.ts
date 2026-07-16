import { fetchComboOffers } from "./comboOffers";
import type { ComboOffer } from "./comboOffers";

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

const gradients = [
  "from-[#1A5A8C] to-[#103E68]",
  "from-[#C13515] to-[#8B1A0A]",
  "from-[#0F766E] to-[#0D5E57]",
  "from-[#6D28D9] to-[#4C1D95]",
  "from-[#0369A1] to-[#075985]",
  "from-[#4F46E5] to-[#3730A3]",
];

const icons = ["briefcase", "gamepad", "monitor", "keyboard", "laptop", "wifi"];

function toOffer(combo: ComboOffer, idx: number): Offer {
  return {
    id: combo.id,
    title: combo.name,
    description: combo.description || "Curated bundle for every need",
    type: "bundle" as OfferType,
    badge: combo.badge.startsWith("-") ? combo.badge : "Bundle Deal",
    href: "/combo-offers",
    coverGradient: gradients[idx % gradients.length] ?? "from-brand to-brand-dark",
    coverIcon: icons[idx % icons.length] ?? "laptop",
    details: combo.savings > 0 ? `Save up to AED ${Math.round(combo.savings).toLocaleString()}` : "Great value bundle",
    cta: "Shop bundles",
  };
}

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const combos = await fetchComboOffers();
    return combos.map(toOffer);
  } catch {
    return [];
  }
}
