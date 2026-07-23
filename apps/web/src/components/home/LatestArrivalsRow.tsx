"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef } from "react";
import { LatestArrivalsCard } from "@/components/shared/LatestArrivalsCard";
import type { Product } from "@/data";

export function LatestArrivalsRow({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -360 : 360,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="group/section">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          Latest arrivals
        </h2>
        <Link
          href="/search?sort=newest"
          className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-2"
        >
          Show more
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 z-10 hidden -translate-x-[14px] -translate-y-1/2 items-center justify-center rounded-full bg-white p-3 shadow-panel opacity-0 transition-all duration-300 ease-out group-hover/section:opacity-100 hover:scale-110 hover:shadow-panel md:flex"
        >
          <ChevronLeft className="h-5 w-5 text-ink" strokeWidth={2} />
        </button>
        <div
          ref={scrollRef}
          className="grid grid-cols-2 gap-4 md:flex md:overflow-x-auto md:gap-4 md:-mx-10 md:px-10 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <LatestArrivalsCard key={product.slug} product={product} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-[14px] items-center justify-center rounded-full bg-white p-3 shadow-panel opacity-0 transition-all duration-300 ease-out group-hover/section:opacity-100 hover:scale-110 hover:shadow-panel md:flex"
        >
          <ChevronRight className="h-5 w-5 text-ink" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
