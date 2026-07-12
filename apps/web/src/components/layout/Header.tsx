"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Heart, ShoppingCart, Menu, X, User } from "lucide-react";

const NAV_LINKS = [
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Combo Offers", href: "/combo-offers" },
  { label: "Bulk Sales", href: "/bulk-sales" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink transition-colors hover:text-ink/70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-ink/70"
          >
            <Search className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="hidden h-10 w-10 items-center justify-center text-ink transition-colors hover:text-ink/70 md:flex"
          >
            <Heart className="h-5 w-5" strokeWidth={1.75} />
          </Link>
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
          <Link href="/account" aria-label="Account" className="hidden h-10 w-10 items-center justify-center text-ink transition-colors hover:text-ink/70 md:flex">
            <User className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center text-ink md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line md:hidden">
          <div className="mx-auto max-w-[1760px] space-y-1 px-6 py-4">
            <Link
              href="/search"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-bg3"
              onClick={() => setMobileOpen(false)}
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
              Search
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-bg3"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-line" />
            <Link
              href="/account"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-bg3"
              onClick={() => setMobileOpen(false)}
            >
              <User className="h-4 w-4" strokeWidth={1.75} />
              My Account
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-bg3"
              onClick={() => setMobileOpen(false)}
            >
              <Heart className="h-4 w-4" strokeWidth={1.75} />
              Wishlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
