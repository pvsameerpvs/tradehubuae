"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  MapPin,
  LogOut,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/account" },
  { id: "orders", label: "Orders", icon: ClipboardList, href: "/account/orders" },
  { id: "details", label: "Account Details", icon: UserCircle, href: "/account/details" },
  { id: "addresses", label: "Addresses", icon: MapPin, href: "/account/addresses" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

  const activeTab = pathname === "/account" ? "overview" : pathname.replace("/account/", "");

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 lg:py-10">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back
      </button>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          My Account
        </h1>
        <p className="mt-1 text-sm text-ink-2 sm:text-base">Manage your profile, orders, and addresses</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-lg font-bold text-white shadow-sm">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">Ahmed Al Maktoum</p>
                <p className="truncate text-sm text-ink-2">ahmed@example.com</p>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-brand text-white shadow-sm"
                        : "text-ink-2 hover:bg-bg2 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <hr className="my-4 border-line" />
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-sale transition-all duration-200 hover:bg-sale/5">
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Tab Selector */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileTabOpen(!mobileTabOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-line bg-white px-4 py-3.5 text-sm font-medium text-ink shadow-sm transition-all duration-200"
          >
            <span className="flex items-center gap-3">
              {(() => {
                const activeTabInfo = tabs.find((t) => t.id === activeTab);
                const Icon = activeTabInfo?.icon;
                return (
                  <>
                    {Icon && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10">
                        <Icon className="h-4 w-4 text-brand" strokeWidth={1.5} />
                      </span>
                    )}
                    <span>{activeTabInfo?.label ?? "Overview"}</span>
                  </>
                );
              })()}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-ink-3 transition-transform duration-200 ${mobileTabOpen ? "rotate-180" : ""}`}
              strokeWidth={2}
            />
          </button>
          {mobileTabOpen && (
            <div className="mt-1.5 animate-fade-in overflow-hidden rounded-xl border border-line bg-white shadow-sm">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    onClick={() => setMobileTabOpen(false)}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id ? "bg-brand/10 text-brand" : "text-ink-2 hover:bg-bg2"
                    } ${i < tabs.length - 1 ? "border-b border-line" : ""}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
