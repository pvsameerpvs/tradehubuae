import type { Metadata } from "next";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history at TradeHub UAE",
};

const orders = [
  { id: "ORD-001", date: "2026-07-10", status: "Delivered", total: 5499, items: [{ name: "Dell XPS 15", qty: 1 }] },
  { id: "ORD-002", date: "2026-07-05", status: "Shipped", total: 698, items: [{ name: "Logitech MX Master 3S", qty: 2 }] },
  { id: "ORD-003", date: "2026-06-28", status: "Processing", total: 1299, items: [{ name: 'Samsung 27" Monitor', qty: 1 }] },
  { id: "ORD-004", date: "2026-06-15", status: "Cancelled", total: 3299, items: [{ name: "HP Pavilion Desktop", qty: 1 }] },
  { id: "ORD-005", date: "2026-06-10", status: "Delivered", total: 8498, items: [{ name: "MacBook Pro 16", qty: 1 }, { name: "USB-C Hub", qty: 1 }] },
];

const statusColor = {
  Delivered: "success" as const,
  Shipped: "default" as const,
  Processing: "warning" as const,
  Cancelled: "destructive" as const,
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="mb-4 h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
          <p className="mb-6 text-muted-foreground">Your order history will appear here.</p>
          <Link href="/categories">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{order.id}</span>
                    <Badge variant={statusColor[order.status as keyof typeof statusColor]}>{order.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.date} &middot; {order.items.reduce((s, i) => s + i.qty, 0)} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-semibold">AED {order.total.toLocaleString()}</p>
                  <Link href="/track-order">
                    <Button variant="outline" size="sm">Track Order</Button>
                  </Link>
                </div>
              </div>
              <div className="mt-3 border-t pt-3">
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span key={i} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                      {item.name} × {item.qty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
