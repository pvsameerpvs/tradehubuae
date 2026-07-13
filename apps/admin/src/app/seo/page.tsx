"use client";

import { Search, FileText, Globe, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import Link from "next/link";

const seoTools = [
  {
    title: "Page Meta",
    desc: "Edit title tags and meta descriptions for every page",
    icon: FileText,
    href: "/seo/meta",
    color: "text-brand",
    bg: "bg-brand/5",
  },
  {
    title: "Sitemap",
    desc: "Generate and manage XML sitemaps for search engines",
    icon: Globe,
    href: "/seo/sitemap",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Redirects",
    desc: "Manage 301 redirects and fix broken links",
    icon: Search,
    href: "/seo/redirects",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "Analytics",
    desc: "View search performance and keyword rankings",
    icon: BarChart3,
    href: "/analytics",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function SEOPage() {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>SEO</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Optimize your store for search engines</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {seoTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="transition-shadow hover:shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tool.bg}`}>
                      <Icon className={`h-5 w-5 ${tool.color}`} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{tool.title}</p>
                      <p className="mt-0.5 text-xs text-ink-2">{tool.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
