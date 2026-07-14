"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Clock, Heart, Package, ChevronRight } from "lucide-react";
import { Button, Badge } from "@tradehubuae/ui";
import { getMyOrders, type OrderData } from "@/lib/actions/orders";
import { orderStatusColor, formatStatus } from "@/data";

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Package }) {
  return (
    <div className="group rounded-xl border border-line bg-white p-4 transition-all duration-200 hover:shadow-card sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 transition-colors group-hover:bg-brand/20 sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 text-brand sm:h-6 sm:w-6" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-ink-2 sm:text-sm">{label}</p>
          <p className="text-xl font-bold text-ink sm:text-2xl">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function AccountOverview() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PROCESSING" || o.status === "SHIPPED",
  );
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Total Orders" value={String(orders.length)} icon={ShoppingBag} />
        <StatCard label="Active" value={String(activeOrders.length)} icon={Clock} />
        <StatCard label="Wishlist" value="5" icon={Heart} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-sm font-semibold text-ink sm:text-base">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-sm font-medium text-brand transition-colors hover:text-brand-dark"
          >
            View All
          </Link>
        </div>
        {recentOrders.length === 0 && !loading ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2">
              <Package className="h-7 w-7 text-ink-3" strokeWidth={1} />
            </div>
            <p className="text-sm text-ink-2">No orders yet</p>
            <Link href="/">
              <Button size="sm">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-bg2/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink sm:text-base">{order.orderNumber}</p>
                  <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" · "}
                    {order.items.length} item(s)
                  </p>
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-3">
                  <Badge variant={orderStatusColor[order.status] || "default"} className="text-xs">
                    {formatStatus(order.status)}
                  </Badge>
                  <span className="text-sm font-semibold text-ink">AED {Number(order.total).toLocaleString()}</span>
                  <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
