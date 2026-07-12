import type { Metadata } from "next";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";

export const metadata: Metadata = {
  title: "Combo Offers",
  description: "Save big with exclusive combo deals on IT equipment at TradeHub UAE",
};

const combos = [
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

export default function ComboOffersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-bold">Combo Offers</h1>
        <p className="text-lg text-muted-foreground">
          Save more when you buy together. Curated bundles for every need.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {combos.map((combo) => (
          <div key={combo.name} className="group relative rounded-xl border bg-card shadow-sm transition hover:shadow-md">
            <Badge className="absolute left-4 top-4" variant="warning">
              {combo.badge}
            </Badge>
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <svg className="h-16 w-16 text-primary/40" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
            <div className="p-5">
              <h3 className="mb-3 text-lg font-semibold">{combo.name}</h3>
              <ul className="mb-4 space-y-1.5">
                {combo.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">AED {combo.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground line-through">AED {combo.original.toLocaleString()}</span>
              </div>
              <Button className="w-full">Add Bundle to Cart</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
