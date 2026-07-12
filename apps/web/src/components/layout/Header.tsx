"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search, Heart, ShoppingCart, Menu, X, User, Monitor, Package, Tag, Building2, Newspaper } from "lucide-react";

const NAV_LINKS = [
  { label: "Categories", href: "/categories", icon: Monitor },
  { label: "Brands", href: "/brands", icon: Tag },
  { label: "Combo Offers", href: "/combo-offers", icon: Package },
  { label: "Bulk Sales", href: "/bulk-sales", icon: Building2 },
  { label: "Blog", href: "/blog", icon: Newspaper },
];

export function Header() {
  const [open, setOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-line bg-white">
      <div className="mx-auto flex h-full max-w-[1760px] items-center justify-between px-6 md:px-10 lg:px-20">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-mob.png"
            alt="TradeHub UAE"
            width={57}
            height={40}
            className="md:hidden"
            priority
          />
          <Image
            src="/logo-web.png"
            alt="TradeHub UAE"
            width={137}
            height={40}
            className="hidden md:block"
            priority
          />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-ink/70"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
              0
            </span>
          </Link>
          <div ref={dropdownRef} className="relative">
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-ink/70"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
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
