import type { Metadata } from "next";
import { Button, Input } from "@tradehubuae/ui";
import { MapPin, Mail, Phone } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with TradeHub UAE. We're here to help with your IT equipment needs.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Contact Us</h1>
          <p className="text-lg text-ink-2">
            Have a question or need assistance? We&apos;re here to help.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold">Send Us a Message</h2>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Subject</label>
                <Input placeholder="How can we help?" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Message</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <Button size="lg">Send Message</Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">Visit Us</h2>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-ink-2">Sheikh Zayed Road<br />Dubai, United Arab Emirates</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:sales@tradehubuae.com" className="text-brand hover:underline">sales@tradehubuae.com</a>
                    <br />
                    <a href="mailto:support@tradehubuae.com" className="text-brand hover:underline">support@tradehubuae.com</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-ink-2">+971 4 123 4567</p>
                    <p className="text-ink-2">+971 50 123 4567</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">Business Hours</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-2">Saturday - Thursday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Friday</span>
                  <span>2:00 PM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Public Holidays</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
