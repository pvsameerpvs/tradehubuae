"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, type PaginatedResponse } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@tradehubuae/ui";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  parent: { id: string; name: string } | null;
}

export default function CategoryForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    image: "",
    parentId: "",
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    api.get<PaginatedResponse<Category>>("/categories", { limit: 200, sort: "name", order: "asc" })
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api.get<Category>(`/categories/${id}`)
      .then((cat) => setForm({
        name: cat.name,
        image: cat.image ?? "",
        parentId: cat.parent?.id ?? "",
        sortOrder: cat.sortOrder ?? 0,
        isActive: cat.isActive ?? true,
      }))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, parentId: form.parentId || undefined, image: form.image || undefined };
      if (id) {
        await api.put(`/categories/${id}`, payload);
      } else {
        await api.post("/categories", payload);
      }
      router.push("/categories");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-sm text-ink-2">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Name *</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Slug</label>
        <input
          value={form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
          disabled
          className="w-full rounded-lg border border-line bg-bg2 px-3 py-2 text-sm text-ink-2"
        />
      </div>
      <ImageUpload
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })}
        label="Category Image"
        folder="categories"
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Parent Category</label>
        <select
          value={form.parentId}
          onChange={(e) => setForm({ ...form, parentId: e.target.value })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <option value="">None (Root)</option>
          {categories.filter((c) => c.id !== id).map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Sort Order</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded border-line"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-ink">Active</label>
        </div>
      </div>
      <div className="flex gap-4 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : id ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/categories")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
