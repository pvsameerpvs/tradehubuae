"use client";

import { useState } from "react";
import { Link2, Save, CheckCircle2, AlertCircle, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

interface Integration {
  id: string;
  name: string;
  desc: string;
  provider: string;
  fields: { key: string; label: string; type: "text" | "password" | "select"; options?: { label: string; value: string }[] }[];
  status: "connected" | "disconnected" | "error" | "has_env";
  docUrl: string;
}

const integrations: Integration[] = [
  {
    id: "meta-ads",
    name: "Meta Ads",
    desc: "Connect your Meta Business account to pull ad campaign performance data into your dashboard",
    provider: "Facebook Marketing API",
    fields: [
      { key: "META_APP_ID", label: "App ID", type: "text" },
      { key: "META_ACCESS_TOKEN", label: "Access Token", type: "password" },
      { key: "META_AD_ACCOUNT_ID", label: "Ad Account ID", type: "text" },
    ],
    status: "disconnected",
    docUrl: "https://developers.facebook.com/docs/marketing-api",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    desc: "Sync Google Ads campaign data including spend, impressions, clicks, and conversions",
    provider: "Google Ads API",
    fields: [
      { key: "GOOGLE_ADS_DEVELOPER_TOKEN", label: "Developer Token", type: "password" },
      { key: "GOOGLE_ADS_CLIENT_ID", label: "Client ID", type: "text" },
      { key: "GOOGLE_ADS_CLIENT_SECRET", label: "Client Secret", type: "password" },
      { key: "GOOGLE_ADS_CUSTOMER_ID", label: "Customer ID", type: "text" },
    ],
    status: "disconnected",
    docUrl: "https://developers.google.com/google-ads/api",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    desc: "Track visitor behavior, page views, and user demographics on your storefront",
    provider: "GA4 Measurement Protocol",
    fields: [
      { key: "GA4_MEASUREMENT_ID", label: "Measurement ID", type: "text" },
      { key: "GA4_API_SECRET", label: "API Secret", type: "password" },
    ],
    status: "disconnected",
    docUrl: "https://developers.google.com/analytics/devguides/collection/protocol/ga4",
  },
  {
    id: "search-console",
    name: "Google Search Console",
    desc: "Import search ranking data, impressions, and click-through rates for your pages",
    provider: "Search Console API",
    fields: [
      { key: "SEARCH_CONSOLE_API_KEY", label: "API Key", type: "password" },
    ],
    status: "disconnected",
    docUrl: "https://developers.google.com/webmaster-tools",
  },
  {
    id: "resend",
    name: "Resend (Email)",
    desc: "Send transactional emails — order confirmations, shipping updates, password resets",
    provider: "Resend API",
    fields: [
      { key: "RESEND_API_KEY", label: "API Key", type: "password" },
      { key: "EMAIL_FROM", label: "From Email", type: "text" },
    ],
    status: "has_env",
    docUrl: "https://resend.com/docs",
  },
  {
    id: "gemini",
    name: "Google Gemini (AI)",
    desc: "Powers automated SEO generation, product descriptions, and image analysis",
    provider: "Gemini Pro API",
    fields: [
      { key: "GEMINI_API_KEY", label: "API Key", type: "password" },
    ],
    status: "connected",
    docUrl: "https://ai.google.dev/gemini-api",
  },
];

type FormState = Record<string, Record<string, string>>;

export default function IntegrationsSettingsPage() {
  const [form, setForm] = useState<FormState>(() => {
    const initial: FormState = {};
    for (const int of integrations) {
      initial[int.id] = {};
      for (const field of int.fields) {
        initial[int.id]![field.key] = "";
      }
    }
    return initial;
  });
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const handleSave = async (id: string) => {
    setSaved((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [id]: false })), 2000);
  };

  const updateField = (integrationId: string, key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [integrationId]: { ...prev[integrationId], [key]: value },
    }));
  };

  const StatusBadge = ({ status }: { status: Integration["status"] }) => {
    const map: Record<Integration["status"], { label: string; className: string; icon: React.ElementType }> = {
      connected: { label: "Connected", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
      has_env: { label: "Key in .env", className: "bg-amber-50 text-amber-700", icon: AlertCircle },
      error: { label: "Error", className: "bg-red-50 text-red-700", icon: AlertCircle },
      disconnected: { label: "Not configured", className: "bg-bg3 text-ink-3", icon: Link2 },
    };
    const { label, className, icon: Icon } = map[status];
    return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}><Icon className="h-3 w-3" /> {label}</span>;
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Integrations</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage API connections for analytics, ads, email, and AI services</p>
      </div>

      {integrations.map((int) => (
        <Card key={int.id}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{int.name}</p>
                  <StatusBadge status={int.status} />
                </div>
                <p className="mt-0.5 text-xs text-ink-2">{int.desc}</p>
                <p className="mt-0.5 text-[11px] text-ink-3">Provider: {int.provider}</p>
              </div>
              <a
                href={int.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline shrink-0"
              >
                Docs <Link2 className="h-3 w-3" strokeWidth={2} />
              </a>
            </div>

            <div className="mt-4 space-y-3">
              {int.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-xs font-medium text-ink-2">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.type === "password" && !visible[int.id + field.key] ? "password" : "text"}
                      value={form[int.id]?.[field.key] ?? ""}
                      onChange={(e) => updateField(int.id, field.key, e.target.value)}
                      placeholder={field.type === "password" ? "••••••••••••••••" : `Enter ${field.label}`}
                      className="w-full rounded-lg border border-line bg-white px-3 py-2 pr-9 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setVisible((prev) => ({ ...prev, [int.id + field.key]: !prev[int.id + field.key] }))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
                        aria-label={visible[int.id + field.key] ? "Hide" : "Show"}
                      >
                        {visible[int.id + field.key] ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] text-ink-3">
                {int.status === "connected"
                  ? "✓ Connection verified"
                  : "Save to update environment configuration"}
              </p>
              <Button size="sm" onClick={() => handleSave(int.id)} disabled={saved[int.id]}>
                <Save className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.75} />
                {saved[int.id] ? "Saved!" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
