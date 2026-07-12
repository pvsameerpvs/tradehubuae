"use client";

import { Search } from "lucide-react";
import { useState } from "react";

const SEGMENTS = [
  { key: "what", label: "What", placeholder: "e.g. MacBook Air, gaming PC" },
  { key: "budget", label: "Budget", placeholder: "e.g. under 3000 AED" },
  { key: "condition", label: "Condition", placeholder: "e.g. new, certified, any" },
];

export function SearchBar() {
  const [activeSegment, setActiveSegment] = useState(0);

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="flex items-center divide-x divide-line overflow-hidden rounded-full border border-line bg-white shadow-search transition-shadow focus-within:shadow-search-active">
        {SEGMENTS.map((seg, i) => (
          <div
            key={seg.key}
            className="relative flex-1"
          >
            <button
              type="button"
              onClick={() => setActiveSegment(i)}
              className={`flex w-full flex-col items-start px-6 py-3 text-left transition-colors ${
                activeSegment === i ? "bg-bg3" : "hover:bg-bg3"
              }`}
            >
              <span className="text-xs font-semibold text-ink">{seg.label}</span>
              <span className="text-sm text-ink-3">{seg.placeholder}</span>
            </button>
          </div>
        ))}
        <button
          type="button"
          aria-label="Search"
          className="flex h-full items-center justify-center rounded-full bg-brand px-6 py-3 text-white transition-colors hover:bg-brand-dark"
        >
          <Search className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
