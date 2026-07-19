"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  MapPin,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Button,
} from "@tradehubuae/ui";
import { useAuth } from "@/lib/supabase/provider";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/account" },
  { id: "orders", label: "Orders", icon: ClipboardList, href: "/account/orders" },
  { id: "details", label: "Account Details", icon: UserCircle, href: "/account/details" },
  { id: "addresses", label: "Addresses", icon: MapPin, href: "/account/addresses" },
];

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const activeTab = pathname === "/account" ? "overview" : pathname.replace("/account/", "");

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 lg:py-10">
        <div className="mb-6 h-7 w-40 animate-pulse rounded-lg bg-gradient-to-r from-bg2 to-bg3 sm:mb-8" />
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="animate-pulse rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-bg2 to-bg3" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-4 w-28 rounded-lg bg-bg2" />
                  <div className="h-3 w-40 rounded-lg bg-bg2" />
                </div>
              </div>
              <div className="space-y-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-11 w-full rounded-xl bg-bg2" />
                ))}
              </div>
            </div>
          </aside>
          <div className="lg:col-span-3">
            <div className="h-72 animate-pulse rounded-2xl border border-line/60 bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = getInitials(user.name);

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          My Account
        </h1>
        <p className="mt-1.5 text-sm text-ink-2 sm:text-base">Manage your profile, orders, and addresses</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-line/60 bg-white p-5 shadow-sm transition-all">
            {/* Profile Card */}
            <div className="relative mb-5 overflow-hidden rounded-xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white">
              <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/5" />
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-white/5" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-base font-bold backdrop-blur-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name ?? "User"}</p>
                  <p className="truncate text-xs text-white/70">{user.email}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand text-white shadow-sm"
                        : "text-ink-2 hover:bg-bg2 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                    {tab.label}
                    {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5" strokeWidth={2} />}
                  </Link>
                );
              })}
            </nav>

            <hr className="my-4 border-line" />

            <button
              onClick={() => setSignOutOpen(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-sale/80 transition-all duration-200 hover:bg-red-50 hover:text-sale"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-sm font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user.name ?? "User"}</p>
              <p className="truncate text-xs text-ink-2">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setMobileTabOpen(!mobileTabOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-line bg-white px-4 py-3.5 text-sm font-medium text-ink shadow-sm transition-all duration-200 active:scale-[0.99]"
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
            <div className="mt-1.5 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    onClick={() => setMobileTabOpen(false)}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 ${
                      isActive ? "bg-brand/10 text-brand" : "text-ink-2 hover:bg-bg2"
                    } ${i < tabs.length - 1 ? "border-b border-line" : ""}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                    {tab.label}
                  </Link>
                );
              })}
              <hr className="border-line" />
              <button
                onClick={() => { setSignOutOpen(true); setMobileTabOpen(false); }}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium text-sale/80 transition-colors hover:bg-red-50 hover:text-sale"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">{children}</div>
      </div>

      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <DialogContent className="sm:max-w-[340px]">
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSignOutOpen(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={signOut}>
              Yes, Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
