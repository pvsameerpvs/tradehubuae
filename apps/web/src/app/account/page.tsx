"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Clock, Heart, Package, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { Button, Badge } from "@tradehubuae/ui";
import { useAuth } from "@/lib/supabase/provider";
import { useWishlist } from "@/lib/wishlist-context";
import { orderStatusColor, formatStatus } from "@/data";
import { getMyOrdersFromSupabase } from "@/lib/actions/orders-supabase";

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
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrdersFromSupabase(user.id);
      setOrders((data || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number,
        status: o.status,
        total: Number(o.total),
        createdAt: o.created_at,
        items: (o.order_items || []).map((i: any) => ({ name: i.name, quantity: i.quantity })),
      })));
    } catch { setError("Could not load your orders"); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const activeOrders = orders.filter((o) => ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status));
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-2 sm:text-base">Welcome back, <span className="font-semibold text-ink">{user?.name ?? "there"}</span></p>
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Total Orders" value={String(orders.length)} icon={ShoppingBag} />
        <StatCard label="Active" value={String(activeOrders.length)} icon={Clock} />
        <StatCard label="Wishlist" value={String(wishlistCount)} icon={Heart} />
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-sm font-semibold text-ink sm:text-base">Recent Orders</h2>
          {orders.length > 0 && <Link href="/account/orders" className="text-sm font-medium text-brand">View All</Link>}
        </div>
        {loading ? (
          <div className="divide-y divide-line">{[1, 2, 3].map((i) => <div key={i} className="flex items-center gap-4 px-5 py-4"><div className="flex-1 space-y-2"><div className="h-4 w-32 animate-pulse rounded bg-bg2" /><div className="h-3 w-24 animate-pulse rounded bg-bg2" /></div><div className="h-5 w-16 animate-pulse rounded bg-bg2" /></div>)}</div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sale/10"><AlertCircle className="h-7 w-7 text-sale" strokeWidth={1.5} /></div>
            <div><p className="text-sm font-medium text-ink">Something went wrong</p><p className="mt-1 text-xs text-ink-2 sm:text-sm">{error}</p></div>
            <Button variant="outline" size="sm" onClick={loadOrders} className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" strokeWidth={2} /> Try Again</Button>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2"><Package className="h-7 w-7 text-ink-3" strokeWidth={1} /></div>
            <div><p className="text-sm font-medium text-ink sm:text-base">No orders yet</p><p className="mt-1 text-xs text-ink-2 sm:text-sm">Your order history will appear here once you make a purchase.</p></div>
            <Link href="/"><Button size="sm">Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="divide-y divide-line">{recentOrders.map((order) => (
            <Link key={order.id} href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-bg2/50">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink sm:text-base">{order.orderNumber}</p>
                <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">{new Date(order.createdAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })} · {order.items.length} item(s)</p>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-3">
                <Badge variant={orderStatusColor[order.status] || "default"} className="text-xs">{formatStatus(order.status)}</Badge>
                <span className="hidden text-sm font-semibold text-ink sm:inline">AED {Number(order.total).toLocaleString()}</span>
                <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={2} />
              </div>
            </Link>
          ))}</div>
        )}
      </div>
    </div>
  );
}
