"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import type { Product } from "@/data";

const COLUMN_COUNTS = {
  wide: "xl:grid-cols-6",
  desktop: "lg:grid-cols-4",
  laptop: "md:grid-cols-3",
  tablet: "sm:grid-cols-3",
  mobile: "grid-cols-2",
};

export function ProductRow({
  title,
  products,
  href,
}: {
  title: string;
  products: Product[];
  href?: string;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-2"
          >
            Show more
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        )}
      </div>
      <div className={`grid gap-4 sm:gap-5 ${COLUMN_COUNTS.mobile} ${COLUMN_COUNTS.tablet} ${COLUMN_COUNTS.laptop} ${COLUMN_COUNTS.desktop} ${COLUMN_COUNTS.wide}`}>
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

export function ProductRowScroll({
  title,
  products,
  href,
}: {
  title: string;
  products: Product[];
  href?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -340 : 340,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="group/section">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-2"
          >
            Show more
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white p-3 shadow-lg opacity-0 transition-all duration-300 ease-out group-hover/section:opacity-100 hover:scale-110 hover:shadow-xl md:flex"
        >
          <ChevronLeft className="h-5 w-5 text-ink" strokeWidth={2} />
        </button>
        <div
          ref={scrollRef}
          className="-mx-6 flex gap-4 overflow-x-auto px-6 md:-mx-10 md:px-10 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div key={product.slug} className="w-[220px] flex-shrink-0 sm:w-[260px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white p-3 shadow-lg opacity-0 transition-all duration-300 ease-out group-hover/section:opacity-100 hover:scale-110 hover:shadow-xl md:flex"
        >
          <ChevronRight className="h-5 w-5 text-ink" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
