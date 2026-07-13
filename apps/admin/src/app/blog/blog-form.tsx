"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@tradehubuae/ui";
import ImageUpload from "@/components/ImageUpload";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  tags: string[];
  published: boolean;
  authorId: string | null;
}

export default function BlogForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    tags: "",
    published: false,
  });

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api.get<BlogPost>(`/blog/${id}`)
      .then((post) => setForm({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt ?? "",
        image: post.image ?? "",
        tags: (post.tags ?? []).join(", "),
        published: post.published,
      }))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        image: form.image || undefined,
        excerpt: form.excerpt || undefined,
      };
      if (id) {
        await api.put(`/blog/${id}`, payload);
      } else {
        await api.post("/blog", payload);
      }
      router.push("/blog");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-sm text-ink-2">Loading...</p>;

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
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Tags (comma-separated)</label>
        <input
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="e.g. electronics, reviews, news"
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
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
