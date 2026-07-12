export interface Product {
  name: string;
  price: number;
  category: string;
  slug: string;
  badge?: string;
  inStock?: boolean;
  gpu?: string;
}

export const searchProducts: Product[] = [
  { name: "Dell XPS 15", price: 5499, category: "Laptops", slug: "dell-xps-15", badge: "Best Seller" },
  { name: "MacBook Pro 16", price: 7899, category: "Laptops", slug: "macbook-pro-16", badge: "New" },
  { name: "HP Pavilion Desktop", price: 3299, category: "Desktop PCs", slug: "hp-pavilion-desktop" },
  { name: "Custom Gaming PC RTX 4070", price: 6999, category: "Gaming PCs", slug: "custom-gaming-pc-rtx-4070", badge: "Popular" },
  { name: "Logitech MX Master 3S", price: 349, category: "Accessories", slug: "logitech-mx-master-3s" },
  { name: 'Samsung 27" Monitor', price: 1299, category: "Accessories", slug: "samsung-27-monitor" },
  { name: "Intel Core i7-14700K", price: 1899, category: "Components", slug: "intel-core-i7-14700k" },
  { name: "TP-Link WiFi 6 Router", price: 449, category: "Networking", slug: "tp-link-wifi-6-router" },
];

export const searchCategories = ["All", "Laptops", "Desktop PCs", "Gaming PCs", "Components", "Accessories", "Networking"];

export interface ProductSpec {
  label: string;
  value: string;
}

export const defaultSpecs: ProductSpec[] = [
  { label: "Processor", value: "Intel Core i7-13700H" },
  { label: "RAM", value: "32GB DDR5" },
  { label: "Storage", value: "1TB NVMe SSD" },
  { label: "Display", value: '15.6" FHD+ (1920×1200)' },
  { label: "GPU", value: "NVIDIA RTX 4060" },
  { label: "Battery", value: "Up to 10 hours" },
  { label: "Weight", value: "1.8 kg" },
  { label: "Warranty", value: "2 Years" },
];

export const compareProducts: Product[] = [
  { name: "Dell XPS 15", price: 5499, gpu: "NVIDIA RTX 4060", category: "Laptops", slug: "dell-xps-15", badge: "Best Seller" },
  { name: "MacBook Pro 16", price: 7899, gpu: "M3 Pro 18-core", category: "Laptops", slug: "macbook-pro-16", badge: "New" },
  { name: "HP Pavilion Desktop", price: 3299, gpu: "Intel UHD", category: "Desktop PCs", slug: "hp-pavilion-desktop" },
];

export interface CompareSpec {
  label: string;
  getValue: (p: Product) => string;
}

export const compareSpecs: CompareSpec[] = [
  { label: "Price", getValue: (p) => `AED ${p.price.toLocaleString()}` },
  { label: "Processor", getValue: () => "Intel Core i7-13700H" },
  { label: "RAM", getValue: () => "32GB DDR5" },
  { label: "Storage", getValue: () => "1TB NVMe SSD" },
  { label: "Display", getValue: () => '15.6" FHD+' },
  { label: "GPU", getValue: (p) => p.gpu ?? "N/A" },
  { label: "Battery", getValue: () => "Up to 10 hours" },
  { label: "Weight", getValue: () => "1.8 kg" },
  { label: "Warranty", getValue: () => "2 Years" },
  { label: "In Stock", getValue: () => "Yes" },
];

export const wishlistItems: Product[] = [
  { name: "Dell XPS 15", price: 5499, slug: "dell-xps-15", category: "Laptops", inStock: true },
  { name: "MacBook Pro 16", price: 7899, slug: "macbook-pro-16", category: "Laptops", inStock: true },
  { name: "Custom Gaming PC RTX 4070", price: 6999, slug: "custom-gaming-pc-rtx-4070", category: "Gaming PCs", inStock: false },
  { name: 'Samsung 49" UltraWide', price: 3299, slug: "samsung-49-ultrawide", category: "Accessories", inStock: true },
  { name: "Logitech G Pro X", price: 549, slug: "logitech-g-pro-x", category: "Accessories", inStock: true },
];
