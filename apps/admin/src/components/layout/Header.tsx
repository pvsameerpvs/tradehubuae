"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ExternalLink } from "lucide-react";
import { cn } from "@tradehubuae/ui";
import { navSections } from "../../lib/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const allNav = navSections.flatMap((s) => s.items);
  const currentPage = allNav.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  )?.label ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-line bg-white/80 px-4 backdrop-blur-sm lg:h-16 lg:px-8">
      <div className="flex w-full items-center justify-between lg:hidden">
        <div className="flex w-8 items-center justify-start">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-bg3"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
        <Link href="/dashboard">
          <img src="/logo-mob.png" alt="TradeHub" className="h-7 w-auto" />
        </Link>
        <div className="flex w-8 items-center justify-end">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            A
          </div>
        </div>
      </div>

      <div className="hidden w-full items-center justify-between lg:flex">
        <span className="font-semibold text-ink">{currentPage}</span>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={cn(
              "hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
              "text-ink-2 transition-colors hover:bg-bg3 sm:flex",
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            View Site
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
