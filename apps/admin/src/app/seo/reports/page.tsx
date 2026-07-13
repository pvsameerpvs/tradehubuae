"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, Search, Package, AlertTriangle, Eye,
  RefreshCw, BarChart3, Target, CheckCircle2, Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { api } from "@/lib/api";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

interface SeoStatEntry {
  id: string;
  entityType: string;
  entityId: string;
  title: string | null;
  description: string | null;
  updatedAt: string;
}

interface OverviewData {
  visitors: number;
  pageViews: number;
  productViews: number;
  totalProducts: number;
  trend: { date: string; views: number }[];
}

interface SeoStats {
  total: number;
  stale: number;
  products: number;
}

interface TopProduct {
  rank: number;
  name: string;
  views: number;
  sales: number;
  rating: number;
  avgTimeOnPage: string;
}

const COLORS = ["#134A7C", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const charData = [
  { subject: "Title", score: 85, fullMark: 100 },
  { subject: "Description", score: 72, fullMark: 100 },
  { subject: "Keywords", score: 60, fullMark: 100 },
  { subject: "OG Tags", score: 45, fullMark: 100 },
  { subject: "Schema", score: 30, fullMark: 100 },
  { subject: "Length", score: 90, fullMark: 100 },
];

export default function SeoReportsPage() {
  const [loading, setLoading] = useState(true);
  const [seoEntries, setSeoEntries] = useState<SeoStatEntry[]>([]);
  const [seoStats, setSeoStats] = useState<SeoStats | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [seoRes, statsRes, overviewRes, productsRes] = await Promise.allSettled([
        api.get<SeoStatEntry[]>("/seo"),
        api.get<SeoStats>("/analytics/seo-stats"),
        api.get<OverviewData>("/analytics/overview", { range: "30d" }),
        api.get<TopProduct[]>("/analytics/top-products", { range: "30d", limit: 10 }),
      ]);

      if (seoRes.status === "fulfilled") setSeoEntries(seoRes.value);
      if (statsRes.status === "fulfilled") setSeoStats(statsRes.value);
      if (overviewRes.status === "fulfilled") setOverview(overviewRes.value);
      if (productsRes.status === "fulfilled") setTopProducts(productsRes.value);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const handleGenerateSeo = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      const result = await api.post<{ success: number; errors: number; total: number }>("/seo/generate", {});
      setMessage({ type: "success", text: `AI generated SEO for ${result.success}/${result.total} products.` });
      loadData();
    } catch {
      setMessage({ type: "error", text: "Generation failed. Check Gemini API key." });
    } finally {
      setGenerating(false);
    }
  };

  const trendData = overview?.trend ?? [];
  const stalePct = seoStats && seoStats.total > 0 ? Math.round((seoStats.stale / seoStats.total) * 100) : 0;
  const healthyPct = seoStats && seoStats.total > 0 ? Math.round(((seoStats.total - seoStats.stale) / seoStats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-bg2" />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {[...Array(2)].map((_, i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-bg2" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>SEO Reports</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">SEO performance, coverage analysis, and AI generation results</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-ink-2 hover:bg-bg3 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} /> Refresh
          </button>
          <button
            onClick={handleGenerateSeo}
            disabled={generating}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} strokeWidth={1.75} />
            {generating ? "Generating..." : "Run AI SEO"}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-2 rounded-lg p-4 text-sm font-medium ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} /> : <AlertTriangle className="h-4 w-4" strokeWidth={1.75} />}
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-ink-2">SEO Entries</p>
                <p className="mt-1 text-2xl font-semibold text-ink">{seoStats?.total ?? 0}</p>
                <p className="mt-0.5 text-xs text-ink-3">{seoStats?.products ?? 0} products</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
                <Search className="h-5 w-5 text-brand" strokeWidth={1.75} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-ink-2">SEO Health</p>
                <p className={`mt-1 text-2xl font-semibold ${healthyPct >= 70 ? "text-emerald-600" : healthyPct >= 40 ? "text-amber-600" : "text-sale"}`}>
                  {healthyPct}%
                </p>
                <p className="mt-0.5 text-xs text-ink-3">{seoStats ? seoStats.total - seoStats.stale : 0} healthy entries</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" strokeWidth={1.75} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-ink-2">Stale SEO</p>
                <p className={`mt-1 text-2xl font-semibold ${seoStats && seoStats.stale > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {seoStats?.stale ?? 0}
                </p>
                <p className="mt-0.5 text-xs text-ink-3">{stalePct}% of entries need refresh</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" strokeWidth={1.75} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-ink-2">Page Views</p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {overview ? (overview.pageViews + overview.productViews).toLocaleString() : "—"}
                </p>
                <p className="mt-0.5 text-xs text-ink-3">30 day total</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
                <Eye className="h-5 w-5 text-brand" strokeWidth={1.75} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Page Views Trend */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <CardTitle className="text-sm font-semibold text-ink">Page Views (30 days)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="seoViewGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#134A7C" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#134A7C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke="#134A7C" strokeWidth={2} fill="url(#seoViewGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* SEO Quality Radar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <CardTitle className="text-sm font-semibold text-ink">SEO Quality Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={charData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#475569" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <Radar dataKey="score" stroke="#134A7C" fill="#134A7C" fillOpacity={0.1} strokeWidth={2} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <CardTitle className="text-sm font-semibold text-ink">Top Products by Views</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts.slice(0, 7)} layout="vertical" margin={{ left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category" dataKey="name"
                    tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false}
                    width={140}
                    tickFormatter={(v) => v.length > 20 ? v.slice(0, 20) + "..." : v}
                  />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} formatter={(v: number) => [v.toLocaleString(), "Views"]} />
                  <Bar dataKey="views" fill="#134A7C" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* SEO Entries Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <CardTitle className="text-sm font-semibold text-ink">Recent SEO Entries</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {seoEntries.length > 0 ? (
              <div className="divide-y divide-line">
                {seoEntries.slice(0, 8).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">{entry.title ?? entry.entityId}</p>
                      <p className="text-xs text-ink-3 capitalize">{entry.entityType} · {entry.entityId}</p>
                    </div>
                    <span className="text-[11px] text-ink-3">
                      {new Date(entry.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-ink-3">No SEO entries yet. Run AI generation to populate.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
