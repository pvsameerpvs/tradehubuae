"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@tradehubuae/ui";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "staff", isActive: true });

  useEffect(() => {
    api.get<User>(`/users/${params.id}`)
      .then((user) => setForm({ name: user.name, email: user.email, role: user.role, isActive: user.isActive }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/users/${params.id}`, form);
      router.push("/users");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-2">Loading...</p>;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Edit User</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Update user information and permissions</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
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
        <div className="flex gap-4 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/users")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
