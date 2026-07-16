"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProducts, fetchBrands, fetchUses, type Brand, type Use } from "@/data";

const TABS = [
  { key: "budget", label: "By Budget" },
  { key: "brand", label: "By Brand" },
  { key: "use", label: "By Use" },
];

interface BudgetRange {
  label: string;
  href: string;
  tag: string;
  count: number;
}

function computeBudgetRanges(products: { price: number }[]): BudgetRange[] {
  const prices = products.map((p) => p.price).filter((p) => p > 0);
  if (prices.length === 0) return [];

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;
  const step = range / 5;

  const ranges: { label: string; min: number | null; max: number | null }[] = [];
  for (let i = 0; i < 5; i++) {
    const lo = Math.round(min + i * step);
    const hi = Math.round(min + (i + 1) * step);
    if (i === 0) {
      ranges.push({ label: `Under ${fmt(hi)}`, min: null, max: hi });
    } else if (i === 4) {
      ranges.push({ label: `${fmt(lo)}+`, min: lo, max: null });
    } else {
      ranges.push({ label: `${fmt(lo)} — ${fmt(hi)}`, min: lo, max: hi });
    }
  }

  return ranges
    .map((r) => {
      const count = prices.filter((p) => {
        if (r.min !== null && p < r.min) return false;
        if (r.max !== null && p >= r.max) return false;
        return true;
      }).length;
      const params = new URLSearchParams();
      if (r.min !== null) params.set("minPrice", String(r.min));
      if (r.max !== null) params.set("maxPrice", String(r.max));
      const tag = count >= ranges.length * 15 ? "Popular" : `${count} items`;
      return { label: r.label, href: `/search?${params.toString()}`, tag, count };
    })
    .filter((r) => r.count > 0);
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

function Carousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const outer = scrollRef.current;
    const inner = innerRef.current;
    if (outer && inner) {
      setIsOverflowing(inner.scrollWidth > outer.clientWidth);
    }
  }, [children]);

  function scroll(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="group relative mt-6">
      <button
        type="button"
        onClick={() => scroll(-280)}
        className="absolute -left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-md opacity-0 transition-all hover:shadow-lg group-hover:opacity-100 lg:flex"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4 text-ink" />
      </button>
      <button
        type="button"
        onClick={() => scroll(280)}
        className="absolute -right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-md opacity-0 transition-all hover:shadow-lg group-hover:opacity-100 lg:flex"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4 text-ink" />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={innerRef}
          className={`flex gap-3 ${isOverflowing ? "" : "mx-auto"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function BrandLogo({ brand }: { brand: Brand }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError && brand.image) {
    return (
      <img
        src={brand.image}
        alt={brand.name}
        className="h-full w-full object-contain p-5"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span className="text-4xl font-bold text-ink-2">
      {brand.name.charAt(0)}
    </span>
  );
}

function UseCard({ useItem }: { useItem: Use }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/uses/${useItem.slug}`}
      className="group relative flex w-[260px] flex-shrink-0 flex-col items-center justify-end overflow-hidden rounded-2xl bg-bg2 transition-all hover:shadow-lg hover:-translate-y-0.5 sm:w-[320px]"
      style={{ aspectRatio: "4/3" }}
    >
      {!imgError && useItem.image && (
        <img
          src={useItem.image}
          alt={useItem.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      )}
      {imgError && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-bg2" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="relative z-10 mb-5 w-[calc(100%-40px)] rounded-xl bg-white/95 px-5 py-3 text-center backdrop-blur-sm">
        <p className="text-base font-semibold text-ink" style={{ letterSpacing: "-0.01em" }}>
          {useItem.name}
        </p>
      </div>
    </Link>
  );
}

export function DiscoveryGrid() {
  const [activeTab, setActiveTab] = useState("brand");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [budgetRanges, setBudgetRanges] = useState<BudgetRange[]>([]);
  const [uses, setUses] = useState<Use[]>([]);

  useEffect(() => {
    fetchBrands().then(setBrands);
    fetchUses().then(setUses);
    fetchProducts({ limit: 200 }).then((res) => {
      setBudgetRanges(computeBudgetRanges(res.products));
    });
  }, []);

  return (
    <section>
      <div className="mb-8 flex items-center gap-4">
        <div>
          <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
            Discover
          </h2>
          <p className="mt-1 text-sm text-ink-2">Find what you need, your way</p>
        </div>
        <div className="hidden h-px flex-1 bg-gradient-to-r from-line to-transparent sm:block" />
      </div>

      <div className="flex gap-1 rounded-2xl bg-bg2 p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-ink shadow-sm"
                : "text-ink-2 hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "budget" && (
        <Carousel>
          {budgetRanges.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-ink-3 w-full">
              No products available yet
            </div>
          ) : (
            budgetRanges.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group w-[260px] flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-bg2 p-7 transition-all hover:shadow-lg hover:-translate-y-0.5 sm:w-[300px]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">AED</p>
                <p className="mt-2 text-2xl font-bold text-ink" style={{ letterSpacing: "-0.02em" }}>
                  {item.label}
                </p>
                <span className="mt-4 inline-block rounded-lg bg-ink/5 px-3 py-1 text-[11px] font-semibold text-ink-2 transition-colors group-hover:bg-brand/10 group-hover:text-brand">
                  {item.tag}
                </span>
              </Link>
            ))
          )}
        </Carousel>
      )}

      {activeTab === "brand" && (
        <Carousel>
          {brands.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-ink-3 w-full">
              No brands available yet
            </div>
          ) : (
            brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="flex w-[170px] flex-shrink-0 items-center justify-center rounded-2xl bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 sm:w-[200px]"
                style={{ aspectRatio: "1/1" }}
              >
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
                  <BrandLogo brand={brand} />
                </div>
              </Link>
            ))
          )}
        </Carousel>
      )}

      {activeTab === "use" && (
        <Carousel>
          {uses.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-ink-3 w-full">
              No use cases available yet
            </div>
          ) : (
            uses.map((useItem) => (
              <UseCard key={useItem.slug} useItem={useItem} />
            ))
          )}
        </Carousel>
      )}
    </section>
  );
}
