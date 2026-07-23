"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type PaginatedResponse } from "@/lib/api";

interface ComboOffer {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  image: string | null;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  _count: { items: number };
}

export default function ComboOffersPage() {
  const [data, setData] = useState<PaginatedResponse<ComboOffer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<ComboOffer>>("/combo-offers", { limit: 100, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load combo offers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Combo Offers</h1>
        <Link
          href="/combo-offers/new"
          className="inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:h-10 sm:px-6"
        >
          Add Offer
        </Link>
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
            <p className="text-sm font-medium text-ink-2">No combo offers yet</p>
            <p className="mt-1 text-xs text-ink-3">Create your first combo offer to get started.</p>
            <Link href="/combo-offers/new" className="mt-4 inline-flex h-9 items-center rounded-lg bg-brand px-4 text-xs font-semibold text-white hover:bg-brand-dark">
              Add Offer
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((offer) => (
                <div key={offer.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-ink">{offer.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      offer.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {offer.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-ink-3">
                    <span className="font-medium text-brand">
                      {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% off` : `AED ${offer.discountValue} off`}
                    </span>
                    <span>·</span>
                    <span>{offer._count.items} items</span>
                    {(offer.startsAt || offer.expiresAt) && (
                      <>
                        <span>·</span>
                        <span>
                          {offer.startsAt ? new Date(offer.startsAt).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}
                          {offer.expiresAt ? ` - ${new Date(offer.expiresAt).toLocaleDateString([], { month: "short", day: "numeric" })}` : ""}
                        </span>
                      </>
                    )}
                  </div>
                  <Link href={`/combo-offers/${offer.id}`} className="mt-1.5 inline-block text-xs font-semibold text-brand">Edit</Link>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Discount</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Period</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((offer) => (
                  <tr key={offer.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <p className="text-sm font-medium text-ink">{offer.name}</p>
                      <p className="text-xs text-ink-3">/{offer.slug}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-brand">
                        {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}%` : `AED ${offer.discountValue}`}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ink">{offer._count.items}</td>
                    <td className="p-4 text-sm text-ink-2">
                      {offer.startsAt ? new Date(offer.startsAt).toLocaleDateString([], { month: "short", day: "numeric" }) : "N/A"}
                      {offer.expiresAt ? ` - ${new Date(offer.expiresAt).toLocaleDateString([], { month: "short", day: "numeric" })}` : ""}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        offer.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}>
                        {offer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/combo-offers/${offer.id}`} className="text-sm font-semibold text-brand hover:underline">
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
