"use client";

import Link from "next/link";
import { useState } from "react";

const TABS = [
  { key: "budget", label: "By Budget" },
  { key: "brand", label: "By Brand" },
  { key: "use", label: "By Use" },
];

const LINKS: Record<string, Array<{ label: string; href: string }>> = {
  budget: [
    { label: "Under 1000 AED", href: "/search?maxPrice=1000" },
    { label: "1000 - 3000 AED", href: "/search?minPrice=1000&maxPrice=3000" },
    { label: "3000 - 5000 AED", href: "/search?minPrice=3000&maxPrice=5000" },
    { label: "5000 - 8000 AED", href: "/search?minPrice=5000&maxPrice=8000" },
    { label: "8000+ AED", href: "/search?minPrice=8000" },
  ],
  brand: [
    { label: "Dell", href: "/brands/dell" },
    { label: "HP", href: "/brands/hp" },
    { label: "Lenovo", href: "/brands/lenovo" },
    { label: "Apple", href: "/brands/apple" },
    { label: "ASUS", href: "/brands/asus" },
    { label: "Samsung", href: "/brands/samsung" },
  ],
  use: [
    { label: "Gaming Laptops", href: "/categories/gaming-laptops" },
    { label: "Business Laptops", href: "/categories/business-laptops" },
    { label: "Workstations", href: "/categories/workstations" },
    { label: "Home Office", href: "/categories/home-office" },
    { label: "Content Creation", href: "/categories/content-creation" },
    { label: "Student Laptops", href: "/categories/student-laptops" },
  ],
};

export function DiscoveryGrid() {
  const [activeTab, setActiveTab] = useState("budget");

  return (
    <section>
      <h2 className="mb-6 text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
        Discover
      </h2>
      <div className="flex gap-1 rounded-xl bg-bg2 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-ink shadow-sm"
                : "text-ink-2 hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(LINKS[activeTab] ?? []).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-line px-4 py-3 text-sm text-ink-2 transition-all hover:border-ink hover:text-ink hover:shadow-sm"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
