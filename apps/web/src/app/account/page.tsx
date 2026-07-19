"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  Heart,
  Package,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button, Badge } from "@tradehubuae/ui";
import { useAuth } from "@/lib/supabase/provider";
import { useWishlist } from "@/lib/wishlist-context";
import { orderStatusColor, formatStatus } from "@/data";
import { getMyOrdersFromSupabase } from "@/lib/actions/orders-supabase";

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: typeof Package;
  trend?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line/60 bg-white p-5 transition-all duration-300 hover:shadow-card">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand/[0.03] transition-all duration-300 group-hover:scale-150" />
      <div className="relative flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/10 to-brand/5 transition-all duration-300 group-hover:from-brand/20 group-hover:to-brand/10">
          <Icon className="h-5 w-5 text-brand sm:h-6 sm:w-6" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-2 sm:text-sm">{label}</p>
          <p className="text-xl font-bold text-ink sm:text-2xl">{value}</p>
          {trend && <p className="mt-0.5 text-[11px] font-medium text-emerald-600">{trend}</p>}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
      setOrders(
        (data || []).map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          status: o.status,
          total: Number(o.total),
          createdAt: o.created_at,
          items: (o.order_items || []).map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
          })),
        })),
      );
    } catch {
      setError("Could not load your orders");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const activeOrders = orders.filter((o) =>
    ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status),
  );
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 sm:p-8">
        <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/[0.03]" />
        <div className="relative">
          <div className="flex items-center gap-2">
            
            <p className="text-sm font-medium text-white/80">Welcome back</p>
          </div>
          <h2 className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
            {user?.name ?? "there"}
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Here&apos;s what&apos;s happening with your account
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Total Orders"
          value={String(orders.length)}
          icon={ShoppingBag}
          trend={orders.length > 0 ? `${recentOrders.length} this period` : undefined}
        />
        <StatCard
          label="Active"
          value={String(activeOrders.length)}
          icon={Clock}
          trend={activeOrders.length > 0 ? "In progress" : undefined}
        />
        <StatCard label="Wishlist" value={String(wishlistCount)} icon={Heart} />
      </div>

      {/* Recent Orders */}
      <div className="overflow-hidden rounded-2xl border border-line/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-line/60 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-ink-3" strokeWidth={1.5} />
            <h2 className="text-sm font-semibold text-ink sm:text-base">Recent Orders</h2>
          </div>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="group inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand-dark"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="divide-y divide-line/60">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-5 py-4 sm:px-6">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 rounded-lg bg-bg2" />
                  <div className="h-3 w-24 rounded-lg bg-bg2" />
                </div>
                <div className="h-6 w-20 rounded-lg bg-bg2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Something went wrong</p>
              <p className="mt-1 text-xs text-ink-2 sm:text-sm">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadOrders}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
              Try Again
            </Button>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg2">
              <Package className="h-8 w-8 text-ink-3" strokeWidth={1} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink sm:text-base">No orders yet</p>
              <p className="mt-1 text-xs text-ink-2 sm:text-sm">
                Your order history will appear here once you make a purchase.
              </p>
            </div>
            <Link href="/">
              <Button size="sm" className="gap-1.5">
                Start Shopping
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-line/60">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
                className="group flex items-center justify-between px-5 py-4 transition-all hover:bg-bg2/50 sm:px-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink transition-colors group-hover:text-brand sm:text-base">
                      {order.orderNumber}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">
                    {formatDate(order.createdAt)} &middot; {order.items.length} item(s)
                  </p>
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-3">
                  <Badge
                    variant={orderStatusColor[order.status] || "default"}
                    className="text-xs"
                  >
                    {formatStatus(order.status)}
                  </Badge>
                  <span className="hidden text-sm font-semibold text-ink sm:inline">
                    AED {Number(order.total).toLocaleString()}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
