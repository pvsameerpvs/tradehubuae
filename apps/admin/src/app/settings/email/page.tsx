"use client";

import { useState } from "react";
import { Mail, Save } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

export default function EmailSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    host: "smtp.sendgrid.net",
    port: "587",
    user: "apikey",
    pass: "",
    fromName: "TradeHub UAE",
    fromEmail: "noreply@tradehubuae.com",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Email Settings</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">SMTP configuration and email templates</p>
      </div>
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">SMTP Host</label>
              <input
                value={form.host}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Port</label>
              <input
                value={form.port}
                onChange={(e) => setForm({ ...form, port: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Username</label>
              <input
                value={form.user}
                onChange={(e) => setForm({ ...form, user: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Password</label>
              <input
                type="password"
                value={form.pass}
                onChange={(e) => setForm({ ...form, pass: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">From Name</label>
              <input
                value={form.fromName}
                onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">From Email</label>
              <input
                type="email"
                value={form.fromEmail}
                onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
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
