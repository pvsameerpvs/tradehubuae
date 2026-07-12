export interface Benefit {
  title: string;
  desc: string;
  icon: "shield" | "truck" | "briefcase";
}

export const whyUsBenefits: Benefit[] = [
  {
    title: "100% Genuine Products",
    desc: "All products are verified and quality-checked. We source directly from authorized distributors.",
    icon: "shield",
  },
  {
    title: "Fast Delivery Across UAE",
    desc: "Free shipping on orders over AED 500. Same-day delivery in Dubai, next-day across the UAE.",
    icon: "truck",
  },
  {
    title: "Corporate Bulk Pricing",
    desc: "Special pricing for businesses, schools, and government organizations. Dedicated account managers.",
    icon: "briefcase",
  },
];

export const bulkBenefits: Benefit[] = [
  { title: "Competitive Pricing", desc: "Exclusive bulk discounts on all products", icon: "shield" },
  { title: "Dedicated Account Manager", desc: "Personal support throughout your journey", icon: "briefcase" },
  { title: "Customized Solutions", desc: "Tailored IT equipment for your needs", icon: "truck" },
  { title: "Flexible Payment Terms", desc: "Net 30/60 payment options for businesses", icon: "shield" },
  { title: "Priority Delivery", desc: "Fast-tracked shipping and installation", icon: "truck" },
  { title: "Warranty & Support", desc: "Extended warranties and on-site support", icon: "briefcase" },
];

export const industries = ["Education", "Healthcare", "Government", "Banking", "Retail", "Hospitality", "Real Estate", "Manufacturing"];

export const aboutStats = [
  { value: "5000+", label: "Products Available" },
  { value: "1000+", label: "Happy Customers" },
  { value: "50+", label: "Trusted Brands" },
  { value: "5+", label: "Years in UAE" },
];
