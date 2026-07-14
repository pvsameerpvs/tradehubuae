"use client";

import { Star, MessageSquareMore } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { setProductContext } from "@/lib/chat-store";

interface SellerCardProps {
  product?: {
    name: string;
    slug: string;
    price: number;
  };
}

export function SellerCard({ product }: SellerCardProps) {
  const handleChat = () => {
    if (!product) return;
    setProductContext(product);
    window.dispatchEvent(
      new CustomEvent("open-chat-with-product", { detail: product }),
    );
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
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
        </div>
        {product && (
          <button
            type="button"
            onClick={handleChat}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white text-sm font-semibold text-ink transition-colors hover:bg-bg3"
          >
            <MessageSquareMore className="h-4 w-4" strokeWidth={1.75} />
            Contact seller
          </button>
        )}
      </CardContent>
    </Card>
  );
}
