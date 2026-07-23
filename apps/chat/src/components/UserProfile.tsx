"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, Package, ShoppingBag, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { getInitials, getAvatarColor, formatTime } from "@/lib/utils";
import { cn } from "@tradehubuae/ui";
import type { UserProfile as UserProfileType, OrderData } from "@/types";

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userData, ordersData] = await Promise.all([
        api.users.get(userId),
        api.users.orders(userId),
      ]);
      setUser(userData as UserProfileType);
      setOrders(ordersData as OrderData[]);
    } catch {
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-bg2" />
          <div className="h-5 w-32 animate-pulse rounded bg-bg2" />
        </div>
        <div className="flex flex-col items-center px-4 py-8">
          <div className="h-20 w-20 animate-pulse rounded-full bg-bg2" />
          <div className="mt-3 h-5 w-32 animate-pulse rounded bg-bg2" />
          <div className="mt-1 h-4 w-20 animate-pulse rounded bg-bg2" />
        </div>
        <div className="space-y-4 px-4">
          <div className="h-4 w-16 animate-pulse rounded bg-bg2" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-bg2" />
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-3 px-4">
          <div className="h-4 w-24 animate-pulse rounded bg-bg2" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-bg2" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-red-500">{error || "User not found"}</p>
          <button
            onClick={fetchData}
            className="rounded-lg bg-brand px-4 py-2 text-sm text-white hover:bg-brand/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.name || user.email);
  const color = getAvatarColor(user.name || "", user.email);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 hover:text-ink transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-ink">User Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col items-center border-b border-line px-4 py-8">
          <div className={cn("flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white", color)}>
            {initials}
          </div>
          <h2 className="mt-3 text-lg font-semibold text-ink">{user.name || "Unnamed"}</h2>
          <p className="text-sm text-ink-3">Customer</p>
        </div>

        <div className="border-b border-line px-4 py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-3">Contact</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-ink-3" />
              <a href={`mailto:${user.email}`} className="text-brand hover:underline">
                {user.email}
              </a>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-ink-3" />
                <a href={`tel:${user.phone}`} className="text-brand hover:underline">
                  {user.phone}
                </a>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-ink-2">
              <Calendar className="h-4 w-4 text-ink-3" />
              <span>Joined {formatTime(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="mb-3 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-ink-3" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-3">Order History</h3>
            <span className="text-xs text-ink-3">({orders.length})</span>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Package className="h-8 w-8 text-ink-3" />
              <p className="mt-2 text-sm text-ink-3">No orders yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-line bg-white p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink">{order.orderNumber}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  {order.items.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt=""
                              className="h-10 w-10 flex-shrink-0 rounded-lg bg-bg2 object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-ink">{item.name}</p>
                            <p className="text-xs text-ink-3">
                              x{item.quantity} &middot; {item.unitPrice} {order.currency}
                            </p>
                          </div>
                          <span className="flex-shrink-0 text-sm font-medium text-ink">
                            {item.totalPrice} {order.currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
                    <span className="text-xs text-ink-3">{formatTime(order.createdAt)}</span>
                    <span className="text-sm font-bold text-ink">
                      Total: {order.total} {order.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-cyan-100 text-cyan-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    RETURNED: "bg-orange-100 text-orange-700",
    REFUNDED: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", colors[status] || "bg-gray-100 text-gray-700")}>
      {status}
    </span>
  );
}
