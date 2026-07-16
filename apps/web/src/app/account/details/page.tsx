"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@tradehubuae/ui";
import { api } from "@/lib/api";

type Profile = {
  name: string;
  email: string;
  phone: string;
};

export default function AccountDetails() {
  const [profile, setProfile] = useState<Profile>({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api
      .get<{ data: Profile }>("/customers/profile")
      .then((res) => {
        const d = res.data;
        setProfile({ name: d.name ?? "", email: d.email ?? "", phone: d.phone ?? "" });
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError(null);
      setSuccess(false);
      try {
        await api.put("/customers/profile", {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        });
        setSuccess(true);
      } catch {
        setError("Failed to save profile");
      } finally {
        setSaving(false);
      }
    },
    [profile],
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <div className="h-4 w-32 animate-pulse rounded bg-bg3 sm:h-5" />
          <div className="mt-2 h-3 w-48 animate-pulse rounded bg-bg3 sm:h-4" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-20 animate-pulse rounded bg-bg3" />
              <div className="mt-2 h-11 animate-pulse rounded-lg bg-bg3 sm:h-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-ink sm:text-base">Account Details</h2>
        <p className="mt-1 text-sm text-ink-2">Update your personal information</p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
            Profile updated successfully
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
              Full Name
            </label>
            <input
              className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
              Email
            </label>
            <input
              className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              type="email"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
              Phone
            </label>
            <input
              className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              type="tel"
            />
          </div>
        </div>
        <div className="pt-1 sm:pt-2">
          <Button
            type="submit"
            size="default"
            className="h-11 text-sm sm:h-12 sm:text-base"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
