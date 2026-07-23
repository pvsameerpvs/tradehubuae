"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  User,
  Monitor,
  Package,
  Tag,
  Building2,
  Newspaper,
  Wallet,
  ShieldCheck,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/supabase/provider";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { searchProducts } from "@/lib/actions/products";
import { fetchProducts } from "@/data";
import type { ProductData } from "@/lib/actions/products";

const NAV_LINKS = [
  { label: "Categories", href: "/categories", icon: Monitor },
  { label: "Brands", href: "/brands", icon: Tag },
  { label: "Combo Offers", href: "/combo-offers", icon: Package },
  { label: "Bulk Sales", href: "/bulk-sales", icon: Building2 },
  { label: "Blog", href: "/blog", icon: Newspaper },
];

const SEARCH_SEGMENTS = [
  { key: "what", label: "What", placeholder: "MacBook Air, gaming PC...", icon: Monitor },
  { key: "budget", label: "Budget", placeholder: "Under 3000 AED...", icon: Wallet },
  { key: "condition", label: "Condition", placeholder: "New, used, any", icon: ShieldCheck },
];

const CONDITIONS = [
  { value: "", label: "Any", description: "All conditions" },
  { value: "new", label: "New", description: "Brand new, sealed" },
  { value: "used", label: "Used", description: "Pre-owned, second-hand" },
];

interface BudgetRange {
  label: string;
  min: number | null;
  max: number | null;
}

