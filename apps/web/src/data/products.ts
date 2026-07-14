export interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  slug: string;
  badge?: string;
  inStock?: boolean;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  specs?: string;
  gpu?: string;
  detailedSpecs?: ProductSpec[];
}

export const searchProducts: Product[] = [
  { name: "MacBook Air M2, 2022", price: 2450, originalPrice: 2899, rating: 4.9, reviewCount: 21, specs: "16GB RAM · 512GB SSD · 94% battery", category: "Laptops", slug: "macbook-air-m2-2022", badge: "Certified", stock: 3, detailedSpecs: [{ label: "Processor", value: "Apple M2" }, { label: "RAM", value: "16GB Unified" }, { label: "Storage", value: "512GB SSD" }, { label: "Display", value: '13.6" Liquid Retina (2560×1664)' }, { label: "GPU", value: "Apple M2 10-core" }, { label: "Battery", value: "Up to 18 hours" }, { label: "Weight", value: "1.24 kg" }, { label: "Warranty", value: "1 Year" }] },
  { name: "Dell XPS 15", price: 5499, rating: 4.7, reviewCount: 15, specs: "32GB RAM · 1TB SSD · RTX 4060", category: "Laptops", slug: "dell-xps-15", badge: "Best Seller", stock: 12, detailedSpecs: [{ label: "Processor", value: "Intel Core i7-13700H" }, { label: "RAM", value: "32GB DDR5" }, { label: "Storage", value: "1TB NVMe SSD" }, { label: "Display", value: '15.6" FHD+ (1920×1200)' }, { label: "GPU", value: "NVIDIA RTX 4060" }, { label: "Battery", value: "Up to 10 hours" }, { label: "Weight", value: "1.8 kg" }, { label: "Warranty", value: "2 Years" }] },
  { name: "MacBook Pro 16 M3", price: 7899, rating: 4.8, reviewCount: 8, specs: "36GB RAM · 1TB SSD · M3 Pro", category: "Laptops", slug: "macbook-pro-16", badge: "New", stock: 5, detailedSpecs: [{ label: "Processor", value: "Apple M3 Pro" }, { label: "RAM", value: "36GB Unified" }, { label: "Storage", value: "1TB SSD" }, { label: "Display", value: '16.2" Liquid Retina XDR (3456×2234)' }, { label: "GPU", value: "M3 Pro 18-core" }, { label: "Battery", value: "Up to 22 hours" }, { label: "Weight", value: "2.14 kg" }, { label: "Warranty", value: "1 Year" }] },
  { name: "HP Pavilion Desktop", price: 3299, originalPrice: 3799, rating: 4.5, reviewCount: 32, specs: "16GB RAM · 512GB SSD · Intel UHD", category: "Desktop PCs", slug: "hp-pavilion-desktop", badge: "Great deal", stock: 8, detailedSpecs: [{ label: "Processor", value: "Intel Core i5-13400" }, { label: "RAM", value: "16GB DDR4" }, { label: "Storage", value: "512GB NVMe SSD" }, { label: "GPU", value: "Intel UHD Graphics 730" }, { label: "OS", value: "Windows 11 Home" }, { label: "Weight", value: "5.2 kg" }, { label: "Warranty", value: "1 Year" }] },
  { name: "Custom Gaming RTX 4070", price: 6999, rating: 4.9, reviewCount: 11, specs: "32GB RAM · 1TB SSD · RTX 4070", category: "Gaming PCs", slug: "custom-gaming-pc-rtx-4070", badge: "Staff pick", stock: 2, detailedSpecs: [{ label: "Processor", value: "AMD Ryzen 7 7800X3D" }, { label: "RAM", value: "32GB DDR5" }, { label: "Storage", value: "1TB NVMe SSD" }, { label: "GPU", value: "NVIDIA RTX 4070 12GB" }, { label: "PSU", value: "750W Gold" }, { label: "Weight", value: "8.5 kg" }, { label: "Warranty", value: "2 Years" }] },
  { name: "Logitech MX Master 3S", price: 349, rating: 4.6, reviewCount: 45, specs: "Wireless · 8000 DPI · USB-C", category: "Accessories", slug: "logitech-mx-master-3s", stock: 45, detailedSpecs: [{ label: "Connectivity", value: "Bluetooth + USB-C" }, { label: "DPI", value: "200–8000" }, { label: "Battery", value: "Up to 70 days" }, { label: "Weight", value: "141 g" }, { label: "Scroll", value: "Magspeed electromagnetic" }, { label: "Warranty", value: "1 Year" }] },
  { name: "Samsung 27\" Monitor", price: 1299, originalPrice: 1599, rating: 4.4, reviewCount: 27, specs: "4K UHD · IPS · USB-C Hub", category: "Accessories", slug: "samsung-27-monitor", badge: "Great deal", stock: 18, detailedSpecs: [{ label: "Size", value: '27"' }, { label: "Resolution", value: "4K UHD (3840×2160)" }, { label: "Panel", value: "IPS" }, { label: "Refresh Rate", value: "60 Hz" }, { label: "Ports", value: "USB-C Hub, HDMI 2.0, DP" }, { label: "Warranty", value: "2 Years" }] },
  { name: "Intel Core i7-14700K", price: 1899, rating: 4.7, reviewCount: 19, specs: "20 cores · 5.6GHz · LGA 1700", category: "Components", slug: "intel-core-i7-14700k", stock: 24, detailedSpecs: [{ label: "Cores", value: "20 (8P + 12E)" }, { label: "Threads", value: "28" }, { label: "Base Clock", value: "3.4 GHz" }, { label: "Boost Clock", value: "5.6 GHz" }, { label: "Socket", value: "LGA 1700" }, { label: "TDP", value: "125W" }, { label: "Warranty", value: "3 Years" }] },
  { name: "TP-Link WiFi 6 Router", price: 449, rating: 4.3, reviewCount: 52, specs: "AX5400 · 4× Gigabit · Mesh", category: "Networking", slug: "tp-link-wifi-6-router", stock: 36, detailedSpecs: [{ label: "Standard", value: "Wi-Fi 6 (802.11ax)" }, { label: "Speed", value: "AX5400 (574 + 4804 Mbps)" }, { label: "Ports", value: "4× Gigabit LAN + 1× WAN" }, { label: "Frequency", value: "2.4 GHz + 5 GHz" }, { label: "Mesh", value: "Supports OneMesh" }, { label: "Warranty", value: "2 Years" }] },
  { name: "ThinkPad X1 Carbon Gen 11", price: 3899, originalPrice: 4599, rating: 4.8, reviewCount: 14, specs: "16GB RAM · 512GB SSD · 14\" OLED", category: "Laptops", slug: "thinkpad-x1-carbon-gen-11", badge: "Like new", stock: 2, detailedSpecs: [{ label: "Processor", value: "Intel Core i7-1365U" }, { label: "RAM", value: "16GB LPDDR5" }, { label: "Storage", value: "512GB NVMe SSD" }, { label: "Display", value: '14" OLED (2880×1800)' }, { label: "GPU", value: "Intel Iris Xe" }, { label: "Battery", value: "Up to 15 hours" }, { label: "Weight", value: "1.12 kg" }, { label: "Warranty", value: "3 Years" }] },
  { name: "ASUS ROG Zephyrus G14", price: 5499, rating: 4.6, reviewCount: 23, specs: "32GB RAM · 1TB SSD · RTX 4060", category: "Gaming PCs", slug: "asus-rog-zephyrus-g14", badge: "Staff pick", stock: 6, detailedSpecs: [{ label: "Processor", value: "AMD Ryzen 9 7940HS" }, { label: "RAM", value: "32GB DDR5" }, { label: "Storage", value: "1TB NVMe SSD" }, { label: "Display", value: '14" QHD+ (2560×1600) 165Hz' }, { label: "GPU", value: "NVIDIA RTX 4060 8GB" }, { label: "Battery", value: "Up to 10 hours" }, { label: "Weight", value: "1.72 kg" }, { label: "Warranty", value: "2 Years" }] },
  { name: "LG UltraFine 32\" 4K", price: 2199, originalPrice: 2799, rating: 4.5, reviewCount: 18, specs: "32\" 4K · USB-C 96W · P3", category: "Accessories", slug: "lg-ultrafine-32-4k", stock: 9, detailedSpecs: [{ label: "Size", value: '32"' }, { label: "Resolution", value: "4K UHD (3840×2160)" }, { label: "Panel", value: "IPS with P3 wide color" }, { label: "Refresh Rate", value: "60 Hz" }, { label: "Ports", value: "USB-C 96W PD, HDMI, DP" }, { label: "Warranty", value: "2 Years" }] },
  { name: "Samsung 49\" UltraWide", price: 3299, rating: 4.7, reviewCount: 9, specs: "49\" DQHD · 240Hz · OLED", category: "Accessories", slug: "samsung-49-ultrawide", stock: 4, detailedSpecs: [{ label: "Size", value: '49"' }, { label: "Resolution", value: "DQHD (5120×1440)" }, { label: "Panel", value: 'OLED' }, { label: "Refresh Rate", value: "240 Hz" }, { label: "Curvature", value: "1800R" }, { label: "Ports", value: "HDMI 2.1, DP 1.4, USB-C" }, { label: "Warranty", value: "2 Years" }] },
  { name: "Logitech G Pro X", price: 549, rating: 4.4, reviewCount: 31, specs: "Wireless · Lightspeed · 25K DPI", category: "Accessories", slug: "logitech-g-pro-x", stock: 52, detailedSpecs: [{ label: "Connectivity", value: "Lightspeed Wireless" }, { label: "DPI", value: "100–25,600" }, { label: "Battery", value: "Up to 70 hours" }, { label: "Weight", value: "63 g" }, { label: "Switches", value: "GX Blue Optical" }, { label: "Warranty", value: "2 Years" }] },
  { name: "Dell Precision 7780", price: 8299, rating: 4.2, reviewCount: 6, specs: "64GB RAM · 2TB SSD · RTX 5000", category: "Laptops", slug: "dell-precision-7780", badge: "Low stock", stock: 1, detailedSpecs: [{ label: "Processor", value: "Intel Core i9-13950HX" }, { label: "RAM", value: "64GB DDR5" }, { label: "Storage", value: "2TB NVMe SSD" }, { label: "Display", value: '17.3" FHD+ (1920×1200)' }, { label: "GPU", value: "NVIDIA RTX 5000 Ada 16GB" }, { label: "Battery", value: "Up to 8 hours" }, { label: "Weight", value: "2.67 kg" }, { label: "Warranty", value: "3 Years" }] },
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
  { name: "Dell XPS 15", price: 5499, slug: "dell-xps-15", category: "Laptops", inStock: true, stock: 12, rating: 4.7, specs: "32GB RAM · 1TB SSD · RTX 4060" },
  { name: "MacBook Pro 16", price: 7899, slug: "macbook-pro-16", category: "Laptops", inStock: true, stock: 5, rating: 4.8, specs: "36GB RAM · 1TB SSD · M3 Pro" },
  { name: "Custom Gaming PC RTX 4070", price: 6999, slug: "custom-gaming-pc-rtx-4070", category: "Gaming PCs", inStock: false, stock: 0, rating: 4.9, specs: "32GB RAM · 1TB SSD · RTX 4070" },
  { name: 'Samsung 49" UltraWide', price: 3299, slug: "samsung-49-ultrawide", category: "Accessories", inStock: true, stock: 4, rating: 4.7, specs: "49\" DQHD · 240Hz · OLED" },
  { name: "Logitech G Pro X", price: 549, slug: "logitech-g-pro-x", category: "Accessories", inStock: true, stock: 52, rating: 4.4, specs: "Wireless · Lightspeed · 25K DPI" },
];
