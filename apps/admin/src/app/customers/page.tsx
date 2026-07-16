"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, type PaginatedResponse } from "@/lib/api";
import { Search, Users, ChevronRight, Loader2 } from "lucide-react";
import { Input, Button } from "@tradehubuae/ui";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  _count: { orders: number };
}

export default function CustomersPage() {
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse<Customer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = useCallback((q?: string) => {
    setLoading(true);
    setError(null);
    const params: Record<string, string | number | boolean | undefined> = { limit: 50 };
    if (q) params.q = q;
    api.get<PaginatedResponse<Customer>>("/customers", params)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(search || undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Customers</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">View and manage your customer base</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-10 text-sm"
        />
      </form>

      {error && (
        <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-ink-3" />
        </div>
      ) : !data?.data.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-line py-20">
          <Users className="mb-3 h-10 w-10 text-ink-3" strokeWidth={1} />
          <p className="text-sm font-medium text-ink-2">No customers found</p>
          <p className="mt-1 text-xs text-ink-3">Customers will appear once they register.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink-2">{data.meta.total} customer(s)</p>
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-bg2/50 text-left text-xs font-semibold uppercase tracking-wider text-ink-3">
                  <th className="px-4 py-3 sm:px-5">Customer</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Contact</th>
                  <th className="hidden px-4 py-3 md:table-cell">Orders</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.data.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => router.push(`/customers/${customer.id}`)}
                    className="cursor-pointer transition-colors hover:bg-bg2/50"
                  >
                    <td className="px-4 py-3.5 sm:px-5">
                      <p className="font-medium text-ink">{customer.name || "Unnamed"}</p>
                      <p className="text-xs text-ink-3 sm:hidden">{customer.email}</p>
                    </td>
                    <td className="hidden px-4 py-3.5 sm:table-cell">
                      <p className="text-ink">{customer.email}</p>
                      {customer.phone && <p className="text-xs text-ink-3">{customer.phone}</p>}
                    </td>
                    <td className="hidden px-4 py-3.5 md:table-cell">
                      <span className="font-medium text-ink">{customer._count.orders}</span>
                    </td>
                    <td className="hidden px-4 py-3.5 lg:table-cell">
                      <span className="text-ink-2">
                        {new Date(customer.createdAt).toLocaleDateString("en-AE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          customer.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
