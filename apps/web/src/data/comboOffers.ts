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

export const comboOffers: ComboOffer[] = [
  {
    id: "combo-1",
    name: "Work From Home Bundle",
    description: "Everything you need for a productive home office setup",
    items: [
      { name: "Dell XPS 15", slug: "dell-xps-15", quantity: 1 },
      { name: "Samsung 27\" Monitor", slug: "samsung-27-monitor", quantity: 1 },
      { name: "Logitech MX Master 3S", slug: "logitech-mx-master-3s", quantity: 1 },
    ],
    original: 7147,
    price: 5999,
    badge: "Best Value",
    image: "work-from-home",
    savings: 1148,
    savingsPercent: 16,
  },
  {
    id: "combo-2",
    name: "Gaming Starter Pack",
    description: "Kickstart your gaming setup with these essentials",
    items: [
      { name: "Custom Gaming RTX 4070", slug: "custom-gaming-pc-rtx-4070", quantity: 1 },
      { name: "Logitech G Pro X", slug: "logitech-g-pro-x", quantity: 1 },
    ],
    original: 7548,
    price: 6799,
    badge: "Popular",
    image: "gaming-starter",
    savings: 749,
    savingsPercent: 10,
  },
  {
    id: "combo-3",
    name: "Office Productivity Set",
    description: "Complete workstation for professionals",
    items: [
      { name: "HP Pavilion Desktop", slug: "hp-pavilion-desktop", quantity: 1 },
      { name: "Samsung 27\" Monitor", slug: "samsung-27-monitor", quantity: 1 },
    ],
    original: 4598,
    price: 3999,
    badge: "-13%",
    image: "office-prod",
    savings: 599,
    savingsPercent: 13,
  },
  {
    id: "combo-4",
    name: "Networking Bundle",
    description: "Reliable network setup for home or small office",
    items: [
      { name: "TP-Link WiFi 6 Router", slug: "tp-link-wifi-6-router", quantity: 1 },
      { name: "Intel Core i7-14700K", slug: "intel-core-i7-14700k", quantity: 1 },
    ],
    original: 2348,
    price: 1999,
    badge: "Limited Time",
    image: "networking",
    savings: 349,
    savingsPercent: 15,
  },
  {
    id: "combo-5",
    name: "Content Creator Kit",
    description: "Create stunning content with top-tier gear",
    items: [
      { name: "MacBook Pro 16 M3", slug: "macbook-pro-16", quantity: 1 },
      { name: "LG UltraFine 32\" 4K", slug: "lg-ultrafine-32-4k", quantity: 1 },
    ],
    original: 10098,
    price: 8999,
    badge: "Premium",
    image: "creator-kit",
    savings: 1099,
    savingsPercent: 11,
  },
  {
    id: "combo-6",
    name: "UltraWide Gaming Rig",
    description: "Immersive gaming experience with ultrawide display",
    items: [
      { name: "ASUS ROG Zephyrus G14", slug: "asus-rog-zephyrus-g14", quantity: 1 },
      { name: "Samsung 49\" UltraWide", slug: "samsung-49-ultrawide", quantity: 1 },
    ],
    original: 8798,
    price: 7499,
    badge: "Staff Pick",
    image: "ultrawide-rig",
    savings: 1299,
    savingsPercent: 15,
  },
];

export function getComboSavings(cartItemSlugs: string[]): {
  applicableCombo: ComboOffer | null;
  savings: number;
} {
  const slugSet = new Set(cartItemSlugs);
  for (const combo of comboOffers) {
    const comboSlugs = combo.items.map((i) => i.slug);
    if (comboSlugs.every((s) => slugSet.has(s))) {
      return { applicableCombo: combo, savings: combo.original - combo.price };
    }
  }
  return { applicableCombo: null, savings: 0 };
}
