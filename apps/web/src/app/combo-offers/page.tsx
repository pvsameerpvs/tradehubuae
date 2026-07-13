import type { Metadata } from "next";
import { Button, Badge } from "@tradehubuae/ui";
import { Gift, Check } from "@/components/icons";
import { comboOffers } from "@/data";

export const metadata: Metadata = {
  title: "Combo Offers",
  description: "Save big with exclusive combo deals on IT equipment at TradeHub UAE",
};

export default function ComboOffersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Combo Offers</h1>
        <p className="text-lg text-ink-2">
          Save more when you buy together. Curated bundles for every need.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {comboOffers.map((combo) => (
          <div key={combo.name} className="group relative rounded-xl border bg-white shadow-panel transition hover:shadow-panel">
            <Badge className="absolute left-4 top-4" variant="warning">
              {combo.badge}
            </Badge>
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand/5 to-brand/10">
              <Gift className="h-16 w-16 text-brand/40" strokeWidth={1} />
            </div>
            <div className="p-5">
              <h3 className="mb-3 text-lg font-semibold">{combo.name}</h3>
              <ul className="mb-4 space-y-1.5">
                {combo.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink-2">
                    <Check className="h-4 w-4 shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl font-bold text-brand">AED {combo.price.toLocaleString()}</span>
                <span className="text-sm text-ink-2 line-through">AED {combo.original.toLocaleString()}</span>
              </div>
              <Button className="w-full">Add Bundle to Cart</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
