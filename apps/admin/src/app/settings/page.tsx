import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">General</h2>
          <p className="text-sm text-muted-foreground">Store settings, currency, tax rates</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Payments</h2>
          <p className="text-sm text-muted-foreground">Payment gateway configuration</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Shipping</h2>
          <p className="text-sm text-muted-foreground">Shipping methods and rates</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Email</h2>
          <p className="text-sm text-muted-foreground">Email templates and SMTP configuration</p>
        </div>
      </div>
    </div>
  );
}
