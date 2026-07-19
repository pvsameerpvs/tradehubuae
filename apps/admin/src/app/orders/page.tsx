"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { api, type PaginatedResponse } from "@/lib/api";

interface OrderReturnInfo {
  id: string;
  status: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: string;
  currency: string;
  contactName: string | null;
  contactPhone: string | null;
  user: { name: string; email: string } | null;
  items: { id: string }[];
  createdAt: string;
  returnInfo: OrderReturnInfo | null;
}

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"];

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-violet-50 text-violet-700 border-violet-200",
  SHIPPED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURNED: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-ink-2/10 text-ink-2 border-ink-2/20",
};

const returnLabel: Record<string, string> = {
  PENDING: "Return Requested",
  APPROVED: "Return Approved",
  REFUNDED: "Refunded",
  REJECTED: "Return Rejected",
};

const returnBadgeStyle: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  REFUNDED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

export default function OrdersPage() {
  const [data, setData] = useState<PaginatedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError(null);
    const params: Record<string, string | number | boolean | undefined> = { limit: 50, page };
    if (statusFilter) params.status = statusFilter;
    if (search) params.search = search;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    api.get<PaginatedResponse<Order>>("/orders", params)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [statusFilter, search, startDate, endDate, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleFilter = () => { setPage(1); fetchOrders(); };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Orders</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage incoming and completed orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-end gap-2 sm:gap-3">
        <div className="w-full sm:w-auto sm:min-w-[140px]">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-3">Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink/30">
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div className="flex-1 sm:min-w-[150px]">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-3">From</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink/30" />
        </div>
        <div className="flex-1 sm:min-w-[150px]">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-3">To</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink/30" />
        </div>
        <div className="w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-3">Search</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order #, name, phone..."
            className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink/30" />
        </div>
        <button onClick={handleFilter}
          className="flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          Filter
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No orders found</p>
            <p className="mt-1 text-xs text-ink-3">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`} className="flex flex-col px-4 py-3 transition-colors hover:bg-bg2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">#{order.orderNumber}</p>
                    <div className="flex items-center gap-1">
                      {order.returnInfo && (
                        <span
                          onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.location.href = `/returns/${order.returnInfo!.id}`; }}
                          className="inline-flex cursor-pointer items-center gap-0.5 rounded-full border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700 hover:bg-rose-100">
                          <RotateCcw className="h-2.5 w-2.5" strokeWidth={2} />
                        </span>
                      )}
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[order.status] ?? "bg-bg2 text-ink-3"}`}>
                        {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-ink-3">
                    <span>{order.user?.name || order.contactName || "Guest"}</span>
                    <span>·</span>
                    <span>AED {Number(order.total).toLocaleString()}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-3">
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{order.items?.length ?? 0} items</span>
                  </div>
                </Link>
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
                  <tr
                    key={order.id}
                    onClick={() => window.location.href = `/orders/${order.id}`}
                    className="cursor-pointer border-b last:border-0 transition-colors hover:bg-bg2"
                  >
                    <td className="p-4">
                      <p className="text-sm font-medium text-ink">#{order.orderNumber}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-ink">{order.user?.name || order.contactName || "Guest"}</p>
                      {(order.user?.email || order.contactPhone) && <p className="text-xs text-ink-3">{order.user?.email || order.contactPhone}</p>}
                    </td>
                    <td className="p-4 text-sm text-ink">{order.items?.length ?? 0}</td>
                    <td className="p-4 text-sm font-medium text-ink">AED {Number(order.total).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[order.status] ?? "bg-bg2 text-ink-3"}`}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </span>
                        {order.returnInfo && (
                          <Link
                            href={`/returns/${order.returnInfo.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-700 transition-colors hover:bg-rose-100"
                          >
                            <RotateCcw className="h-3 w-3" strokeWidth={2} />
                            {returnLabel[order.returnInfo.status]}
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-ink-2">
                      {new Date(order.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
                <span className="text-ink-2">{data.meta.total} order{data.meta.total !== 1 ? "s" : ""}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                    className="rounded-lg border border-line px-3 py-1.5 text-ink transition-colors hover:bg-bg2 disabled:opacity-30">
                    Previous
                  </button>
                  <span className="text-ink-2">Page {page} of {data.meta.totalPages}</span>
                  <button onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))} disabled={page >= data.meta.totalPages}
                    className="rounded-lg border border-line px-3 py-1.5 text-ink transition-colors hover:bg-bg2 disabled:opacity-30">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
