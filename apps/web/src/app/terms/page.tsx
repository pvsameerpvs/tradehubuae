import type { Metadata } from "next";
import { Shield, RotateCcw, Wrench, Ban, XCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@tradehubuae/ui";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "TradeHub UAE return policy, warranty terms, and conditions of sale",
};

const policies = [
  {
    icon: RotateCcw,
    title: "7-Day Return Policy",
    description: "You have 7 calendar days from the date of delivery to request a return. Items must be unused, in original packaging, with all accessories and documentation. After 7 days, no return requests will be accepted.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    details: [
      "Request must be initiated within 7 days of delivery",
      "Product must be in original condition and packaging",
      "All accessories, manuals, and cables must be included",
      "Return shipping is covered by the customer",
      "Admin reviews and approves the return request",
      "Approved return restores items to inventory",
      "Refund processed after admin approval",
      "Refund amount is at admin discretion based on product condition",
    ],
  },
  {
    icon: Shield,
    title: "Order Cancellation",
    description: "Orders can be cancelled only while the status is Pending. Once the order status changes to Confirmed, cancellation is no longer possible under any circumstances.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    details: [
      "Free cancellation while order status is Pending",
      "No cancellations allowed after order is Confirmed",
      "Cancel directly from your account orders page",
      "Duplicate or incorrect orders must be reported within 2 hours",
      "Contact support immediately if you need to modify your order",
      "Duplicate or incorrect orders must be reported within 2 hours",
    ],
  },
  {
    icon: Wrench,
    title: "3-Month Service Warranty",
    description: "All products purchased from TradeHub UAE come with a 3-month service warranty covering manufacturing defects and hardware malfunctions under normal usage conditions.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    details: [
      "Coverage: manufacturing defects, hardware failures",
      "Duration: 3 months from date of delivery",
      "Service includes free diagnostics and repairs",
      "Customer pays one-way shipping; we cover return shipping",
      "Extended warranty plans available for purchase",
    ],
  },
  {
    icon: XCircle,
    title: "Physical Damage — No Returns",
    description: "Products with physical damage — including cracks, scratches, dents, liquid damage, or any signs of mishandling — are not eligible for return under any circumstances.",
    color: "text-red-600",
    bgColor: "bg-red-50",
    details: [
      "Cracked screens, bent frames, or broken ports",
      "Liquid or water damage of any kind",
      "Scratches, dents, or cosmetic damage",
      "Torn or damaged cables and accessories",
      "Any sign of drop or impact damage",
    ],
  },
  {
    icon: Ban,
    title: "Physical Damage — No Service",
    description: "Devices with physical damage are not covered under our service warranty. Repairs for physically damaged units are not available through TradeHub UAE. Please contact the manufacturer directly.",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    details: [
      "No warranty service on physically damaged devices",
      "No paid repair service for physical damage",
      "Damage must be reported within 24 hours of delivery",
      "Photographic evidence required for damage claims",
      "Manufacturer warranty may apply — check with brand",
    ],
  },
  {
    icon: FileText,
    title: "General Terms",
    description: "These terms govern all sales and services provided by TradeHub UAE. By making a purchase, you agree to these terms in full.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    details: [
      "Prices are subject to change without prior notice",
      "All products are subject to availability",
      "Delivery times are estimates, not guarantees",
      "Invoice must be kept for warranty claims",
      "We reserve the right to update these terms at any time",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Terms & Conditions</h1>
          <p className="mx-auto max-w-2xl text-lg text-ink-2">
            Please read our policies carefully before making a purchase. All orders are subject to these terms.
          </p>
          <p className="mt-2 text-sm text-ink-3">Last updated: July 2026</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <Card key={policy.title} className="border-line transition-shadow hover:shadow-card">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${policy.bgColor}`}>
                    <Icon className={`h-6 w-6 ${policy.color}`} />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm leading-relaxed">
                      {policy.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {policy.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm text-ink-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-3" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-line bg-bg2 p-6 text-center md:p-8">
          <h2 className="mb-3 text-xl font-semibold">Need Help?</h2>
          <p className="mb-4 text-ink-2">
            If you have any questions about our policies, please contact our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-ink-2">
            <a href="mailto:support@tradehubuae.com" className="font-medium text-brand hover:underline">
              support@tradehubuae.com
            </a>
            <span className="hidden sm:inline">|</span>
            <a href="tel:+97141234567" className="font-medium text-brand hover:underline">
              +971 4 123 4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
