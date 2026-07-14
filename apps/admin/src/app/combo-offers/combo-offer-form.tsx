"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, type PaginatedResponse } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@tradehubuae/ui";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  condition: string;
}

interface ComboOfferItem {
  productId: string;
  quantity: number;
  product?: Product;
}

interface ComboOffer {
  id: string;
  name: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  image: string | null;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  items: ComboOfferItem[];
}

export default function ComboOfferForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    image: "",
    isActive: true,
    startsAt: "",
    expiresAt: "",
  });
  const [items, setItems] = useState<ComboOfferItem[]>([]);

  useEffect(() => {
    api.get<PaginatedResponse<Product>>("/products", { limit: 200, sort: "name", order: "asc" })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api.get<ComboOffer>(`/combo-offers/${id}`)
      .then((offer) => {
        setForm({
          name: offer.name,
          description: offer.description ?? "",
          discountType: offer.discountType,
          discountValue: Number(offer.discountValue),
          image: offer.image ?? "",
          isActive: offer.isActive,
          startsAt: offer.startsAt ? new Date(offer.startsAt).toISOString().slice(0, 16) : "",
          expiresAt: offer.expiresAt ? new Date(offer.expiresAt).toISOString().slice(0, 16) : "",
        });
        setItems(offer.items.map((i) => ({ productId: i.productId, quantity: i.quantity, product: i.product })));
      })
      .catch((err) => console.error("Failed to fetch combo offer", err))
      .finally(() => setFetching(false));
  }, [id]);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof ComboOfferItem, value: string | number) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value } as ComboOfferItem;
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validItems = items.filter((i) => i.productId);
      const payload = {
        ...form,
        image: form.image || undefined,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
        items: validItems.length > 0 ? validItems.map((i) => ({ productId: i.productId, quantity: i.quantity })) : undefined,
      };
      if (id) {
        await api.put(`/combo-offers/${id}`, payload);
      } else {
        await api.post("/combo-offers", payload);
      }
      router.push("/combo-offers");
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
        <label className="mb-1 block text-sm font-medium text-ink">Name *</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })}
        label="Offer Image"
        folder="offers"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Discount Type</label>
          <select
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed (AED)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Discount Value *</label>
          <input
            required
            type="number"
            min={0}
            value={form.discountValue}
            onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
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
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          className="rounded border-line"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-ink">Active</label>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Products in Offer</label>
          <button type="button" onClick={addItem} className="text-sm font-semibold text-brand hover:underline">
            + Add Product
          </button>
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="mb-2 flex items-center gap-3">
            <select
              value={item.productId}
              onChange={(e) => updateItem(idx, "productId", e.target.value)}
              className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="">Select product...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
              className="w-20 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <button type="button" onClick={() => removeItem(idx)} className="text-sm font-semibold text-sale hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : id ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/combo-offers")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
