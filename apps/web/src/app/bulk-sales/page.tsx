"use client";

import { useState } from "react";
import { Button, Input, Badge } from "@tradehubuae/ui";
import {
  Check,
  Mail,
  Phone,
  Clock,
  Package,
  TrendingDown,
  Users,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { bulkBenefits, industries } from "@/data/benefits";
import { defaultBulkTiers } from "@/data/bulkPricing";

const benefitIcons: Record<string, typeof Check> = {
  shield: ShieldCheck,
  truck: Package,
  briefcase: TrendingDown,
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export default function BulkSalesPage() {
  const [form, setForm] = useState({ companyName: "", contactName: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/bulk-sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Request failed" }));
        throw new Error(err.message ?? "Something went wrong");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-lg rounded-xl border border-line bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <Check className="h-6 w-6 text-emerald-600" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-semibold text-ink" style={{ letterSpacing: "-0.01em" }}>Inquiry Submitted</h2>
          <p className="mt-2 text-sm text-ink-2">
            Thank you! Our sales team will review your request and get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="default" className="mb-4 rounded-full px-4 py-1.5 text-xs font-semibold">
          For Businesses &amp; Organizations
        </Badge>
        <h1
          className="text-[26px] font-semibold leading-[30px] text-ink"
          style={{ letterSpacing: "-0.01em" }}
        >
          Bulk Sales &amp; Corporate Orders
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          Get exclusive volume pricing, dedicated account management, and
          customized IT solutions for your organization.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-line bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-brand" strokeWidth={1.75} />
          <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
            Volume Pricing Tiers
          </h2>
        </div>
        <p className="mb-6 text-sm text-ink-2">
          The more you order, the more you save. Discounts apply automatically
          at checkout when you increase quantities.
        </p>

        <div className="grid gap-3 sm:grid-cols-5">
          {defaultBulkTiers.map((tier, i) => (
            <div
              key={tier.minQty}
              className={`relative rounded-xl border p-4 text-center transition-shadow hover:shadow-card ${
                i === Math.floor(defaultBulkTiers.length / 2)
                  ? "border-brand/40 bg-brand/5"
                  : "border-line"
              }`}
            >
              {i === Math.floor(defaultBulkTiers.length / 2) && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-white">
                  Popular
                </div>
              )}
              <p className="mt-1 text-2xl font-bold text-ink">
                {tier.minQty}
                {tier.maxQty ? `–${tier.maxQty}` : "+"}
              </p>
              <p className="text-xs text-ink-2">units</p>
              <div className="mx-auto mt-3 h-px w-8 bg-line" />
              <p className="mt-3 text-lg font-bold text-brand">
                {tier.discountPercent}%
              </p>
              <p className="text-xs text-ink-2">off</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-ink-3">
          *Tiers apply per product. Discounts stack with combo offers and promo codes.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bulkBenefits.map((benefit) => {
          const Icon = benefitIcons[benefit.icon] ?? Check;
          return (
            <div
              key={benefit.title}
              className="rounded-xl border border-line bg-white p-5 transition-shadow hover:shadow-card"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                <Icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
              </div>
              <h3 className="text-[15px] font-semibold leading-[19px] text-ink">
                {benefit.title}
              </h3>
              <p className="mt-1 text-sm text-ink-2">{benefit.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
          <h2 className="mb-6 text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
            Request a Quote
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</div>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
                  Company Name
                </label>
                <Input required placeholder="Your company" className="mt-1.5" value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
                  Contact Name
                </label>
                <Input required placeholder="Full name" className="mt-1.5" value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
                  Email
                </label>
                <Input required type="email" placeholder="email@company.com" className="mt-1.5" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
                  Phone
                </label>
                <Input required type="tel" placeholder="+971 5X XXX XXXX" className="mt-1.5" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
                Tell us about your requirements
              </label>
              <textarea
                className="mt-1.5 flex min-h-[120px] w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                placeholder="Products, quantities, timeline, budget..." value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <Button type="submit" size="lg" className="btn-brand w-full border-0 text-white" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand" strokeWidth={1.75} />
              <h3 className="text-[15px] font-semibold leading-[19px] text-ink">
                Why Choose TradeHub UAE?
              </h3>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed">
              With years of experience serving UAE businesses, we understand the
              unique challenges of enterprise IT procurement. Our team works
              closely with your organization to deliver the right solutions at
              the right price — from flexible Net 30/60 payment terms to
              dedicated account managers and priority installation.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-brand" strokeWidth={1.75} />
              <h3 className="text-[15px] font-semibold leading-[19px] text-ink">
                Industries We Serve
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-full bg-bg2 px-3 py-1.5 text-xs font-medium text-ink-2"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <Headphones className="h-5 w-5 text-brand" strokeWidth={1.75} />
              <h3 className="text-[15px] font-semibold leading-[19px] text-ink">
                Contact Our Sales Team
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand shrink-0" strokeWidth={1.75} />
                <a
                  href="mailto:corporate@tradehubuae.com"
                  className="text-brand hover:underline"
                >
                  corporate@tradehubuae.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand shrink-0" strokeWidth={1.75} />
                <span className="text-ink-2">+971 4 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-brand shrink-0" strokeWidth={1.75} />
                <span className="text-ink-2">Sat - Thu, 9:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
