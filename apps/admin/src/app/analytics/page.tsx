"use client";

import { useState, useEffect } from "react";
import {
  Users, Eye, TrendingUp, ScrollText, Package, ShoppingCart,
  Smartphone, Monitor, Search, BarChart3, RefreshCw, AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { api } from "@/lib/api";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

type Range = "7d" | "30d" | "90d";

interface OverviewData {
  visitors: number;
  pageViews: number;
  productViews: number;
  totalSales: number;
  totalProducts: number;
  activeOrders: number;
  trend: { date: string; views: number }[];
}

interface TopProduct {
  rank: number;
  id?: string;
  name: string;
  views: number;
  sales: number;
  rating: number;
  price: number;
  avgTimeOnPage: string;
}

interface SearchTerm {
  term: string;
  searches: number;
  results: number;
  clickRate: string;
}

interface DeviceData {
  mobile: number;
  desktop: number;
  tablet: number;
}

interface SeoStats {
  optimizedCount: number;
  totalProducts: number;
  coverage: number;
  staleCount: number;
  lastRun: string;
}

const COLORS = ["#134A7C", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

function StatCard({ label, value, icon: Icon, sub, trend }: {
  label: string; value: string; icon: React.ElementType; sub?: string; trend?: { up: boolean; text: string };
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs text-ink-2 truncate">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
            {trend && (
              <p className={`mt-1 inline-flex items-center gap-0.5 text-xs font-medium ${trend.up ? "text-emerald-600" : "text-sale"}`}>
                <TrendingUp className={`h-3 w-3 ${!trend.up && "rotate-180"}`} strokeWidth={1.75} />
                {trend.text}
              </p>
            )}
            {sub && <p className="mt-0.5 text-xs text-ink-3">{sub}</p>}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg2">
            <Icon className="h-5 w-5 text-ink" strokeWidth={1.75} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30d");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([]);
  const [devices, setDevices] = useState<DeviceData | null>(null);
  const [seoStats, setSeoStats] = useState<SeoStats | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [overviewRes, productsRes, searchRes, devicesRes, seoRes] = await Promise.allSettled([
        api.get<OverviewData>("/analytics/overview", { range }),
        api.get<TopProduct[]>("/analytics/top-products", { range, limit: 10 }),
        api.get<SearchTerm[]>("/analytics/search-terms", { range, limit: 10 }),
        api.get<DeviceData>("/analytics/devices", { range }),
        api.get<SeoStats>("/analytics/seo-stats"),
      ]);

      if (overviewRes.status === "fulfilled") setOverview(overviewRes.value);
      if (productsRes.status === "fulfilled") setTopProducts(productsRes.value);
      if (searchRes.status === "fulfilled") setSearchTerms(searchRes.value);
      if (devicesRes.status === "fulfilled") setDevices(devicesRes.value);
      if (seoRes.status === "fulfilled") setSeoStats(seoRes.value);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [range]);

  const deviceChartData = devices
    ? [
      { name: "Mobile", value: devices.mobile, color: "#134A7C" },
      { name: "Desktop", value: devices.desktop, color: "#10B981" },
      { name: "Tablet", value: devices.tablet, color: "#F59E0B" },
    ]
    : [];

  const trendData = overview?.trend ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Analytics</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Track visitors, engagement, and product performance</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-ink-2 hover:bg-bg3 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Refresh
          </button>
          <div className="flex gap-1 rounded-lg border border-line bg-white p-0.5">
            {(["7d", "30d", "90d"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  range === r ? "bg-brand text-white" : "text-ink-2 hover:text-ink"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-bg2" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Page Views"
              value={(overview?.pageViews ?? 0).toLocaleString()}
              icon={Eye}
              trend={{ up: true, text: `${range.replace("d", " day ")} total` }}
            />
            <StatCard
              label="Product Views"
              value={(overview?.productViews ?? 0).toLocaleString()}
              icon={Package}
              sub={`${overview?.totalProducts ?? 0} active products`}
            />
            <StatCard
              label="Total Sales"
              value={(overview?.totalSales ?? 0).toLocaleString()}
              icon={ShoppingCart}
              trend={{ up: true, text: "All time" }}
            />
            <StatCard
              label="Active Orders"
              value={(overview?.activeOrders ?? 0).toLocaleString()}
              icon={BarChart3}
              trend={{ up: true, text: range.replace("d", " day ") }}
            />
            <StatCard
              label="SEO Coverage"
              value={seoStats ? `${seoStats.coverage}%` : "—"}
              icon={Search}
              sub={seoStats ? `${seoStats.optimizedCount}/${seoStats.totalProducts} products` : undefined}
            />
            <StatCard
              label="Stale SEO"
              value={seoStats ? `${seoStats.staleCount}` : "—"}
              icon={AlertTriangle}
              trend={{ up: false, text: "needs regeneration" }}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Page Views Trend */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Page Views Trend</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                {trendData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="viewGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#134A7C" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#134A7C" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
                        />
                        <Area type="monotone" dataKey="views" stroke="#134A7C" strokeWidth={2} fill="url(#viewGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <p className="text-sm text-ink-3">No page view data yet. Tracking starts once middleware is active.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Products Bar Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Most Viewed Products</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                {topProducts.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProducts.slice(0, 7)} layout="vertical" margin={{ left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fontSize: 10, fill: "#475569" }}
                          axisLine={false}
                          tickLine={false}
                          width={140}
                          tickFormatter={(v) => v.length > 20 ? v.slice(0, 20) + "..." : v}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
                          formatter={(value: number) => [value.toLocaleString(), "Views"]}
                        />
                        <Bar dataKey="views" fill="#134A7C" radius={[0, 4, 4, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <p className="text-sm text-ink-3">No product view data yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Device Breakdown</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="flex items-center gap-8">
                  <div className="h-48 w-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {deviceChartData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }}
                          formatter={(value: number) => [`${value}%`, "Share"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {deviceChartData.map((d) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-sm text-ink-2">{d.name}</span>
                        <span className="text-sm font-semibold text-ink">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Products Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Product Performance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="divide-y divide-line sm:hidden">
                  {topProducts.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                        <p className="text-xs text-ink-3">{p.views.toLocaleString()} views · {p.sales} sales</p>
                      </div>
                      <span className="text-xs font-semibold text-ink-2">AED {p.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="hidden sm:table w-full">
                    <thead>
                      <tr className="border-t border-line text-left text-xs text-ink-3 uppercase tracking-wider">
                        <th className="p-4 font-medium">Product</th>
                        <th className="p-4 font-medium text-right">Views</th>
                        <th className="p-4 font-medium text-right">Sales</th>
                        <th className="p-4 font-medium text-right">Rating</th>
                        <th className="p-4 font-medium text-right">Price</th>
                        <th className="p-4 font-medium text-right">Time on Page</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((p) => (
                        <tr key={p.id} className="border-t border-line transition-colors hover:bg-bg2">
                          <td className="p-4 text-sm font-medium text-ink">{p.name}</td>
                          <td className="p-4 text-right text-sm text-ink">{p.views.toLocaleString()}</td>
                          <td className="p-4 text-right text-sm text-ink">{p.sales}</td>
                          <td className="p-4 text-right text-sm text-ink-2">{p.rating > 0 ? p.rating.toFixed(1) : "—"}</td>
                          <td className="p-4 text-right text-sm text-ink">AED {p.price.toLocaleString()}</td>
                          <td className="p-4 text-right text-sm text-ink-2">{p.avgTimeOnPage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Terms */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Top Search Terms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {searchTerms.length > 0 ? (
                <>
                  <div className="divide-y divide-line sm:hidden">
                    {searchTerms.slice(0, 5).map((s) => (
                      <div key={s.term} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-medium text-ink">{s.term}</p>
                          <p className="text-xs text-ink-3">{s.results} results · {s.clickRate} click rate</p>
                        </div>
                        <p className="text-sm font-semibold text-ink">{s.searches.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="hidden sm:table w-full">
                      <thead>
                        <tr className="border-t border-line text-left text-xs text-ink-3 uppercase tracking-wider">
                          <th className="p-4 font-medium">Search Term</th>
                          <th className="p-4 font-medium text-right">Searches</th>
                          <th className="p-4 font-medium text-right">Results</th>
                          <th className="p-4 font-medium text-right">Click Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchTerms.map((s) => (
                          <tr key={s.term} className="border-t border-line transition-colors hover:bg-bg2">
                            <td className="p-4 text-sm font-medium text-ink">{s.term}</td>
                            <td className="p-4 text-right text-sm text-ink">{s.searches.toLocaleString()}</td>
                            <td className="p-4 text-right text-sm text-ink-2">{s.results}</td>
                            <td className="p-4 text-right text-sm text-ink-2">{s.clickRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-ink-3">No search data yet. Searches will appear once users start searching.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
