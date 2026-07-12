import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Products", value: "0" },
          { label: "Active Orders", value: "0" },
          { label: "Total Customers", value: "0" },
          { label: "Revenue (AED)", value: "0" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Recent Orders</h2>
          <p className="text-sm text-muted-foreground">No orders yet</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Low Stock Alerts</h2>
          <p className="text-sm text-muted-foreground">All stock levels are healthy</p>
        </div>
      </div>
    </div>
  );
}
