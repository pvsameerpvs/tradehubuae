"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type PaginatedResponse } from "@/lib/api";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  condition: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  saleCount: number;
  createdAt: string;
  images: ProductImage[];
  brand?: { id: string; name: string; slug: string } | null;
}

export default function ProductsPage() {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<Product>>("/products", { limit: 50, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Products</h1>
        <Link
          href="/products/new"
          className="inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:h-10 sm:px-6"
        >
          Add Product
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-lg font-semibold text-ink">No products yet</p>
            <p className="mt-1 text-sm text-ink-2">Create your first product to get started.</p>
            <Link href="/products/new" className="mt-4 inline-flex h-10 items-center rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
              Add Product
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg2 active:bg-bg3"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg2">
                    {product.images?.[0] ? (
                      <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-ink-3">N/A</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-2">
                      <span>AED {Number(product.price).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-brand">Edit</span>
                  </div>
                </Link>
              ))}
            </div>
            {/* Desktop table */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Condition</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <Link href={`/products/${product.id}`} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg2">
                          {product.images?.[0] ? (
                            <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-ink-3">N/A</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{product.name}</p>
                          <p className="text-xs text-ink-3">{product.brand?.name ?? "—"}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-ink">AED {Number(product.price).toLocaleString()}</p>
                      {product.compareAtPrice && (
                        <p className="text-xs text-ink-3 line-through">AED {Number(product.compareAtPrice).toLocaleString()}</p>
                      )}
                    </td>
                    <td className="p-4 text-sm text-ink-2">{product.condition.replace("_", " ")}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/products/${product.id}`} className="text-sm font-semibold text-brand hover:underline">
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
