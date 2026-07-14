"use client";

import { Search, Monitor, Wallet, ShieldCheck } from "lucide-react";

const SEGMENTS = [
  { key: "what", label: "What", placeholder: "MacBook Air, gaming PC...", icon: Monitor },
  { key: "budget", label: "Budget", placeholder: "Under 3000 AED...", icon: Wallet },
  { key: "condition", label: "Condition", placeholder: "New, certified, any", icon: ShieldCheck },
];

export function SearchBar() {
  return (
    <div className="mx-auto w-full max-w-[1060px]">
      <div className="hidden items-center rounded-full border border-line/80 bg-white shadow-search transition-shadow duration-200 focus-within:shadow-search-active sm:flex">
        {SEGMENTS.map((seg, i) => (
          <button
            key={seg.key}
            type="button"
            className={`group relative flex flex-1 items-center gap-4 px-7 py-5 text-left transition-all duration-200 sm:px-8 ${
              i > 0 ? "border-l border-line/60" : ""
            } hover:bg-bg3/40`}
          >
            <seg.icon className="h-6 w-6 flex-shrink-0 text-ink-3 transition-colors group-hover:text-ink" strokeWidth={1.5} />
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink/60">
                {seg.label}
              </span>
              <span className="block truncate text-[14px] text-ink-3 transition-colors group-hover:text-ink-2">
                {seg.placeholder}
              </span>
            </div>
          </button>
        ))}
        <div className="flex items-center pl-2 pr-3">
          <button
            type="button"
            aria-label="Search"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white transition-all duration-200 hover:bg-brand-dark active:scale-90"
          >
            <Search className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex px-2 sm:hidden sm:px-0">
        <div className="relative flex w-full items-center">
          <Search className="absolute left-[18px] h-5 w-5 text-ink-3" strokeWidth={2} />
          <input
            type="search"
            placeholder="Search laptops, PCs, accessories..."
            className="h-[52px] w-full rounded-full border-0 bg-white/95 pl-[50px] pr-5 text-[15px] text-ink placeholder:text-ink-3 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-shadow duration-200 focus:shadow-[0_4px_16px_rgba(0,0,0,0.14)] focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>
    </div>
  );
}
