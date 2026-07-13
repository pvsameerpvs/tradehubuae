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

export const offers: Offer[] = [
  {
    id: "offer-1",
    title: "Work From Home Bundle",
    description: "Save big on complete home office setups",
    type: "bundle",
    badge: "Bundle Deal",
    href: "/combo-offers",
    coverGradient: "from-[#1A5A8C] to-[#103E68]",
    coverIcon: "briefcase",
    details: "Save up to 16% on curated bundles",
    cta: "Shop bundles",
  },
  {
    id: "offer-2",
    title: "20% Off Gaming PCs",
    description: "Limited time offer on selected gaming rigs",
    type: "percentage",
    badge: "-20%",
    href: "/categories/gaming-pcs?offer=20off",
    coverGradient: "from-[#C13515] to-[#8B1A0A]",
    coverIcon: "gamepad",
    details: "Use code: GAMER20",
    cta: "Shop now",
  },
  {
    id: "offer-3",
    title: "Buy 1 Monitor, Get 1 Free",
    description: "On selected 27-inch and ultrawide displays",
    type: "bogo",
    badge: "BOGO",
    href: "/categories/monitors?offer=bogo",
    coverGradient: "from-[#0F766E] to-[#0D5E57]",
    coverIcon: "monitor",
    details: "Free monitor of equal or lesser value",
    cta: "View offer",
  },
  {
    id: "offer-4",
    title: "15% Off Accessories",
    description: "Keyboards, mice, headsets and more",
    type: "percentage",
    badge: "-15%",
    href: "/categories/accessories?offer=15off",
    coverGradient: "from-[#6D28D9] to-[#4C1D95]",
    coverIcon: "keyboard",
    details: "Use code: ACCESS15",
    cta: "Shop accessories",
  },
  {
    id: "offer-5",
    title: "Buy a Laptop, Get a Mouse Free",
    description: "Free Logitech mouse with any laptop purchase",
    type: "bogo",
    badge: "BOGO",
    href: "/categories/laptops?offer=freemouse",
    coverGradient: "from-[#0369A1] to-[#075985]",
    coverIcon: "laptop",
    details: "Auto-applied at checkout",
    cta: "Browse laptops",
  },
  {
    id: "offer-6",
    title: "Networking Bundle",
    description: "Router + WiFi adapter at a special price",
    type: "bundle",
    badge: "Bundle Deal",
    href: "/combo-offers",
    coverGradient: "from-[#4F46E5] to-[#3730A3]",
    coverIcon: "wifi",
    details: "Save AED 349 on the bundle",
    cta: "Shop bundles",
  },
];
