"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search, Heart, ShoppingCart, Menu, X, User, Monitor, Package, Tag, Building2, Newspaper, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Categories", href: "/categories", icon: Monitor },
  { label: "Brands", href: "/brands", icon: Tag },
  { label: "Combo Offers", href: "/combo-offers", icon: Package },
  { label: "Bulk Sales", href: "/bulk-sales", icon: Building2 },
  { label: "Blog", href: "/blog", icon: Newspaper },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 250);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className="sticky top-0 z-50 bg-white transition-all duration-500 ease-out"
      style={{ height: scrolled ? 84 : 96 }}
    >
      <div className="mx-auto flex h-full max-w-[1760px] items-center justify-between px-6 md:px-10 lg:px-20">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-mob.png"
            alt="TradeHub UAE"
            width={scrolled ? 72 : 72}
            height={scrolled ? 50 : 50}
            className="md:hidden transition-all duration-500 ease-out"
            priority
          />
          <Image
            src="/logo-web.png"
            alt="TradeHub UAE"
            width={scrolled ? 172 : 172}
            height={scrolled ? 50 : 50}
            className="hidden md:block transition-all duration-500 ease-out"
            priority
          />
        </Link>

        {scrolled && (
          <div className="hidden animate-fade-in items-center rounded-full border border-line/80 bg-bg2 px-6 py-2.5 transition-all duration-500 ease-out md:flex">
            {["What", "Budget", "Condition"].map((label, i) => (
              <span key={label} className={`flex items-center gap-1.5 px-5 py-1.5 text-[15px] text-ink/80 ${i > 0 ? "border-l border-line/60" : ""}`}>
                {label}
                <ChevronDown className="h-4 w-4 text-ink-3" strokeWidth={2} />
              </span>
            ))}
            <button
              type="button"
              aria-label="Search"
              className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white transition-all duration-200 hover:bg-brand-dark active:scale-90"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
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
