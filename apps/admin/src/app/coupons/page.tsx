"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type PaginatedResponse } from "@/lib/api";

interface CouponItem {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  isActive: boolean;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
  createdAt: string;
}

export default function CouponsPage() {
  const [data, setData] = useState<PaginatedResponse<CouponItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<CouponItem>>("/coupons", { limit: 100, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load coupons"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Promo Codes</h1>
        <Link
          href="/coupons/new"
          className="inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:h-10 sm:px-6"
        >
          Add Code
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No promo codes yet</p>
            <p className="mt-1 text-xs text-ink-3">Create your first promo code to get started.</p>
            <Link href="/coupons/new" className="mt-4 inline-flex h-9 items-center rounded-lg bg-brand px-4 text-xs font-semibold text-white hover:bg-brand-dark">
              Add Code
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink">{item.code}</p>
                        {!item.isActive && (
                          <span className="rounded bg-sale/10 px-1.5 py-0.5 text-[10px] font-semibold text-sale">Inactive</span>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-0.5 truncate text-xs text-ink-3">{item.description}</p>
                      )}
                      <p className="mt-0.5 text-xs text-ink-2">
                        {item.type === "percentage" ? `${item.value}%` : `AED ${item.value}`}
                        {item.usageLimit ? ` · ${item.usedCount}/${item.usageLimit} used` : ""}
                      </p>
                    </div>
                    <Link href={`/coupons/${item.id}`} className="shrink-0 text-xs font-semibold text-brand">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Code</th>
                  <th className="p-4 font-medium">Discount</th>
                  <th className="p-4 font-medium">Usage</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Expires</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.code}</p>
                        {item.description && (
                          <p className="mt-0.5 text-xs text-ink-3">{item.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-ink">
                      {item.type === "percentage" ? `${item.value}%` : `AED ${item.value}`}
                    </td>
                    <td className="p-4 text-sm text-ink-2">
                      {item.usageLimit ? `${item.usedCount}/${item.usageLimit}` : `${item.usedCount} used`}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        item.isActive ? "bg-green/10 text-green" : "bg-sale/10 text-sale"
                      }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ink-2">
                      {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4">
                      <Link href={`/coupons/${item.id}`} className="text-sm font-semibold text-brand hover:underline">
                        Edit
                      </Link>
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
