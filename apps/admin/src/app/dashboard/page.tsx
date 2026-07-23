"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, ShoppingCart, Users, TrendingUp, AlertTriangle,
  ArrowRight, Plus, Eye, Search, BarChart3, RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { api, type PaginatedResponse } from "@/lib/api";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface DashboardStats {
  totalProducts: number;
  activeOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  revenue: number;
}

interface RecentProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  images: { url: string }[];
  brand?: { name: string } | null;
}

interface SeoStats {
  optimizedCount: number;
  totalProducts: number;
  coverage: number;
  staleCount: number;
  lastRun: string;
}

interface TrendPoint {
  date: string;
  label: string;
  views: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [seoStats, setSeoStats] = useState<SeoStats | null>(null);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [productsRes, ordersRes, seoRes, trendRes] = await Promise.allSettled([
          api.get<PaginatedResponse<RecentProduct>>("/products", { limit: 5, sort: "createdAt", order: "desc" }),
          api.get<PaginatedResponse<unknown>>("/orders", { limit: 1 }),
          api.get<SeoStats>("/analytics/seo-stats"),
          api.get<TrendPoint[]>("/analytics/weekly-trend", { days: 7 }),
        ]);

        const products = productsRes.status === "fulfilled" ? productsRes.value.data : [];
        const totalProducts = productsRes.status === "fulfilled" ? (productsRes.value.meta?.total ?? 0) : 0;
        const activeOrders = ordersRes.status === "fulfilled" ? (ordersRes.value.meta?.total ?? 0) : 0;
        const failedCount = [productsRes, ordersRes, seoRes, trendRes].filter(
          (r) => r.status === "rejected"
        ).length;

        if (failedCount > 0) setHasErrors(true);
        if (failedCount === 4) {
          setHasErrors(true);
          return;
        }

        setRecentProducts(products.slice(0, 5));
        setStats({
          totalProducts,
          activeOrders,
          totalCustomers: 0,
          lowStockCount: 0,
          revenue: 0,
        });
        if (seoRes.status === "fulfilled") setSeoStats(seoRes.value);
        if (trendRes.status === "fulfilled") setTrendData(trendRes.value);
      } catch (err) {
        setStats(null);
        setHasErrors(true);
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Products", value: stats.totalProducts.toLocaleString(), icon: Package, color: "text-brand", bg: "bg-brand/5", href: "/products" },
        { label: "Active Orders", value: stats.activeOrders.toLocaleString(), icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50", href: "/orders" },
        { label: "Customers", value: stats.totalCustomers.toLocaleString(), icon: Users, color: "text-violet-600", bg: "bg-violet-50", href: "/customers" },
        { label: "Low Stock Items", value: stats.lowStockCount.toLocaleString(), icon: AlertTriangle, color: stats.lowStockCount > 0 ? "text-amber-600" : "text-ink-3", bg: stats.lowStockCount > 0 ? "bg-amber-50" : "bg-bg2", href: "/inventory" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink lg:text-2xl" style={{ letterSpacing: "-0.01em" }}>
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-ink-2">Overview of your store</p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>

      {/* Error banner */}
      {hasErrors && (
        <div className="flex items-center gap-2 rounded-xl border border-sale/20 bg-sale/5 px-4 py-3 text-sm text-sale">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
          <span>Some dashboard data failed to load. Showing partial results.</span>
        </div>
      )}

      {/* Stat cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-bg2" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href}>
                <Card className="transition-shadow hover:shadow-card">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-ink-2">{stat.label}</p>
                        <p className="mt-1.5 text-2xl font-semibold text-ink">{stat.value}</p>
                      </div>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} strokeWidth={1.75} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* SEO + Trending section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* SEO Coverage Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-ink-2">SEO Coverage</p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {seoStats ? `${seoStats.coverage}%` : "—"}
                </p>
                <p className="mt-0.5 text-xs text-ink-3">
                  {seoStats ? `${seoStats.optimizedCount}/${seoStats.totalProducts} products` : "\u2014"}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
                <Search className="h-5 w-5 text-brand" strokeWidth={1.75} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stale SEO Card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-ink-2">Stale SEO</p>
                <p className={`mt-1 text-2xl font-semibold ${(seoStats?.staleCount ?? 0) > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {seoStats?.staleCount ?? "—"}
                </p>
                <p className="mt-0.5 text-xs text-ink-3">
                  {seoStats && seoStats.staleCount > 0 ? "Needs regeneration" : "Up to date"}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-600" strokeWidth={1.75} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Trend Mini Chart */}
        <Card className="sm:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-ink-2">Page Views (7 Days)</p>
              <Link href="/analytics" className="text-xs font-semibold text-brand hover:underline">
                View Analytics
              </Link>
            </div>
            {trendData.length > 0 ? (
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="label" hide />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, padding: "4px 8px" }}
                      formatter={(value: number) => [value.toLocaleString(), "Views"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#134A7C"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: "#134A7C" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-16 items-center justify-center">
                <p className="text-xs text-ink-3">No data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Products + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Products */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
              <CardTitle className="text-sm font-semibold text-ink">Recent Products</CardTitle>
              <Link href="/products" className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                View all <ArrowRight className="h-3 w-3" strokeWidth={2} />
              </Link>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {loading ? (
                <div className="space-y-3 px-5 pb-5">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-bg2" />)}
                </div>
              ) : recentProducts.length === 0 ? (
                <div className="px-5 pb-6 text-center">
                  <Package className="mx-auto h-8 w-8 text-ink-3" strokeWidth={1.5} />
                  <p className="mt-2 text-sm font-medium text-ink-2">No products yet</p>
                  <p className="mt-0.5 text-xs text-ink-3">Create your first product to get started.</p>
                  <Link href="/products/new" className="mt-3 inline-flex h-9 items-center gap-1 rounded-lg bg-brand px-4 text-xs font-semibold text-white hover:bg-brand-dark">
                    <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add Product
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {recentProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-bg2">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg2">
                        {product.images?.[0] ? (
                          <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-4 w-4 text-ink-3" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                        <p className="truncate text-xs text-ink-2">
                          {product.brand?.name ?? "No brand"} · AED {Number(product.price).toLocaleString()}
                        </p>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        In stock
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold text-ink">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-2">
                {[
                  { label: "Add Product", href: "/products/new", icon: Plus, desc: "List a new item" },
                  { label: "View Analytics", href: "/analytics", icon: BarChart3, desc: "Track visitors and engagement" },
                  { label: "SEO Reports", href: "/seo", icon: Search, desc: "Check SEO performance" },
                  { label: "Check Inventory", href: "/inventory", icon: Eye, desc: "Monitor stock levels" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.label} href={action.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-bg2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/5">
                        <Icon className="h-4 w-4 text-brand" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{action.label}</p>
                        <p className="text-xs text-ink-2">{action.desc}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-ink-3" strokeWidth={2} />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
