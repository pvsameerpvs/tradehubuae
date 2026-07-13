"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Users, Eye, Search, MousePointerClick,
  Smartphone, Monitor, ChevronDown, ExternalLink, ShoppingCart,
  DollarSign, Target, ScrollText, ArrowUpDown
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";

type Range = "7d" | "30d" | "90d";

interface StatCard {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ElementType;
}

interface ProductView {
  id: string;
  name: string;
  views: number;
  uniqueViews: number;
  avgTimeOnPage: string;
}

interface SearchTerm {
  term: string;
  searches: number;
  results: number;
  clickRate: string;
}

interface AdCampaign {
  name: string;
  platform: "meta" | "google";
  spend: string;
  impressions: string;
  clicks: number;
  ctr: string;
  conversions: number;
  roas: string;
}

const overviewStats: Record<Range, StatCard[]> = {
  "7d": [
    { label: "Real Visitors", value: "12,847", change: "+18.2%", up: true, icon: Users },
    { label: "Page Views", value: "48,231", change: "+22.5%", up: true, icon: Eye },
    { label: "Avg Scroll Depth", value: "64%", change: "+4.1%", up: true, icon: ScrollText },
    { label: "Bounce Rate", value: "32.4%", change: "-3.2%", up: false, icon: TrendingUp },
  ],
  "30d": [
    { label: "Real Visitors", value: "48,902", change: "+24.6%", up: true, icon: Users },
    { label: "Page Views", value: "186,445", change: "+28.1%", up: true, icon: Eye },
    { label: "Avg Scroll Depth", value: "61%", change: "+2.8%", up: true, icon: ScrollText },
    { label: "Bounce Rate", value: "34.1%", change: "-2.1%", up: false, icon: TrendingUp },
  ],
  "90d": [
    { label: "Real Visitors", value: "142,376", change: "+31.2%", up: true, icon: Users },
    { label: "Page Views", value: "523,890", change: "+35.7%", up: true, icon: Eye },
    { label: "Avg Scroll Depth", value: "59%", change: "+1.5%", up: true, icon: ScrollText },
    { label: "Bounce Rate", value: "35.8%", change: "-1.8%", up: false, icon: TrendingUp },
  ],
};

const topProducts: ProductView[] = [
  { id: "1", name: "iPhone 15 Pro Max 256GB", views: 3421, uniqueViews: 2847, avgTimeOnPage: "2m 34s" },
  { id: "2", name: "Samsung Galaxy S24 Ultra", views: 2890, uniqueViews: 2341, avgTimeOnPage: "1m 58s" },
  { id: "3", name: "MacBook Air M3 15-inch", views: 2156, uniqueViews: 1834, avgTimeOnPage: "3m 12s" },
  { id: "4", name: "Sony WH-1000XM5 Headphones", views: 1876, uniqueViews: 1543, avgTimeOnPage: "2m 01s" },
  { id: "5", name: "Apple Watch Series 9", views: 1543, uniqueViews: 1287, avgTimeOnPage: "1m 45s" },
];

const topSearches: SearchTerm[] = [
  { term: "iphone 15 pro max", searches: 892, results: 12, clickRate: "34.2%" },
  { term: "samsung s24 ultra", searches: 654, results: 8, clickRate: "28.7%" },
  { term: "laptop under 5000 aed", searches: 521, results: 24, clickRate: "41.3%" },
  { term: "airpods pro 2", searches: 487, results: 6, clickRate: "38.9%" },
  { term: "smartwatch men", searches: 412, results: 18, clickRate: "31.5%" },
];

const adsCampaigns: AdCampaign[] = [
  { name: "Summer Sale 2025", platform: "meta", spend: "$2,450", impressions: "142K", clicks: 3841, ctr: "2.7%", conversions: 127, roas: "4.2x" },
  { name: "New Arrivals", platform: "meta", spend: "$1,820", impressions: "98K", clicks: 2612, ctr: "2.66%", conversions: 89, roas: "3.8x" },
  { name: "Brand Awareness Q3", platform: "meta", spend: "$3,100", impressions: "215K", clicks: 5120, ctr: "2.38%", conversions: 156, roas: "3.5x" },
  { name: "Shopping Campaign - Electronics", platform: "google", spend: "$2,890", impressions: "178K", clicks: 4231, ctr: "2.37%", conversions: 143, roas: "4.5x" },
  { name: "Search - Premium Phones", platform: "google", spend: "$1,650", impressions: "67K", clicks: 2894, ctr: "4.32%", conversions: 98, roas: "5.1x" },
  { name: "Display - Accessories", platform: "google", spend: "$980", impressions: "124K", clicks: 1456, ctr: "1.17%", conversions: 42, roas: "2.8x" },
];

