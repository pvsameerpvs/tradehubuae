"use client";

import { useState } from "react";
import { Badge } from "@tradehubuae/ui";
import { cn } from "@tradehubuae/ui";

interface ProductGalleryProps {
  badge?: string;
}

const totalImages = 5;

export function ProductGallery({ badge }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-xl bg-bg2">
        <div className="aspect-[4/3] transition-transform duration-200 group-hover:scale-[1.02]" />
        {badge && (
          <Badge variant="default" className="absolute left-3 top-3">
            {badge}
          </Badge>
        )}
        <div className="absolute bottom-3 right-3 rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-ink backdrop-blur-sm">
          {selected + 1} / {totalImages}
        </div>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: totalImages }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            aria-label={`View image ${i + 1}`}
            className={cn(
              "aspect-square flex-1 overflow-hidden rounded-lg bg-bg2 transition-all duration-200",
              i === selected
                ? "ring-2 ring-brand ring-offset-1"
                : "opacity-60 hover:opacity-100",
            )}
          >
            <div className="h-full w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
