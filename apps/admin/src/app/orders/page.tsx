"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type PaginatedResponse } from "@/lib/api";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  customer: { name: string; email: string } | null;
  items: { id: string }[];
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-violet-50 text-violet-700",
  shipped: "bg-brand/10 text-brand",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-ink-2/10 text-ink-2",
};

export default function OrdersPage() {
  const [data, setData] = useState<PaginatedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<Order>>("/orders", { limit: 50, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Orders</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage incoming and completed orders</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No orders yet</p>
            <p className="mt-1 text-xs text-ink-3">Orders will appear here once customers start purchasing.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((order) => (
                <div key={order.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">#{order.orderNumber}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[order.status] ?? "bg-bg2 text-ink-3"}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-ink-3">
                    <span>{order.customer?.name ?? "Guest"}</span>
                    <span>·</span>
                    <span>AED {Number(order.total).toLocaleString()}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] text-ink-3">
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{order.items?.length ?? 0} items</span>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <p className="text-sm font-medium text-ink">#{order.orderNumber}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-ink">{order.customer?.name ?? "Guest"}</p>
                      {order.customer?.email && <p className="text-xs text-ink-3">{order.customer.email}</p>}
                    </td>
                    <td className="p-4 text-sm text-ink">{order.items?.length ?? 0}</td>
                    <td className="p-4 text-sm font-medium text-ink">AED {Number(order.total).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[order.status] ?? "bg-bg2 text-ink-3"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ink-2">
                      {new Date(order.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
