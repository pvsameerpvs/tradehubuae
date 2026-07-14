"use client";

import Link from "next/link";
import { X, ShieldCheck, ExternalLink } from "lucide-react";
import { cn } from "@tradehubuae/ui";
import { navSections } from "../../lib/navigation";
import { NavLinks } from "./NavLinks";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-white shadow-xl transition-transform duration-300 ease-out lg:w-64 lg:shadow-none",
        open ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5 lg:h-16 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img src="/logo-mob.png" alt="TradeHub" className="h-9 w-auto object-contain" />
          <span className="font-heading text-lg tracking-tight text-ink">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-bg3 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-3">
        <NavLinks sections={navSections} onNavClick={onClose} />
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg bg-bg2 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">Admin</p>
            <p className="flex items-center gap-1 truncate text-xs text-ink-3">
              <ShieldCheck className="h-3 w-3" strokeWidth={1.75} />
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
