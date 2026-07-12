import type { Metadata } from "next";
import { Button, Input } from "@tradehubuae/ui";
import { Check, Mail, Phone, Clock } from "@/components/icons";
import { bulkBenefits, industries } from "@/data";

export const metadata: Metadata = {
  title: "Bulk Sales & Corporate Orders",
  description: "Get special pricing for bulk IT equipment orders. Perfect for businesses, schools, and government organizations in UAE.",
};

export default function BulkSalesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Bulk Sales & Corporate Orders</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Need IT equipment for your organization? Get competitive pricing, dedicated support,
            and customized solutions for your business needs.
          </p>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bulkBenefits.map((benefit) => (
            <div key={benefit.title} className="rounded-xl border bg-card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{benefit.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-8">
            <h2 className="mb-6 text-2xl font-semibold">Request a Quote</h2>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Company Name</label>
                  <Input placeholder="Your company" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Contact Name</label>
                  <Input placeholder="Full name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <Input type="email" placeholder="email@company.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Phone</label>
                  <Input type="tel" placeholder="+971 5X XXX XXXX" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Tell us about your requirements</label>
                <textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Products, quantities, timeline, budget..." />
              </div>
              <Button size="lg" className="w-full">Submit Inquiry</Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-3 font-semibold">Why Choose TradeHub UAE for Bulk Orders?</h3>
              <p className="text-sm text-muted-foreground">
                With years of experience serving UAE businesses, we understand the unique challenges
                of enterprise IT procurement. Our team works closely with your organization to deliver
                the right solutions at the right price.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-3 font-semibold">Industries We Serve</h3>
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <span key={ind} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-3 font-semibold">Contact Our Sales Team</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:corporate@tradehubuae.com" className="text-primary hover:underline">corporate@tradehubuae.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">+971 4 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Sat - Thu, 9:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
