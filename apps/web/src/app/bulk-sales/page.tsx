import type { Metadata } from "next";
import { Button } from "@tradehubuae/ui";

export const metadata: Metadata = {
  title: "Bulk Sales & Corporate Orders",
  description: "Get special pricing for bulk IT equipment orders. Perfect for businesses, schools, and government organizations in UAE.",
};

const benefits = [
  { title: "Competitive Pricing", desc: "Exclusive bulk discounts on all products" },
  { title: "Dedicated Account Manager", desc: "Personal support throughout your journey" },
  { title: "Customized Solutions", desc: "Tailored IT equipment for your needs" },
  { title: "Flexible Payment Terms", desc: "Net 30/60 payment options for businesses" },
  { title: "Priority Delivery", desc: "Fast-tracked shipping and installation" },
  { title: "Warranty & Support", desc: "Extended warranties and on-site support" },
];

export default function BulkSalesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Bulk Sales & Corporate Orders</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Need IT equipment for your organization? Get competitive pricing, dedicated support,
            and customized solutions for your business needs.
          </p>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-xl border bg-card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
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
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your company" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Contact Name</label>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Full name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="email@company.com" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Phone</label>
                  <input type="tel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="+971 5X XXX XXXX" />
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
                {["Education", "Healthcare", "Government", "Banking", "Retail", "Hospitality", "Real Estate", "Manufacturing"].map((ind) => (
                  <span key={ind} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-3 font-semibold">Contact Our Sales Team</h3>
              <div className="space-y-2 text-sm">
                <p><a href="mailto:corporate@tradehubuae.com" className="text-primary hover:underline">corporate@tradehubuae.com</a></p>
                <p className="text-muted-foreground">+971 4 123 4567</p>
                <p className="text-muted-foreground">Sat - Thu, 9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
