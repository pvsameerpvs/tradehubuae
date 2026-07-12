import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function InventoryPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Inventory</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Stock Levels</h2>
          <p className="text-sm text-muted-foreground">Monitor and manage stock across warehouses</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Stock Transfers</h2>
          <p className="text-sm text-muted-foreground">Transfer stock between warehouses</p>
        </div>
      </div>
    </div>
  );
}
