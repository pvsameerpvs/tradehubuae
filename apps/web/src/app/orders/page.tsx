import type { Metadata } from "next";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";
import { Package } from "@/components/icons";
import { orders, orderStatusColor } from "@/data";
import type { Order } from "@/data";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history at TradeHub UAE",
};

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">{order.id}</span>
            <Badge variant={orderStatusColor[order.status]}>{order.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-2">
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
            <span key={i} className="rounded-md bg-bg2 px-2 py-1 text-xs text-ink-2">
              {item.name} × {item.qty}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="mb-4 h-16 w-16 text-ink-2" strokeWidth={1} />
          <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
          <p className="mb-6 text-ink-2">Your order history will appear here.</p>
          <Link href="/categories">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
