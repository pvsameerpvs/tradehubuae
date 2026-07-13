"use client";

import { useState } from "react";
import { Globe, RefreshCw, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

const sitemapUrls = [
  { path: "/", priority: "1.0", freq: "daily" },
  { path: "/products", priority: "0.9", freq: "daily" },
  { path: "/categories", priority: "0.8", freq: "weekly" },
  { path: "/about", priority: "0.5", freq: "monthly" },
  { path: "/contact", priority: "0.5", freq: "monthly" },
  { path: "/blog", priority: "0.7", freq: "weekly" },
];

export default function SitemapPage() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    // simulate generation
    await new Promise((r) => setTimeout(r, 1500));
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Sitemap</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Generate and manage XML sitemaps for search engines</p>
      </div>
      <Card>
        <CardHeader className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <CardTitle className="text-sm font-semibold text-ink">Sitemap URLs</CardTitle>
            </div>
            <Button size="sm" onClick={handleGenerate} disabled={generating}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} strokeWidth={1.75} />
              {generating ? "Generating..." : generated ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="divide-y divide-line sm:hidden">
            {sitemapUrls.map((u) => (
              <div key={u.path} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{u.path}</p>
                  <p className="text-xs text-ink-3 capitalize">{u.freq}</p>
                </div>
                <span className="text-sm text-ink-2">p. {u.priority}</span>
              </div>
            ))}
          </div>
          <table className="hidden sm:table w-full">
            <thead>
              <tr className="border-t border-line text-left text-xs text-ink-3 uppercase tracking-wider">
                <th className="p-4 font-medium">Page</th>
                <th className="p-4 font-medium">Priority</th>
                <th className="p-4 font-medium">Change Frequency</th>
              </tr>
            </thead>
            <tbody>
              {sitemapUrls.map((u) => (
                <tr key={u.path} className="border-t border-line">
                  <td className="p-4 text-sm text-ink">{u.path}</td>
                  <td className="p-4 text-sm text-ink-2">{u.priority}</td>
                  <td className="p-4 text-sm text-ink-2 capitalize">{u.freq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {generated && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
          Sitemap generated successfully. Submit it to Google Search Console.
        </div>
      )}
    </div>
  );
}
