import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default function CustomersPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Customers</h1>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6">
          <p className="text-muted-foreground">Customer management will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
