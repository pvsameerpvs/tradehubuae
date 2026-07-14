"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TABS = [
  { key: "budget", label: "By Budget" },
  { key: "brand", label: "By Brand" },
  { key: "use", label: "By Use" },
];

const BUDGET_ITEMS = [
  { label: "Under 1,000", sub: "AED", href: "/search?maxPrice=1000", tag: "Budget friendly" },
  { label: "1,000 - 3,000", sub: "AED", href: "/search?minPrice=1000&maxPrice=3000", tag: "Mid range" },
  { label: "3,000 - 5,000", sub: "AED", href: "/search?minPrice=3000&maxPrice=5000", tag: "Performance" },
  { label: "5,000 - 8,000", sub: "AED", href: "/search?minPrice=5000&maxPrice=8000", tag: "Premium" },
  { label: "8,000+", sub: "AED", href: "/search?minPrice=8000", tag: "High end" },
];

const BRAND_LOGOS: Record<string, string> = {
  dell: "https://logo.clearbit.com/dell.com",
  hp: "https://logo.clearbit.com/hp.com",
  lenovo: "https://logo.clearbit.com/lenovo.com",
  apple: "https://logo.clearbit.com/apple.com",
  asus: "https://logo.clearbit.com/asus.com",
  samsung: "https://logo.clearbit.com/samsung.com",
};

const BRAND_ITEMS = [
  { label: "Dell", slug: "dell", href: "/brands/dell" },
  { label: "HP", slug: "hp", href: "/brands/hp" },
  { label: "Lenovo", slug: "lenovo", href: "/brands/lenovo" },
  { label: "Apple", slug: "apple", href: "/brands/apple" },
  { label: "ASUS", slug: "asus", href: "/brands/asus" },
  { label: "Samsung", slug: "samsung", href: "/brands/samsung" },
];

const USE_IMAGES: Record<string, string> = {
  gaming: "/images/uses/gaming.jpg",
  office: "/images/uses/office.jpg",
  student: "/images/uses/student.jpg",
  "content-creation": "/images/uses/content-creation.jpg",
  business: "/images/uses/business.jpg",
};

const USE_ITEMS = [
  { label: "Gaming", slug: "gaming", href: "/uses/gaming" },
  { label: "Office", slug: "office", href: "/uses/office" },
  { label: "Student", slug: "student", href: "/uses/student" },
  { label: "Content Creation", slug: "content-creation", href: "/uses/content-creation" },
  { label: "Business", slug: "business", href: "/uses/business" },
];

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

export function DiscoveryGrid() {
  const [activeTab, setActiveTab] = useState("brand");

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
          {BUDGET_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group w-[260px] flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-bg2 p-7 transition-all hover:shadow-lg hover:-translate-y-0.5 sm:w-[300px]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{item.sub}</p>
              <p className="mt-2 text-2xl font-bold text-ink" style={{ letterSpacing: "-0.02em" }}>
                {item.label}
              </p>
              <span className="mt-4 inline-block rounded-lg bg-ink/5 px-3 py-1 text-[11px] font-semibold text-ink-2 transition-colors group-hover:bg-brand/10 group-hover:text-brand">
                {item.tag}
              </span>
            </Link>
          ))}
        </Carousel>
      )}

      {activeTab === "brand" && (
        <Carousel>
          {BRAND_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex w-[170px] flex-shrink-0 items-center justify-center rounded-2xl bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 sm:w-[200px]"
              style={{ aspectRatio: "1/1" }}
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={BRAND_LOGOS[item.slug]}
                  alt={item.label}
                  className="h-full w-full object-contain p-5"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement("span");
                      fallback.className = "text-4xl font-bold text-ink-2";
                      fallback.textContent = item.label.charAt(0);
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </Link>
          ))}
        </Carousel>
      )}

      {activeTab === "use" && (
        <Carousel>
          {USE_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex w-[260px] flex-shrink-0 flex-col items-center justify-end overflow-hidden rounded-2xl bg-bg2 transition-all hover:shadow-lg hover:-translate-y-0.5 sm:w-[320px]"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={USE_IMAGES[item.slug]}
                alt={item.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="relative z-10 mb-5 w-[calc(100%-40px)] rounded-xl bg-white/95 px-5 py-3 text-center backdrop-blur-sm">
                <p className="text-base font-semibold text-ink" style={{ letterSpacing: "-0.01em" }}>
                  {item.label}
                </p>
              </div>
            </Link>
          ))}
        </Carousel>
      )}
    </section>
  );
}
