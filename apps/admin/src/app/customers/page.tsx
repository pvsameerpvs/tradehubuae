"use client";

import { useState, useEffect } from "react";
import { api, type PaginatedResponse } from "@/lib/api";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function CustomersPage() {
  const [data, setData] = useState<PaginatedResponse<Customer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<Customer>>("/customers", { limit: 50, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Customers</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">View and manage your customer base</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No customers yet</p>
            <p className="mt-1 text-xs text-ink-3">Customers will appear once they create accounts.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((c) => (
                <div key={c.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                      <span className="text-xs font-bold text-brand">{c.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                      <p className="truncate text-xs text-ink-3">{c.email}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-ink-3">
                    <span>{c.orderCount} orders</span>
                    <span>·</span>
                    <span>AED {Number(c.totalSpent).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Orders</th>
                  <th className="p-4 font-medium">Total Spent</th>
                  <th className="p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                          <span className="text-xs font-bold text-brand">{c.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{c.name}</p>
                          <p className="text-xs text-ink-3">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-ink-2">{c.phone ?? "—"}</td>
                    <td className="p-4 text-sm text-ink">{c.orderCount}</td>
                    <td className="p-4 text-sm font-medium text-ink">AED {Number(c.totalSpent).toLocaleString()}</td>
                    <td className="p-4 text-sm text-ink-2">
                      {new Date(c.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
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
