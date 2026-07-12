export interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  slug: string;
  badge?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  specs?: string;
  gpu?: string;
}

export const searchProducts: Product[] = [
  { name: "MacBook Air M2, 2022", price: 2450, originalPrice: 2899, rating: 4.9, reviewCount: 21, specs: "16GB RAM · 512GB SSD · 94% battery", category: "Laptops", slug: "macbook-air-m2-2022", badge: "Certified" },
  { name: "Dell XPS 15", price: 5499, rating: 4.7, reviewCount: 15, specs: "32GB RAM · 1TB SSD · RTX 4060", category: "Laptops", slug: "dell-xps-15", badge: "Best Seller" },
  { name: "MacBook Pro 16 M3", price: 7899, rating: 4.8, reviewCount: 8, specs: "36GB RAM · 1TB SSD · M3 Pro", category: "Laptops", slug: "macbook-pro-16", badge: "New" },
  { name: "HP Pavilion Desktop", price: 3299, originalPrice: 3799, rating: 4.5, reviewCount: 32, specs: "16GB RAM · 512GB SSD · Intel UHD", category: "Desktop PCs", slug: "hp-pavilion-desktop", badge: "Great deal" },
  { name: "Custom Gaming RTX 4070", price: 6999, rating: 4.9, reviewCount: 11, specs: "32GB RAM · 1TB SSD · RTX 4070", category: "Gaming PCs", slug: "custom-gaming-pc-rtx-4070", badge: "Staff pick" },
  { name: "Logitech MX Master 3S", price: 349, rating: 4.6, reviewCount: 45, specs: "Wireless · 8000 DPI · USB-C", category: "Accessories", slug: "logitech-mx-master-3s" },
  { name: "Samsung 27\" Monitor", price: 1299, originalPrice: 1599, rating: 4.4, reviewCount: 27, specs: "4K UHD · IPS · USB-C Hub", category: "Accessories", slug: "samsung-27-monitor", badge: "Great deal" },
  { name: "Intel Core i7-14700K", price: 1899, rating: 4.7, reviewCount: 19, specs: "20 cores · 5.6GHz · LGA 1700", category: "Components", slug: "intel-core-i7-14700k" },
  { name: "TP-Link WiFi 6 Router", price: 449, rating: 4.3, reviewCount: 52, specs: "AX5400 · 4× Gigabit · Mesh", category: "Networking", slug: "tp-link-wifi-6-router" },
  { name: "ThinkPad X1 Carbon Gen 11", price: 3899, originalPrice: 4599, rating: 4.8, reviewCount: 14, specs: "16GB RAM · 512GB SSD · 14\" OLED", category: "Laptops", slug: "thinkpad-x1-carbon-gen-11", badge: "Like new" },
  { name: "ASUS ROG Zephyrus G14", price: 5499, rating: 4.6, reviewCount: 23, specs: "32GB RAM · 1TB SSD · RTX 4060", category: "Gaming PCs", slug: "asus-rog-zephyrus-g14", badge: "Staff pick" },
  { name: "LG UltraFine 32\" 4K", price: 2199, originalPrice: 2799, rating: 4.5, reviewCount: 18, specs: "32\" 4K · USB-C 96W · P3", category: "Accessories", slug: "lg-ultrafine-32-4k" },
  { name: "Samsung 49\" UltraWide", price: 3299, rating: 4.7, reviewCount: 9, specs: "49\" DQHD · 240Hz · OLED", category: "Accessories", slug: "samsung-49-ultrawide" },
  { name: "Logitech G Pro X", price: 549, rating: 4.4, reviewCount: 31, specs: "Wireless · Lightspeed · 25K DPI", category: "Accessories", slug: "logitech-g-pro-x" },
  { name: "Dell Precision 7780", price: 8299, rating: 4.2, reviewCount: 6, specs: "64GB RAM · 2TB SSD · RTX 5000", category: "Laptops", slug: "dell-precision-7780", badge: "Low stock" },
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
  { name: "Dell XPS 15", price: 5499, gpu: "NVIDIA RTX 4060", category: "Laptops", slug: "dell-xps-15", badge: "Best Seller", rating: 4.7, specs: "32GB RAM · 1TB SSD" },
  { name: "MacBook Pro 16", price: 7899, gpu: "M3 Pro 18-core", category: "Laptops", slug: "macbook-pro-16", badge: "New", rating: 4.8, specs: "36GB RAM · 1TB SSD" },
  { name: "HP Pavilion Desktop", price: 3299, gpu: "Intel UHD", category: "Desktop PCs", slug: "hp-pavilion-desktop", rating: 4.5, specs: "16GB RAM · 512GB SSD" },
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
  { name: "Dell XPS 15", price: 5499, slug: "dell-xps-15", category: "Laptops", inStock: true, rating: 4.7, specs: "32GB RAM · 1TB SSD · RTX 4060" },
  { name: "MacBook Pro 16", price: 7899, slug: "macbook-pro-16", category: "Laptops", inStock: true, rating: 4.8, specs: "36GB RAM · 1TB SSD · M3 Pro" },
  { name: "Custom Gaming PC RTX 4070", price: 6999, slug: "custom-gaming-pc-rtx-4070", category: "Gaming PCs", inStock: false, rating: 4.9, specs: "32GB RAM · 1TB SSD · RTX 4070" },
  { name: 'Samsung 49" UltraWide', price: 3299, slug: "samsung-49-ultrawide", category: "Accessories", inStock: true, rating: 4.7, specs: "49\" DQHD · 240Hz · OLED" },
  { name: "Logitech G Pro X", price: 549, slug: "logitech-g-pro-x", category: "Accessories", inStock: true, rating: 4.4, specs: "Wireless · Lightspeed · 25K DPI" },
];
