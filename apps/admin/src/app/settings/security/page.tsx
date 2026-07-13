"use client";

import { useState } from "react";
import { Shield, Save, Key } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

export default function SecuritySettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    twoFactor: false,
    sessionTimeout: "24",
    maxLoginAttempts: "5",
    apiKey: "th_",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const regenerateKey = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const key = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setForm({ ...form, apiKey: `th_${key}` });
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Security</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Login, session, and API key configuration</p>
      </div>
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Two-Factor Authentication</p>
              <p className="text-xs text-ink-2">Require 2FA for all admin accounts</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={form.twoFactor} onChange={(e) => setForm({ ...form, twoFactor: e.target.checked })} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-bg3 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand peer-checked:after:translate-x-full" />
            </label>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Session Timeout (hours)</label>
            <input
              type="number"
              value={form.sessionTimeout}
              onChange={(e) => setForm({ ...form, sessionTimeout: e.target.value })}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Max Login Attempts</label>
            <input
              type="number"
              value={form.maxLoginAttempts}
              onChange={(e) => setForm({ ...form, maxLoginAttempts: e.target.value })}
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">API Key</label>
            <div className="flex gap-2">
              <input
                value={form.apiKey}
                readOnly
                className="flex-1 rounded-lg border border-line bg-bg2 px-3 py-2 text-sm text-ink font-mono"
              />
              <Button variant="secondary" onClick={regenerateKey}>
                <Key className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
                Regenerate
              </Button>
            </div>
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
