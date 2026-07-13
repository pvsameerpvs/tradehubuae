"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@tradehubuae/ui";

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function BrandForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api.get<Brand>(`/brands/${id}`)
      .then((brand) => setForm({
        name: brand.name,
        description: brand.description ?? "",
        logo: brand.logo ?? "",
        website: brand.website ?? "",
        sortOrder: brand.sortOrder,
        isActive: brand.isActive,
      }))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, logo: form.logo || undefined, website: form.website || undefined };
      if (id) {
        await api.put(`/brands/${id}`, payload);
      } else {
        await api.post("/brands", payload);
      }
      router.push("/brands");
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
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
      <ImageUpload
        value={form.logo}
        onChange={(url) => setForm({ ...form, logo: url })}
        label="Brand Logo"
        folder="brands"
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Website</label>
        <input
          type="url"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
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
        <Button type="button" variant="secondary" onClick={() => router.push("/brands")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
