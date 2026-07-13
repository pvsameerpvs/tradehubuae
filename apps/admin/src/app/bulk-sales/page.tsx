"use client";

import { useState, useEffect } from "react";
import { api, type PaginatedResponse } from "@/lib/api";
import { Building2, CheckCircle2, Clock, XCircle } from "lucide-react";

interface BulkRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  status: string;
  items: { productId: string; quantity: number }[];
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  quoted: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export default function BulkSalesPage() {
  const [data, setData] = useState<PaginatedResponse<BulkRequest> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<BulkRequest>>("/bulk-sales", { limit: 50, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load requests"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Bulk Sales</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage bulk purchase requests from businesses</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <Building2 className="mx-auto h-8 w-8 text-ink-3" strokeWidth={1.5} />
            <p className="mt-2 text-sm font-medium text-ink-2">No bulk requests yet</p>
            <p className="mt-0.5 text-xs text-ink-3">Bulk purchase requests from businesses will appear here.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((req) => (
                <div key={req.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{req.companyName}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[req.status] ?? "bg-bg2 text-ink-3"}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-3">{req.contactName} · {req.email}</p>
                  <p className="mt-1 text-xs text-ink-3">{req.items?.length ?? 0} items · {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((req) => (
                  <tr key={req.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4 text-sm font-medium text-ink">{req.companyName}</td>
                    <td className="p-4">
                      <p className="text-sm text-ink">{req.contactName}</p>
                      <p className="text-xs text-ink-3">{req.email}</p>
                    </td>
                    <td className="p-4 text-sm text-ink">{req.items?.length ?? 0}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[req.status] ?? "bg-bg2 text-ink-3"}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ink-2">
                      {new Date(req.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
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
