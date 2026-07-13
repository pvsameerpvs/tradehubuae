"use client";

import { useState } from "react";
import { CreditCard, Save, Truck } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

export default function PaymentSettingsPage() {
  const [codEnabled, setCodEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Payment Settings</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Configure available payment methods</p>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <Truck className="h-5 w-5 text-emerald-600" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Cash on Delivery</p>
                <p className="text-xs text-ink-2">Customer pays in cash upon delivery</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-bg3 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand peer-checked:after:translate-x-full" />
            </label>
          </div>

          <div className="mt-4 pt-4 border-t border-line">
            <div className="rounded-lg bg-bg2 px-4 py-3">
              <p className="text-xs font-medium text-ink-2">Currently only COD is available</p>
              <p className="mt-0.5 text-[11px] text-ink-3">
                Stripe (cards), Tabby, and Tamara (BNPL) will be added when online payments are ready.
              </p>
            </div>
          </div>

          <div className="mt-4">
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
