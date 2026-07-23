"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Clock, CheckCircle2, XCircle, DollarSign, RotateCcw } from "lucide-react";
import { api, type PaginatedResponse } from "@/lib/api";

interface ReturnItem {
  id: string;
  orderId: string;
  reason: string;
  status: string;
  refundAmount: string | null;
  notes: string | null;
  items: unknown;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
  orderStatus: string;
  contactName: string | null;
  total: string;
}

const RETURN_STATUSES = ["PENDING", "APPROVED", "REJECTED", "REFUNDED"];

const statusConfig: Record<string, { label: string; desc: string; icon: typeof Clock; color: string }> = {
  PENDING: { label: "Pending Review", desc: "Awaiting admin decision", icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200" },
  APPROVED: { label: "Approved", desc: "Stock restored, awaiting refund", icon: CheckCircle2, color: "bg-blue-50 text-blue-700 border-blue-200" },
  REJECTED: { label: "Rejected", desc: "Return request declined", icon: XCircle, color: "bg-red-50 text-red-700 border-red-200" },
  REFUNDED: { label: "Refunded", desc: "Refund completed", icon: DollarSign, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const orderStatusColor: Record<string, string> = {
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RETURNED: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function ReturnsPage() {
  const [data, setData] = useState<PaginatedResponse<ReturnItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchReturns = useCallback(() => {
    setLoading(true);
    setError(null);
    const params: Record<string, string | number | boolean | undefined> = { limit: 50, page };
    if (statusFilter) params.status = statusFilter;
    if (search) params.search = search;
    api.get<PaginatedResponse<ReturnItem>>("/returns", params)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load returns"))
      .finally(() => setLoading(false));
  }, [statusFilter, search, page]);

  useEffect(() => { fetchReturns(); }, [fetchReturns]);

  const handleFilter = () => { setPage(1); fetchReturns(); };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Returns</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage customer return requests and refunds</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-2 sm:gap-3">
        <div className="w-full sm:w-auto sm:min-w-[140px]">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-3">Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink/30">
            <option value="">All</option>
            {RETURN_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-3">Search</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order number..."
            className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink/30" />
        </div>
        <button onClick={handleFilter}
          className="flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          Filter
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-bg2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-bg2" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-bg2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No returns found</p>
            <p className="mt-1 text-xs text-ink-3">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((ret) => {
                const sc = statusConfig[ret.status];
                const StatusIcon = sc?.icon || RotateCcw;
                return (
                  <Link key={ret.id} href={`/returns/${ret.id}`} className="flex flex-col px-4 py-3 transition-colors hover:bg-bg2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ink">#{ret.orderNumber}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${sc?.color || "bg-bg2 text-ink-3"}`}>
                        <StatusIcon className="h-3 w-3" strokeWidth={2} />
                        {sc?.label || ret.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-ink-3">
                      <span className="line-clamp-1">{ret.contactName || "N/A"}</span>
                      <span>·</span>
                      <span className="text-xs">{ret.reason}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-3">
                      <span>{new Date(ret.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="capitalize">Order: {ret.orderStatus.toLowerCase()}</span>
                      {ret.refundAmount && <><span>·</span><span>AED {Number(ret.refundAmount).toLocaleString()}</span></>}
                    </div>
                  </Link>
                );
              })}
            </div>
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Return Status</th>
                  <th className="p-4 font-medium">Order Status</th>
                  <th className="p-4 font-medium">Refund</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((ret) => {
                  const sc = statusConfig[ret.status];
                  const StatusIcon = sc?.icon || RotateCcw;
                  const osColor = orderStatusColor[ret.orderStatus] || "bg-bg2 text-ink-3 border-line";
                  return (
                    <tr
                      key={ret.id}
                      onClick={() => window.location.href = `/returns/${ret.id}`}
                      className="cursor-pointer border-b last:border-0 transition-colors hover:bg-bg2"
                    >
                      <td className="p-4">
                        <p className="text-sm font-medium text-ink">#{ret.orderNumber}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-ink">{ret.contactName || "N/A"}</p>
                        <p className="text-xs text-ink-3">{ret.reason}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${sc?.color || "bg-bg2 text-ink-3"}`}>
                          <StatusIcon className="h-3 w-3" strokeWidth={2} />
                          {sc?.label || ret.status}
                        </span>
                        <p className="mt-0.5 text-[10px] text-ink-3">{sc?.desc || ""}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${osColor}`}>
                          {ret.orderStatus.charAt(0) + ret.orderStatus.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-ink">
                        {ret.refundAmount ? `AED ${Number(ret.refundAmount).toLocaleString()}` : "—"}
                      </td>
                      <td className="p-4 text-sm text-ink-2">
                        {new Date(ret.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
                <span className="text-ink-2">{data.meta.total} return{data.meta.total !== 1 ? "s" : ""}</span>
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
