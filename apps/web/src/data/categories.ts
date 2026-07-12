export interface Category {
  name: string;
  slug: string;
  desc: string;
  count: string;
}

export const categories: Category[] = [
  { name: "Laptops", slug: "laptops", desc: "New & refurbished laptops", count: "45+ products" },
  { name: "Desktop PCs", slug: "desktop-pcs", desc: "Business & home desktops", count: "30+ products" },
  { name: "Gaming PCs", slug: "gaming-pcs", desc: "High-performance gaming rigs", count: "20+ products" },
  { name: "Components", slug: "components", desc: "CPUs, GPUs, RAM & more", count: "100+ products" },
  { name: "Accessories", slug: "accessories", desc: "Keyboards, mice, monitors", count: "80+ products" },
  { name: "Networking", slug: "networking", desc: "Routers, switches & cables", count: "50+ products" },
  { name: "Storage", slug: "storage", desc: "SSDs, HDDs, NAS & external drives", count: "40+ products" },
  { name: "Software", slug: "software", desc: "Operating systems & productivity suites", count: "25+ products" },
];