function computeBudgetRanges(products: { price: number }[]): BudgetRange[] {
  const prices = products.map((p) => p.price).filter((p) => p > 0);
  if (prices.length === 0) return [];

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;
  const step = range / 5;

  const ranges: BudgetRange[] = [];
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
  return ranges;
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [budgetRanges, setBudgetRanges] = useState<BudgetRange[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange | null>(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const whatLabel = searchQuery || "What";
  const budgetLabel = selectedBudget ? selectedBudget.label : "Budget";
  const conditionLabel = selectedCondition
    ? CONDITIONS.find((c) => c.value === selectedCondition)?.label ?? "Condition"
    : "Condition";

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchProducts({ limit: 200 }).then((res) => {
      setBudgetRanges(computeBudgetRanges(res.products));
    });
  }, []);

  useEffect(() => {
    if (!activeSegment) return;
    const handleClick = (e: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
        setActiveSegment(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activeSegment]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const data = await searchProducts(q, { limit: 5 });
    setSearchResults(data);
    setSearchLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(searchQuery), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, doSearch]);

  function handleSegmentClick(key: string) {
    if (activeSegment === key) {
      setActiveSegment(null);
      return;
    }
    setActiveSegment(key);
    if (key === "what") {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedBudget?.min != null) params.set("minPrice", String(selectedBudget.min));
    if (selectedBudget?.max != null) params.set("maxPrice", String(selectedBudget.max));
    if (selectedCondition) params.set("condition", selectedCondition);
    router.push(`/search?${params.toString()}`);
  }

  function handleBudgetSelect(range: BudgetRange) {
    setSelectedBudget(range);
    setActiveSegment(null);
  }

  function handleConditionSelect(value: string) {
    setSelectedCondition(value);
    setActiveSegment(null);
  }

  function handleMobileSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = new FormData(form).get("q") as string;
    if (q?.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "bg-white shadow-panel" : "bg-white/70 backdrop-blur-md"}`}
    >
      <div className="mx-auto max-w-[1760px] px-6 md:px-10 lg:px-20">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-mob.png"
              alt="TradeHub UAE"
              width={72}
              height={50}
              className="md:hidden"
              priority
            />
            <Image
              src="/logo-web.png"
              alt="TradeHub UAE"
              width={172}
              height={50}
              className="hidden md:block"
              priority
            />
          </Link>

          <div
            className={`relative hidden flex-1 justify-center px-8 transition-all duration-200 sm:flex ${
              scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <div
              ref={searchDropdownRef}
              className="flex items-center rounded-full border border-line bg-white shadow-search transition-shadow duration-200 focus-within:shadow-search-active"
            >
              {SEARCH_SEGMENTS.map((seg, i) => (
                <button
                  key={seg.key}
                  type="button"
                  onClick={() => handleSegmentClick(seg.key)}
                  className={`group relative flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
                    i > 0 ? "border-l border-line/60" : ""
                  } hover:bg-bg3/40 first:rounded-l-full last:rounded-r-full`}
                >
                  <seg.icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      activeSegment === seg.key ? "text-brand" : "text-ink-3 group-hover:text-ink"
                    }`}
                    strokeWidth={1.5}
                  />
                  <div className="min-w-0">
                    <span
                      className={`text-[12px] font-semibold uppercase tracking-[0.04em] transition-colors ${
                        (seg.key === "what" && searchQuery) ||
                        (seg.key === "budget" && selectedBudget) ||
                        (seg.key === "condition" && selectedCondition)
                          ? "text-brand"
                          : "text-ink/60"
                      }`}
                    >
                      {seg.key === "what"
                        ? whatLabel
                        : seg.key === "budget"
                          ? budgetLabel
                          : conditionLabel}
                    </span>
                  </div>

                  {activeSegment === seg.key && (
                    <div
                      className="absolute left-0 top-full z-50 mt-3 w-[280px] rounded-xl border border-line bg-white p-2 shadow-panel"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {seg.key === "what" && (
                        <div>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={2} />
                            <input
                              ref={searchInputRef}
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search products..."
                              className="h-10 w-full rounded-lg border border-line/80 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-ink/10"
                            />
                          </div>
                          {searchLoading && (
                            <div className="flex items-center gap-2 px-3 py-2 text-sm text-ink-2">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                              Searching...
                            </div>
                          )}
                          {searchResults.length > 0 && (
                            <ul className="mt-1">
                              {searchResults.map((product) => (
                                <li key={product.id}>
                                  <Link
                                    href={`/products/${product.slug}`}
                                    onClick={() => {
                                      setActiveSegment(null);
                                      setSearchQuery("");
                                    }}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-bg3"
                                  >
                                    {product.images?.[0]?.url && (
                                      <img
                                        src={product.images[0].url}
                                        alt={product.images[0].alt ?? product.name}
                                        className="h-8 w-8 flex-shrink-0 rounded-md bg-bg2 object-cover"
                                      />
                                    )}
                                    <span className="truncate flex-1">{product.name}</span>
                                    <span className="shrink-0 text-xs font-semibold text-ink-2">
                                      AED {product.price.toLocaleString()}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                          {searchQuery.trim() && !searchLoading && searchResults.length === 0 && (
                            <div className="px-3 py-2 text-sm text-ink-2">No products found</div>
                          )}
                        </div>
                      )}

                      {seg.key === "budget" && (
                        <div>
                          {budgetRanges.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-ink-2">Loading budgets...</div>
                          ) : (
                            budgetRanges.map((range) => (
                              <div
                                key={range.label}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleBudgetSelect(range)}
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleBudgetSelect(range); }}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-bg3 ${
                                  selectedBudget?.label === range.label ? "bg-brand/5 text-brand" : "text-ink"
                                }`}
                              >
                                <span className="font-medium">AED {range.label}</span>
                                <ChevronDown className="h-3.5 w-3.5 -rotate-90 opacity-40" strokeWidth={2} />
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {seg.key === "condition" && (
                        <div>
                          {CONDITIONS.map((cond) => (
                            <div
                              key={cond.value}
                              role="button"
                              tabIndex={0}
                              onClick={() => handleConditionSelect(cond.value)}
                              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleConditionSelect(cond.value); }}
                              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-bg3 ${
                                selectedCondition === cond.value ? "bg-brand/5 text-brand" : "text-ink"
                              }`}
                            >
                              <div className="text-left">
                                <span className="font-medium">{cond.label}</span>
                                <span className="ml-2 text-xs text-ink-2">{cond.description}</span>
                              </div>
                              {selectedCondition === cond.value && (
                                <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ))}
              <div className="flex items-center pl-2 pr-2">
                <button
                  type="button"
                  aria-label="Search"
                  onClick={handleSearch}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white transition-all duration-200 hover:bg-brand-dark active:scale-90"
                >
                  <Search className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-12 w-12 items-center justify-center text-ink transition-colors hover:text-ink/70"
            >
              <Heart className="h-6 w-6" strokeWidth={1.75} />
              {wishlistCount > 0 && (
                <span
                  key={wishlistCount}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative flex h-12 w-12 items-center justify-center text-ink transition-colors hover:text-ink/70"
            >
              <ShoppingCart className="h-6 w-6" strokeWidth={1.75} />
              {count > 0 && (
                <span
                  key={count}
                  className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] animate-bounce items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white"
                >
                  {count}
                </span>
              )}
            </Link>
            <div ref={menuRef} className="relative">
              <button
                aria-label={open ? "Close menu" : "Open menu"}
                className="flex h-12 w-12 items-center justify-center text-ink transition-colors hover:text-ink/70"
                onClick={() => setOpen(!open)}
              >
                {open ? <X className="h-6 w-6" strokeWidth={1.75} /> : <Menu className="h-6 w-6" strokeWidth={1.75} />}
              </button>
              {open && (
                <>
                  <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-line bg-white px-1 py-2 shadow-panel">
                    <div className="space-y-0.5">
                      {NAV_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg3"
                            onClick={() => setOpen(false)}
                          >
                            <Icon className="h-4 w-4 text-ink-2" strokeWidth={1.5} />
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                    <hr className="mx-2 my-2 border-line" />
                    {user ? (
                      <>
                        <Link
                          href="/account"
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg3"
                          onClick={() => setOpen(false)}
                        >
                          <User className="h-4 w-4 text-ink-2" strokeWidth={1.5} />
                          My Account
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/auth"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-bg3"
                        onClick={() => setOpen(false)}
                      >
                        <User className="h-4 w-4" strokeWidth={1.5} />
                        Sign In
                      </Link>
                    )}
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg3"
                      onClick={() => setOpen(false)}
                    >
                      <Heart className="h-4 w-4 text-ink-2" strokeWidth={1.5} />
                      Wishlist
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {scrolled && (
          <div className="pb-4 sm:hidden">
            <form onSubmit={handleMobileSearch} className="relative mx-auto max-w-[400px]">
              <Search className="absolute left-4 h-4 w-4 top-1/2 -translate-y-1/2 text-ink-3" strokeWidth={2} />
              <input
                name="q"
                type="search"
                placeholder="Search laptops, PCs, accessories..."
                className="h-12 w-full rounded-full border border-line/80 bg-white pl-11 pr-4 text-sm text-ink placeholder:text-ink-3 shadow-search transition-shadow duration-200 focus:shadow-search-active focus:outline-none focus:ring-2 focus:ring-ink/10"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
