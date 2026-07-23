"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@tradehubuae/ui";

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "CONTENT_MANAGER", label: "Content Manager" },
  { value: "SALES_MANAGER", label: "Sales Manager" },
  { value: "INVENTORY_MANAGER", label: "Inventory Manager" },
  { value: "SEO_MANAGER", label: "SEO Manager" },
];

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "ADMIN", isActive: true });

  useEffect(() => {
    api.get<any>(`/users/${params.id}`)
      .then((user) => setForm({ name: user.name, email: user.email, role: user.role, isActive: user.isActive }))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load user"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/users/${params.id}`, { name: form.name, email: form.email, role: form.role, isActive: form.isActive });
      toast.success("User updated");
      router.push("/users");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save user";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-lg space-y-6">
      <div className="h-4 w-16 animate-pulse rounded bg-bg2" />
      <div className="space-y-2">
        <div className="h-6 w-48 animate-pulse rounded bg-bg2" />
        <div className="h-4 w-32 animate-pulse rounded bg-bg2" />
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-4 w-20 animate-pulse rounded bg-bg2" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-bg2" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-lg space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back
      </button>
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Edit User</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Update user information and permissions</p>
      </div>
      {error && <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded border-line" />
          <label htmlFor="isActive" className="text-sm font-medium text-ink">Active</label>
        </div>
        <div className="flex gap-4 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/users")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
