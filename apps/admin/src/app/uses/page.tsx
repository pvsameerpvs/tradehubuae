"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type PaginatedResponse } from "@/lib/api";

interface UseItem {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  createdAt: string;
  _count: { products: number };
}

export default function UsesPage() {
  const [data, setData] = useState<PaginatedResponse<UseItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<UseItem>>("/uses", { limit: 100, sort: "name", order: "asc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load uses"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Uses</h1>
        <Link
          href="/uses/new"
          className="inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:h-10 sm:px-6"
        >
          Add Use
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No uses yet</p>
            <p className="mt-1 text-xs text-ink-3">Create your first use category to get started.</p>
            <Link href="/uses/new" className="mt-4 inline-flex h-9 items-center rounded-lg bg-brand px-4 text-xs font-semibold text-white hover:bg-brand-dark">
              Add Use
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg2">
                      {item.image ? (
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-ink-3">{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{item.name}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-3">
                        <span>/{item.slug}</span>
                        <span>·</span>
                        <span>{item._count.products} products</span>
                      </div>
                    </div>
                    <Link href={`/uses/${item.id}`} className="shrink-0 text-xs font-semibold text-brand">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Slug</th>
                  <th className="p-4 font-medium">Products</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg2">
                          {item.image ? (
                            <img src={item.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-ink-3">{item.name.charAt(0)}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-ink">{item.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-ink-2">/{item.slug}</td>
                    <td className="p-4 text-sm text-ink">{item._count.products}</td>
                    <td className="p-4">
                      <Link href={`/uses/${item.id}`} className="text-sm font-semibold text-brand hover:underline">
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
