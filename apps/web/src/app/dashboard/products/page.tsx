"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, Plus, Search } from "lucide-react";
import { Button, Input, Badge } from "@tradehubuae/ui";
import { toast } from "sonner";
import { getProducts, deleteProduct, type ProductData } from "@/lib/actions/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 100, search: search || undefined });
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmed) return;

    const result = await deleteProduct(id);
    if (result.success) {
      toast.success(result.message);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">Products</h1>
          <p className="mt-1 text-sm text-ink-2">Manage your product catalog</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        {loading ? (
          <div className="space-y-0">
            <div className="border-b border-line bg-bg2 px-5 py-3">
              <div className="flex gap-4">
                <div className="h-4 w-24 animate-pulse rounded bg-ink-3/20" />
                <div className="h-4 w-16 animate-pulse rounded bg-ink-3/20" />
                <div className="h-4 w-16 animate-pulse rounded bg-ink-3/20" />
                <div className="h-4 w-16 animate-pulse rounded bg-ink-3/20" />
                <div className="h-4 w-16 animate-pulse rounded bg-ink-3/20" />
              </div>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-line px-5 py-4">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-bg2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-bg2" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-bg2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2">
              <Search className="h-7 w-7 text-ink-3" strokeWidth={1} />
            </div>
            <p className="text-sm text-ink-2">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-bg2">
                  <th className="px-5 py-3 font-medium text-ink-2">Name</th>
                  <th className="px-5 py-3 font-medium text-ink-2">SKU</th>
                  <th className="px-5 py-3 font-medium text-ink-2">Price</th>
                  <th className="px-5 py-3 font-medium text-ink-2">Stock</th>
                  <th className="px-5 py-3 font-medium text-ink-2">Status</th>
                  <th className="px-5 py-3 font-medium text-ink-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-bg2/50">
                    <td className="max-w-[250px] px-5 py-4">
                      <p className="truncate font-medium text-ink">{product.name}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-2">{product.sku ?? "—"}</td>
                    <td className="px-5 py-4 font-medium text-ink">
                      AED {product.price.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-ink-2">{product.stock ?? "—"}</td>
                    <td className="px-5 py-4">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-sale hover:bg-sale/10 hover:text-sale"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
