"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

interface PageMeta {
  path: string;
  title: string;
  currentTitle: string;
  currentDesc: string;
  saved: boolean;
}

const initialPages: PageMeta[] = [
  { path: "/", title: "Home", currentTitle: "TradeHub UAE — Best Online Marketplace", currentDesc: "Shop the best deals on electronics, fashion, and more in UAE.", saved: false },
  { path: "/products", title: "Products", currentTitle: "All Products — TradeHub UAE", currentDesc: "Browse our wide selection of products at competitive prices.", saved: false },
  { path: "/categories", title: "Categories", currentTitle: "Shop by Category — TradeHub UAE", currentDesc: "Find what you need by browsing our product categories.", saved: false },
  { path: "/about", title: "About Us", currentTitle: "About TradeHub UAE", currentDesc: "Learn about our mission, values, and team.", saved: false },
];

export default function MetaPage() {
  const [meta, setMeta] = useState<PageMeta[]>(initialPages);

  const updateField = (idx: number, field: keyof PageMeta, value: string) => {
    const updated = meta.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    setMeta(updated);
  };

  const handleSave = (idx: number) => {
    const updated = meta.map((p, i) => i === idx ? { ...p, saved: true } : p);
    setMeta(updated);
    setTimeout(() => {
      setMeta((prev) => prev.map((p, i) => i === idx ? { ...p, saved: false } : p));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Page Meta</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Edit title tags and meta descriptions for every page</p>
      </div>
      {meta.map((page, idx) => (
        <Card key={page.path}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <FileText className="h-4 w-4 text-brand" strokeWidth={1.75} />
              {page.title}
              <span className="text-xs font-normal text-ink-3">{page.path}</span>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-2">Title Tag</label>
                <input
                  value={page.currentTitle}
                  onChange={(e) => updateField(idx, "currentTitle", e.target.value)}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-2">Meta Description</label>
                <textarea
                  value={page.currentDesc}
                  onChange={(e) => updateField(idx, "currentDesc", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-ink-3">{page.currentDesc.length}/160 characters</p>
              <Button size="sm" onClick={() => handleSave(idx)}>
                {page.saved ? "Saved!" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
