"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@tradehubuae/ui";
import { cn } from "@tradehubuae/ui";

interface ProductImage {
  url: string;
  alt?: string;
}

interface ProductGalleryProps {
  badge?: string;
  images?: ProductImage[];
}

export function ProductGallery({ badge, images = [] }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [imgError, setImgError] = useState<Set<number>>(new Set());
  const displayImages = images.length > 0 ? images : [{ url: "", alt: "" }];

  return (
    <div className="space-y-3">
      <div className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-bg2" style={{ aspectRatio: "4/3" }}>
        {displayImages[selected]?.url && !imgError.has(selected) ? (
          <img
            src={displayImages[selected].url}
            alt={displayImages[selected].alt ?? ""}
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            onError={() => setImgError((prev) => new Set(prev).add(selected))}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-3">
            <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.41a2.25 2.25 0 0 1 3.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        )}
        {badge && (
          <Badge variant="default" className="absolute left-3 top-3">
            {badge}
          </Badge>
        )}
        <div className="absolute bottom-3 right-3 rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-ink backdrop-blur-sm">
          {selected + 1} / {displayImages.length}
        </div>
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2">
          {displayImages.map((img, i) => (
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
              {img.url && !imgError.has(i) ? (
                <img
                  src={img.url}
                  alt={img.alt ?? ""}
                  className="h-full w-full object-cover"
                  onError={() => setImgError((prev) => new Set(prev).add(i))}
                />
              ) : (
                <div className="h-full w-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
