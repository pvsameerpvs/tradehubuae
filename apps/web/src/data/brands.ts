export interface Brand {
  name: string;
  slug: string;
  description: string;
}

export const brands: Brand[] = [
  { name: "Dell", slug: "dell", description: "Premium laptops, desktops & workstations" },
  { name: "HP", slug: "hp", description: "Reliable business & consumer PCs" },
  { name: "Lenovo", slug: "lenovo", description: "ThinkPad & IdeaPad series" },
  { name: "Apple", slug: "apple", description: "MacBooks, iMacs & accessories" },
  { name: "ASUS", slug: "asus", description: "Gaming & creator laptops" },
  { name: "Acer", slug: "acer", description: "Affordable laptops & desktops" },
  { name: "Microsoft", slug: "microsoft", description: "Surface devices & accessories" },
  { name: "Logitech", slug: "logitech", description: "Keyboards, mice & webcams" },
  { name: "Samsung", slug: "samsung", description: "Monitors, storage & accessories" },
  { name: "Intel", slug: "intel", description: "Processors & components" },
  { name: "AMD", slug: "amd", description: "Processors & graphics cards" },
  { name: "NVIDIA", slug: "nvidia", description: "Graphics cards & AI solutions" },
  { name: "Corsair", slug: "corsair", description: "Gaming peripherals & components" },
  { name: "TP-Link", slug: "tp-link", description: "Networking equipment" },
  { name: "Seagate", slug: "seagate", description: "Storage solutions" },
  { name: "Western Digital", slug: "western-digital", description: "HDDs, SSDs & storage" },
];
