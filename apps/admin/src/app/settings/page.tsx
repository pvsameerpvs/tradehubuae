"use client";

import Link from "next/link";
import { Settings2, CreditCard, Truck, Mail, Shield, Palette } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";

const sections = [
  { title: "General", desc: "Store name, currency, timezone, tax rates", icon: Settings2, color: "text-brand", bg: "bg-brand/5", href: "/settings/general" },
  { title: "Payments", desc: "Payment gateway configuration and methods", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50", href: "/settings/payments" },
  { title: "Shipping", desc: "Shipping zones, methods, and rates", icon: Truck, color: "text-violet-600", bg: "bg-violet-50", href: "/settings/shipping" },
  { title: "Email", desc: "SMTP settings, email templates, notifications", icon: Mail, color: "text-amber-600", bg: "bg-amber-50", href: "/settings/email" },
  { title: "Security", desc: "Login, permissions, API keys, GDPR", icon: Shield, color: "text-rose-600", bg: "bg-rose-50", href: "/settings/security" },
  { title: "Appearance", desc: "Logo, favicon, theme, custom CSS", icon: Palette, color: "text-cyan-600", bg: "bg-cyan-50", href: "/settings/appearance" },
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Settings</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Configure your store settings</p>
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
