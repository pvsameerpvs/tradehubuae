"use client";

import { useState } from "react";
import { CreditCard, Save } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

export default function PaymentSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    stripeEnabled: true,
    stripeKey: "sk_test_...",
    codEnabled: true,
    tabbyEnabled: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Payment Settings</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Configure payment gateways and methods</p>
      </div>
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Stripe</p>
              <p className="text-xs text-ink-2">Credit/debit card payments</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={form.stripeEnabled} onChange={(e) => setForm({ ...form, stripeEnabled: e.target.checked })} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-bg3 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand peer-checked:after:translate-x-full" />
            </label>
          </div>
          {form.stripeEnabled && (
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Secret Key</label>
              <input
                value={form.stripeKey}
                onChange={(e) => setForm({ ...form, stripeKey: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Cash on Delivery</p>
              <p className="text-xs text-ink-2">COD payment method</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={form.codEnabled} onChange={(e) => setForm({ ...form, codEnabled: e.target.checked })} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-bg3 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand peer-checked:after:translate-x-full" />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Tabby</p>
              <p className="text-xs text-ink-2">Buy now, pay later</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={form.tabbyEnabled} onChange={(e) => setForm({ ...form, tabbyEnabled: e.target.checked })} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-bg3 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand peer-checked:after:translate-x-full" />
            </label>
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
