"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@tradehubuae/ui";
import { ImageUpload } from "@/components/ImageUpload";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  category: string | null;
  readTime: string | null;
  published: boolean;
  authorId: string | null;
}

export function BlogForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    category: "",
    readTime: "",
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/blog");
      router.refresh();
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Title *</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Slug</label>
        <input
          value={form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
          disabled
          className="w-full rounded-lg border border-line bg-bg2 px-3 py-2 text-sm text-ink-2"
        />
      </div>
      <ImageUpload
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })}
        label="Featured Image"
        folder="blog"
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Content *</label>
        <textarea
          required
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={12}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Excerpt</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">Select category...</option>
            <option value="Buying Guide">Buying Guide</option>
            <option value="Gaming">Gaming</option>
            <option value="Networking">Networking</option>
            <option value="Industry Insights">Industry Insights</option>
            <option value="Guides">Guides</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Read Time</label>
          <input
            value={form.readTime}
            onChange={(e) => setForm({ ...form, readTime: e.target.value })}
            placeholder="e.g. 5 min read"
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
          className="rounded border-line"
        />
        <label htmlFor="published" className="text-sm font-medium text-ink">Published</label>
      </div>
      <div className="flex gap-4 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : id ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/blog")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
