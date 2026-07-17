"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@tradehubuae/ui";

interface CouponItem {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
}

export function CouponForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    isActive: true,
    startsAt: "",
    expiresAt: "",
  });

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api.get<CouponItem>(`/coupons/${id}`)
      .then((item) => setForm({
        code: item.code,
        description: item.description ?? "",
        type: item.type,
        value: String(item.value),
        minOrderAmount: item.minOrderAmount ? String(item.minOrderAmount) : "",
        maxDiscount: item.maxDiscount ? String(item.maxDiscount) : "",
        usageLimit: item.usageLimit ? String(item.usageLimit) : "",
        isActive: item.isActive,
        startsAt: item.startsAt ? item.startsAt.slice(0, 16) : "",
        expiresAt: item.expiresAt ? item.expiresAt.slice(0, 16) : "",
      }))
      .catch(() => { /* TODO: show error toast */ })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        code: form.code,
        description: form.description || undefined,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        isActive: form.isActive,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      };
      if (id) {
        await api.put(`/coupons/${id}`, payload);
      } else {
        await api.post("/coupons", payload);
      }
      router.push("/coupons");
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
        <label className="mb-1 block text-sm font-medium text-ink">Code *</label>
        <input
          required
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          placeholder="SAVE20"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Description</label>
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          placeholder="20% off on all items"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Type *</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Value *</label>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Min Order Amount</label>
          <input
            type="number"
            min={0}
            value={form.minOrderAmount}
            onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Max Discount</label>
          <input
            type="number"
            min={0}
            value={form.maxDiscount}
            onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Optional"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Usage Limit</label>
        <input
          type="number"
          min={1}
          value={form.usageLimit}
          onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          placeholder="Unlimited"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Start Date</label>
          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Expiry Date</label>
          <input
            type="datetime-local"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          className="h-4 w-4 rounded border-line text-brand focus:outline-none"
        />
        Active
      </label>
      <div className="flex gap-4 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : id ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/coupons")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
