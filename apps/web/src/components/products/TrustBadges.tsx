import { ShieldCheck, Truck, RotateCcw, MapPin } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, text: "Certified refurbished — tested and guaranteed" },
  { icon: Truck, text: "Free delivery across Dubai & UAE" },
  { icon: RotateCcw, text: "14-day return policy, no questions asked" },
  { icon: MapPin, text: "Visit our showroom in Dubai Silicon Oasis" },
];

export function TrustBadges() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {trustItems.map((item) => (
        <div
          key={item.text}
          className="flex items-start gap-3 rounded-xl border border-line p-4 transition-shadow duration-200 hover:shadow-card"
        >
          <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand" strokeWidth={1.75} />
          <span className="text-sm leading-5 text-ink-2">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
