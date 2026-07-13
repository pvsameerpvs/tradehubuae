"use client";

import { useState } from "react";
import { Settings2, Save } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

export default function GeneralSettingsPage() {
  const [form, setForm] = useState({
    storeName: "TradeHub UAE",
    currency: "AED",
    timezone: "Asia/Dubai",
    taxRate: "5",
    email: "hello@tradehubuae.com",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>General Settings</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Store name, currency, timezone, and tax configuration</p>
      </div>
      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Store Name</label>
            <input
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Timezone</label>
              <select
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                <option value="Asia/Riyadh">Asia/Riyadh (UTC+3)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Tax Rate (%)</label>
            <input
              type="number"
              value={form.taxRate}
              onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Support Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="pt-2">
            <Button onClick={handleSave}>
              <Save className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
