import { Star } from "lucide-react";

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i < rating ? "fill-ink text-ink" : "text-ink-3"}`}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}
