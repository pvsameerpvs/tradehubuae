"use client";

import Link from "next/link";
import { Settings2, CreditCard, Truck, Palette, Link2 } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";

const sections = [
  { title: "General", desc: "Store name, currency, timezone, tax rates", icon: Settings2, color: "text-brand", bg: "bg-brand/5", href: "/settings/general" },
  { title: "Payments", desc: "Cash on Delivery configuration", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50", href: "/settings/payments" },
  { title: "Shipping", desc: "Shipping zones, methods, and rates", icon: Truck, color: "text-violet-600", bg: "bg-violet-50", href: "/settings/shipping" },
  { title: "Appearance", desc: "Logo, favicon, theme colors", icon: Palette, color: "text-cyan-600", bg: "bg-cyan-50", href: "/settings/appearance" },
  { title: "Integrations", desc: "API keys for Resend, Gemini, Meta Ads, Google Ads", icon: Link2, color: "text-brand", bg: "bg-brand/5", href: "/settings/integrations" },
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Settings</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Configure your store</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.title} href={s.href}>
              <Card className="transition-shadow hover:shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>
                      <Icon className={`h-5 w-5 ${s.color}`} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{s.title}</p>
                      <p className="mt-0.5 text-xs text-ink-2">{s.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
