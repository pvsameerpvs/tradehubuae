"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

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
  { key: "condition", label: "Condition", placeholder: "New, certified, any", icon: ShieldCheck },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  return (
    <header className={`sticky top-0 z-50 h-24 bg-white transition-shadow duration-200 ${scrolled ? "shadow-sm" : ""}`}>
      <div className="mx-auto flex h-full max-w-[1760px] items-center justify-between px-6 md:px-10 lg:px-20">
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
          className={`hidden flex-1 justify-center px-8 transition-all duration-200 sm:flex ${
            scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="flex items-center rounded-full border border-line bg-white shadow-search transition-shadow duration-200 focus-within:shadow-search-active">
            {SEARCH_SEGMENTS.map((seg, i) => (
              <button
                key={seg.key}
                type="button"
                className={`group flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
                  i > 0 ? "border-l border-line/60" : ""
                } hover:bg-bg3/40 first:rounded-l-full last:rounded-r-full`}
              >
                <seg.icon className="h-5 w-5 flex-shrink-0 text-ink-3 transition-colors group-hover:text-ink" strokeWidth={1.5} />
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-ink/60">
                    {seg.label}
                  </span>
                </div>
              </button>
            ))}
            <div className="flex items-center pl-2 pr-2">
              <button
                type="button"
                aria-label="Search"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white transition-all duration-200 hover:bg-brand-dark active:scale-90"
              >
                <Search className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-1 justify-center px-4 transition-all duration-200 sm:hidden ${
            scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="relative flex w-full max-w-[200px] items-center">
            <Search className="absolute left-3 h-4 w-4 text-ink-3" strokeWidth={2} />
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-full rounded-full border border-line/80 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-12 w-12 items-center justify-center text-ink transition-colors hover:text-ink/70"
          >
            <ShoppingCart className="h-6 w-6" strokeWidth={1.75} />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">
              0
            </span>
          </Link>
          <div ref={dropdownRef} className="relative">
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
                    <Link
                      href="/search"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg3"
                      onClick={() => setOpen(false)}
                    >
                      <Search className="h-4 w-4 text-ink-2" strokeWidth={1.5} />
                      Search
                    </Link>
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
                  <Link
                    href="/account"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg3"
                    onClick={() => setOpen(false)}
                  >
                    <User className="h-4 w-4 text-ink-2" strokeWidth={1.5} />
                    My Account
                  </Link>
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
    </header>
  );
}
