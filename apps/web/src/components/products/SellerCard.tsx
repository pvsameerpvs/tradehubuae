import { Star } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";

export function SellerCard() {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-bg2 text-lg font-semibold text-ink">
          TH
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-ink">TradeHub UAE</p>
          <p className="mt-0.5 text-sm text-ink-2">Dubai, UAE · 1,200+ sales</p>
          <div className="mt-2 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-ink text-ink" strokeWidth={0} />
            <span className="text-sm font-medium text-ink">4.9</span>
            <span className="text-sm text-ink-2">(327 reviews)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
