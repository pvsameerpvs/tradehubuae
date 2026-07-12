export interface ComboOffer {
  name: string;
  original: number;
  price: number;
  items: string[];
  badge: string;
}

export const comboOffers: ComboOffer[] = [
  {
    name: "Work From Home Bundle",
    original: 7297,
    price: 5999,
    items: ["Dell XPS 15 Laptop", 'Samsung 27" Monitor', "Logitech Webcam", "Wireless Keyboard & Mouse"],
    badge: "Best Value",
  },
  {
    name: "Gaming Starter Pack",
    original: 8997,
    price: 7499,
    items: ["Custom Gaming PC RTX 4060", "RGB Mechanical Keyboard", "Gaming Mouse", "Gaming Headset"],
    badge: "Popular",
  },
  {
    name: "Office Productivity Set",
    original: 4297,
    price: 3599,
    items: ["HP Desktop PC", 'Dell 24" Monitor', "Office Chair"],
    badge: "-16%",
  },
  {
    name: "Networking Bundle",
    original: 2497,
    price: 1999,
    items: ["TP-Link WiFi 6 Router", "Network Switch 8-Port", "Cat6 Ethernet Cable 10m", "Cable Management Kit"],
    badge: "Limited Time",
  },
  {
    name: "Content Creator Kit",
    original: 10496,
    price: 8999,
    items: ["MacBook Pro 16", "Wacom Drawing Tablet", "Blue Yeti Microphone", "Ring Light"],
    badge: "Premium",
  },
  {
    name: "Server Room Bundle",
    original: 15997,
    price: 12999,
    items: ["Dell PowerEdge Server", "UPS Backup", "Server Rack 12U", "KVM Switch"],
    badge: "Enterprise",
  },
];