const deviceData = [
  { label: "Mobile", pct: 68, color: "bg-brand" },
  { label: "Desktop", pct: 24, color: "bg-emerald-500" },
  { label: "Tablet", pct: 8, color: "bg-amber-500" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30d");
  const [adsTab, setAdsTab] = useState<"all" | "meta" | "google">("all");

  const stats = overviewStats[range];
  const filteredAds = adsTab === "all" ? adsCampaigns : adsCampaigns.filter((c) => c.platform === adsTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Analytics</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Track visitors, engagement, ads, and product performance</p>
        </div>
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-ink-2">{s.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-ink">{s.value}</p>
                    <p className={`mt-1 inline-flex items-center gap-0.5 text-xs font-medium ${s.up ? "text-emerald-600" : "text-sale"}`}>
                      <TrendingUp className={`h-3 w-3 ${!s.up && "rotate-180"}`} strokeWidth={1.75} />
                      {s.change}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg2">
                    <Icon className="h-5 w-5 text-ink" strokeWidth={1.75} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <CardTitle className="text-sm font-semibold text-ink">Most Viewed Products</CardTitle>
            </div>
            <button className="text-xs font-semibold text-brand hover:underline">View All</button>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between border-b border-line pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-xs font-semibold text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-ink-3">{p.uniqueViews.toLocaleString()} unique views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink">{p.views.toLocaleString()}</p>
                    <p className="text-[10px] text-ink-3">{p.avgTimeOnPage}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <CardTitle className="text-sm font-semibold text-ink">Top Search Terms</CardTitle>
            </div>
            <button className="text-xs font-semibold text-brand hover:underline">View All</button>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              {topSearches.map((s, i) => (
                <div key={s.term} className="flex items-center justify-between border-b border-line pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-xs font-semibold text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-sm font-medium text-ink">{s.term}</p>
                      <p className="text-xs text-ink-3">{s.results} results · {s.clickRate} click rate</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-ink">{s.searches.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <CardTitle className="text-sm font-semibold text-ink">Ad Campaigns</CardTitle>
            </div>
            <div className="flex gap-1 rounded-lg border border-line bg-white p-0.5">
              {(["all", "meta", "google"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setAdsTab(t)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                    adsTab === t ? "bg-brand text-white" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {t === "meta" ? "Meta Ads" : t === "google" ? "Google Ads" : "All"}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="divide-y divide-line sm:hidden">
            {filteredAds.map((c, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">{c.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    c.platform === "meta" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
                  }`}>
                    {c.platform === "meta" ? "Meta" : "Google"}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                  <div><span className="text-ink-3">Spend</span><p className="font-semibold text-ink">{c.spend}</p></div>
                  <div><span className="text-ink-3">Impr.</span><p className="text-ink">{c.impressions}</p></div>
                  <div><span className="text-ink-3">Clicks</span><p className="text-ink">{c.clicks}</p></div>
                  <div><span className="text-ink-3">Conv.</span><p className="font-semibold text-ink">{c.conversions}</p></div>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <span className="text-ink-3">CTR: {c.ctr}</span>
                  <span className="font-semibold text-emerald-600">ROAS: {c.roas}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-t border-line text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Campaign</th>
                  <th className="p-4 font-medium">Platform</th>
                  <th className="p-4 font-medium text-right">Spend</th>
                  <th className="p-4 font-medium text-right">Impressions</th>
                  <th className="p-4 font-medium text-right">Clicks</th>
                  <th className="p-4 font-medium text-right">CTR</th>
                  <th className="p-4 font-medium text-right">Conversions</th>
                  <th className="p-4 font-medium text-right">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((c, i) => (
                  <tr key={i} className="border-t border-line transition-colors hover:bg-bg2">
                    <td className="p-4 text-sm font-medium text-ink">{c.name}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.platform === "meta" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
                      }`}>
                        {c.platform === "meta" ? "Meta" : "Google"}
                      </span>
                    </td>
                    <td className="p-4 text-right text-sm text-ink">{c.spend}</td>
                    <td className="p-4 text-right text-sm text-ink">{c.impressions}</td>
                    <td className="p-4 text-right text-sm text-ink">{c.clicks.toLocaleString()}</td>
                    <td className="p-4 text-right text-sm text-ink-2">{c.ctr}</td>
                    <td className="p-4 text-right text-sm font-semibold text-ink">{c.conversions}</td>
                    <td className="p-4 text-right text-sm font-semibold text-emerald-600">{c.roas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-5 py-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <CardTitle className="text-sm font-semibold text-ink">Device Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="flex h-10 overflow-hidden rounded-lg bg-bg2">
            {deviceData.map((d) => (
              <div
                key={d.label}
                className={`${d.color} flex items-center justify-center text-xs font-semibold text-white transition-all`}
                style={{ width: `${d.pct}%` }}
              >
                <span className="hidden sm:inline">{d.label} {d.pct}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {deviceData.map((d) => (
              <div key={d.label} className="text-center">
                <p className="text-lg font-semibold text-ink">{d.pct}%</p>
                <p className="text-xs text-ink-2">{d.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
