"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { searchProducts } from "@/lib/actions/products";
import type { ProductData } from "@/lib/actions/products";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await searchProducts(q, { limit: 6 });
    setResults(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasResults = results.length > 0;

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="relative">
        <Search className="absolute left-[18px] top-1/2 h-5 w-5 -translate-y-1/2 text-ink-3" strokeWidth={2} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
          placeholder="Search laptops, PCs, accessories..."
          className="h-[56px] w-full rounded-full border border-line/80 bg-white pl-[50px] pr-14 text-[15px] text-ink placeholder:text-ink-3 shadow-search transition-shadow duration-200 focus:shadow-search-active focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
        {loading && (
          <Loader2 className="absolute right-[18px] top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-ink-3" strokeWidth={2} />
        )}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full max-w-[560px] rounded-xl border border-line bg-white shadow-panel"
        >
          {loading && results.length === 0 ? (
            <div className="flex items-center gap-3 px-5 py-4 text-sm text-ink-2">
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Searching...
            </div>
          ) : hasResults ? (
            <ul>
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-bg3 last:rounded-b-xl"
                  >
                    {product.images?.[0]?.url && (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt ?? product.name}
                        className="h-12 w-12 flex-shrink-0 rounded-lg bg-bg2 object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                      {product.category?.name && (
                        <p className="text-xs text-ink-2">{product.category.name}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-ink">
                      AED {product.price.toLocaleString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : query.trim() && !loading ? (
            <div className="px-5 py-4 text-sm text-ink-2">
              No products found for &ldquo;{query}&rdquo;
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
