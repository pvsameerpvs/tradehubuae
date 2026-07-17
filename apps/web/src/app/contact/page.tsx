"use client";

import { useState } from "react";
import { Button, Input } from "@tradehubuae/ui";
import { MapPin, Mail, Phone } from "@/components/icons";
import { submitContact } from "@/lib/actions/contact";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await submitContact(form);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
            <Mail className="h-10 w-10 text-brand" />
          </div>
          <h1 className="mb-4 text-3xl font-bold">Message Sent!</h1>
          <p className="text-lg text-ink-2">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
        </div>
      </div>
    );
  }

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
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</div>}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Name *</label>
                  <Input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email *</label>
                  <Input required type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Phone</label>
                <Input placeholder="+971 XX XXX XXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Subject *</label>
                <Input required placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Message *</label>
                <textarea
                  required
                  className="flex min-h-[120px] w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
                  placeholder="Tell us more about your inquiry..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <Button type="submit" size="lg" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</Button>
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
