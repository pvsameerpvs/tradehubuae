import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6">
          <p className="text-muted-foreground">Order management table will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
