"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type PaginatedResponse } from "@/lib/api";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  _count: { products: number };
}

export default function BrandsPage() {
  const [data, setData] = useState<PaginatedResponse<Brand> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<Brand>>("/brands", { limit: 100, sort: "sortOrder", order: "asc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load brands"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Brands</h1>
        <Link
          href="/brands/new"
          className="inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:h-10 sm:px-6"
        >
          Add Brand
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No brands yet</p>
            <p className="mt-1 text-xs text-ink-3">Create your first brand to get started.</p>
            <Link href="/brands/new" className="mt-4 inline-flex h-9 items-center rounded-lg bg-brand px-4 text-xs font-semibold text-white hover:bg-brand-dark">
              Add Brand
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((brand) => (
                <div key={brand.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg2">
                    {brand.logo ? (
                      <img src={brand.logo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-ink-3">{brand.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-ink">{brand.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        brand.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}>
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-3">
                      <span>{brand._count.products} products</span>
                      {brand.website && (
                        <>
                          <span>·</span>
                          <span>{(() => { try { return new URL(brand.website).hostname; } catch { return brand.website; } })()}</span>
                        </>
                      )}
                    </div>
                    <Link href={`/brands/${brand.id}`} className="mt-1 inline-block text-xs font-semibold text-brand">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Products</th>
                  <th className="p-4 font-medium">Website</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((brand) => (
                  <tr key={brand.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg2">
                          {brand.logo ? (
                            <img src={brand.logo} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-ink-3">{brand.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{brand.name}</p>
                          <p className="text-xs text-ink-3">/{brand.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-ink">{brand._count.products}</td>
                    <td className="p-4 text-sm text-ink-2">
                      {brand.website ? (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                          {(() => { try { return new URL(brand.website).hostname; } catch { return brand.website; } })()}
                        </a>
                      ) : (
                        <span className="italic text-ink-3">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        brand.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}>
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/brands/${brand.id}`} className="text-sm font-semibold text-brand hover:underline">
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
