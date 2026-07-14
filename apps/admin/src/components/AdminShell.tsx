"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Package,
  FolderTree,
  Building,
  Warehouse,
  ShoppingCart,
  Users,
  Building2,
  Tags,
  FileText,
  Image,
  Search,
  BarChart3,
  Bot,
  Settings,
  Shield,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@tradehubuae/ui";

const primaryNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Categories", href: "/categories", icon: FolderTree },
  { label: "Brands", href: "/brands", icon: Building },
  { label: "Customers", href: "/customers", icon: Users },
];

const secondaryNav = [
  { label: "Live Chat", href: "/dashboard/chats", icon: MessageCircle },
  { label: "Inventory", href: "/inventory", icon: Warehouse },
  { label: "Combo Offers", href: "/combo-offers", icon: Tags },
  { label: "Bulk Sales", href: "/bulk-sales", icon: Building2 },

  { label: "Media", href: "/media", icon: Image },
  { label: "Blog", href: "/blog", icon: FileText },
  { label: "SEO", href: "/seo", icon: Search },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "AI Assistant", href: "/ai", icon: Bot },
  { label: "Users", href: "/users", icon: Shield },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allNav = [...primaryNav, ...secondaryNav];
  const currentPage = allNav.find((item) => pathname.startsWith(item.href))?.label ?? "Admin";

  return (
    <div className="flex h-screen bg-bg2">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always fixed, never scrolls */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5 lg:h-16 lg:px-6">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-brand">
            TradeHub
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-bg3 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.04em] text-ink-3">Main</p>
          {primaryNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-ink-2 hover:bg-bg3 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5" strokeWidth={2} />
                )}
              </Link>
            );
          })}
          <div className="my-3 border-t border-line" />
          <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.04em] text-ink-3">More</p>
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-ink-2 hover:bg-bg3 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5" strokeWidth={2} />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-line p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink truncate">Admin</p>
              <p className="text-xs text-ink-3 truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area — scrolls independently */}
      <div className="flex flex-1 flex-col min-w-0 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-line bg-white px-4 lg:h-16 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-bg3 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-ink">{currentPage}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-ink-2 hover:bg-bg3 sm:flex"
            >
              View Site
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg2 text-xs font-bold text-ink-2">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
