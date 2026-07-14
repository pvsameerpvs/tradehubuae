"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, FileText, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface SeoEntry {
  id: string;
  entityType: string;
  entityId: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  updatedAt: string;
}

interface PageMeta {
  path: string;
  label: string;
  entityType: string;
  entityId: string;
  title: string;
  description: string;
  saved: boolean;
  saving: boolean;
}

const defaultPages: Omit<PageMeta, "title" | "description" | "saved" | "saving">[] = [
  { path: "/", label: "Home", entityType: "page", entityId: "home" },
  { path: "/products", label: "Products", entityType: "page", entityId: "products" },
  { path: "/categories", label: "Categories", entityType: "page", entityId: "categories" },
  { path: "/about", label: "About Us", entityType: "page", entityId: "about" },
  { path: "/contact", label: "Contact", entityType: "page", entityId: "contact" },
  { path: "/blog", label: "Blog", entityType: "page", entityId: "blog" },
];

export default function MetaPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadSeo() {
      try {
        const entries = await api.get<SeoEntry[]>("/seo");
        setPages(
          defaultPages.map((p) => {
            const existing = entries.find((e) => e.entityType === p.entityType && e.entityId === p.entityId);
            return {
              ...p,
              title: existing?.title ?? `TradeHub UAE — ${p.label}`,
              description: existing?.description ?? `Browse ${p.label.toLowerCase()} at TradeHub UAE.`,
              saved: false,
              saving: false,
            };
          })
        );
      } catch {
        setPages(
          defaultPages.map((p) => ({
            ...p,
            title: `TradeHub UAE — ${p.label}`,
            description: `Browse ${p.label.toLowerCase()} at TradeHub UAE.`,
            saved: false,
            saving: false,
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    loadSeo();
  }, []);

  const updateField = (idx: number, field: "title" | "description", value: string) => {
    setPages((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleSave = async (idx: number) => {
    const page = pages[idx];
    if (!page) return;
    setPages((prev) => prev.map((p, i) => i === idx ? { ...p, saving: true } : p));
    setMessage(null);

    try {
      await api.post("/seo", {
        entityType: page.entityType,
        entityId: page.entityId,
        title: page.title,
        description: page.description,
      });
      setPages((prev) => prev.map((p, i) => i === idx ? { ...p, saved: true, saving: false } : p));
      setTimeout(() => {
        setPages((prev) => prev.map((p, i) => i === idx ? { ...p, saved: false } : p));
      }, 2000);
      setMessage({ type: "success", text: "SEO metadata saved!" });
    } catch {
      setPages((prev) => prev.map((p, i) => i === idx ? { ...p, saving: false } : p));
      setMessage({ type: "error", text: "Failed to save. Check API connection." });
    }
  };

  const handleGenerateAll = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      const result = await api.post<{ success: number; errors: number; total: number }>("/seo/generate", {});
      setMessage({ type: "success", text: `SEO generated for ${result.success}/${result.total} pages.` });
      // Reload
      const entries = await api.get<SeoEntry[]>("/seo");
      setPages((prev) =>
        prev.map((p) => {
          const existing = entries.find((e) => e.entityType === p.entityType && e.entityId === p.entityId);
          return existing ? { ...p, title: existing.title ?? p.title, description: existing.description ?? p.description } : p;
        })
      );
    } catch {
      setMessage({ type: "error", text: "Generation failed. Check Gemini API key." });
    } finally {
      setGenerating(false);
    }
  };

  const getTitleHint = (title: string) => {
    const len = title.length;
    if (len > 60) return { color: "text-sale", text: `${len}/60 chars (too long)` };
    if (len > 50) return { color: "text-amber-600", text: `${len}/60 chars` };
    return { color: "text-emerald-600", text: `${len}/60 chars` };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-bg2" />
        {[...Array(4)].map((_, i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-bg2" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-bg3 transition-colors">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Page Meta</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Edit title tags and meta descriptions for every page</p>
        </div>
        </div>
        <Button size="sm" onClick={handleGenerateAll} disabled={generating}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} strokeWidth={1.75} />
          {generating ? "Generating..." : "Generate All with AI"}
        </Button>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-lg p-4 text-sm font-medium ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        }`}>
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <AlertCircle className="h-4 w-4" strokeWidth={1.75} />
          )}
          {message.text}
        </div>
      )}

      {pages.map((page, idx) => (
        <Card key={page.path}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <FileText className="h-4 w-4 text-brand" strokeWidth={1.75} />
              {page.label}
              <span className="text-xs font-normal text-ink-3">{page.path}</span>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-2">Title Tag</label>
                <input
                  value={page.title}
                  onChange={(e) => updateField(idx, "title", e.target.value)}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <p className={`mt-0.5 text-[11px] ${getTitleHint(page.title).color}`}>
                  {getTitleHint(page.title).text}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-2">Meta Description</label>
                <textarea
                  value={page.description}
                  onChange={(e) => updateField(idx, "description", e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <p className={`mt-0.5 text-[11px] ${page.description.length > 160 ? "text-sale" : "text-ink-3"}`}>
                  {page.description.length}/160 characters
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-ink-3">Last updated: {page.saved ? "just now" : "—"}</p>
              <Button size="sm" onClick={() => handleSave(idx)} disabled={page.saving}>
                {page.saving ? "Saving..." : page.saved ? "Saved!" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
