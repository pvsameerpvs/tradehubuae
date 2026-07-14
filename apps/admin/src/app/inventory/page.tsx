"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, Warehouse, Search } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { api, type PaginatedResponse } from "@/lib/api";

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  isActive: boolean;
  brand?: Brand | null;
  categories?: { category: Category }[];
}

export default function InventoryPage() {
  const [data, setData] = useState<PaginatedResponse<InventoryProduct> | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubcategory, setFilterSubcategory] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<PaginatedResponse<InventoryProduct>>("/products", { limit: 200, sort: "availableStock", order: "asc" }),
      api.get<PaginatedResponse<Brand>>("/brands", { limit: 200, sort: "name", order: "asc" }),
      api.get<PaginatedResponse<Category>>("/categories", { limit: 200, sort: "name", order: "asc" }),
    ])
      .then(([productsRes, brandsRes, categoriesRes]) => {
        setData(productsRes);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load inventory"))
      .finally(() => setLoading(false));
  }, []);

  const mainCategories = categories.filter((c) => !c.parentId);
  const subcategories = categories.filter((c) => c.parentId === filterCategory);

  const toggleActive = async (productId: string, current: boolean) => {
    setToggling(productId);
    try {
      await api.put(`/products/${productId}`, { isActive: !current });
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((p) => p.id === productId ? { ...p, isActive: !current } : p),
        };
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setToggling(null);
    }
  };

  const filtered = (data?.data ?? []).filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterBrand && p.brand?.id !== filterBrand) return false;
    if (filterCategory && !p.categories?.some((pc) => pc.category.id === filterCategory)) return false;
    if (filterSubcategory && !p.categories?.some((pc) => pc.category.id === filterSubcategory)) return false;
    if (filterActive === "active" && !p.isActive) return false;
    if (filterActive === "inactive" && p.isActive) return false;
    return true;
  });

  const lowStock = filtered.filter((p) => p.availableStock > 0 && p.availableStock <= 5);
  const outOfStock = filtered.filter((p) => p.availableStock === 0);
  const totalStockItems = filtered.length;

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Inventory</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Monitor stock levels across all products</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-ink-2">Total Products</p>
                <p className="mt-1.5 text-2xl font-semibold text-ink">{loading ? "..." : totalStockItems}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
                <Warehouse className="h-5 w-5 text-brand" strokeWidth={1.75} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-ink-2">Low Stock</p>
                <p className={`mt-1.5 text-2xl font-semibold ${lowStock.length > 0 ? "text-amber-600" : "text-ink"}`}>
                  {loading ? "..." : lowStock.length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-600" strokeWidth={1.75} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-ink-2">Out of Stock</p>
                <p className={`mt-1.5 text-2xl font-semibold ${outOfStock.length > 0 ? "text-sale" : "text-ink"}`}>
                  {loading ? "..." : outOfStock.length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <Package className="h-5 w-5 text-sale" strokeWidth={1.75} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or SKU..."
            className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:w-auto"
        >
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setFilterSubcategory(""); }}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:w-auto"
        >
          <option value="">All Categories</option>
          {mainCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {filterCategory && (
          <select
            value={filterSubcategory}
            onChange={(e) => setFilterSubcategory(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:w-auto"
          >
            <option value="">All Subcategories</option>
            {subcategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:w-auto"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-sale">{error}</div>
      )}

      <Card>
        <div className="px-5 py-4">
          <p className="text-sm font-semibold text-ink">
            Stock Levels
            {filtered.length < (data?.data?.length ?? 0) && (
              <span className="ml-2 text-sm font-normal text-ink-3">({filtered.length} of {data?.data?.length} shown)</span>
            )}
          </p>
        </div>
        <div className="border-t border-line px-0 pb-0">
          {loading ? (
            <div className="p-5 text-sm text-ink-3">Loading...</div>
          ) : !filtered.length ? (
            <div className="p-5 text-center text-sm text-ink-3">
              <p>No products match your filters.</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-line sm:hidden">
                {filtered.slice(0, 50).map((p) => (
                  <div key={p.id} className="px-4 py-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-ink-3">
                          SKU: {p.sku}
                          {p.brand && <span> · {p.brand.name}</span>}
                        </p>
                        <p className="mt-1 text-xs text-ink-3">
                          {p.categories?.map((pc) => pc.category.name).join(", ") ?? "—"}
                        </p>
                      </div>
                      <div className="ml-3 flex flex-col items-end gap-2">
                        <span className={`text-sm font-semibold ${p.availableStock <= 0 ? "text-sale" : p.availableStock <= 5 ? "text-amber-600" : "text-ink"}`}>
                          {p.availableStock}
                        </span>
                        <label className="relative inline-flex cursor-pointer items-center p-1.5 -m-1.5">
                          <input
                            type="checkbox"
                            checked={p.isActive}
                            onChange={() => toggleActive(p.id, p.isActive)}
                            disabled={toggling === p.id}
                            className="peer sr-only"
                          />
                          <div className="h-5 w-9 rounded-full bg-bg3 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand peer-checked:after:translate-x-full" />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden sm:table w-full">
                <thead>
                  <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Brand</th>
                    <th className="p-4 font-medium text-right">Total</th>
                    <th className="p-4 font-medium text-right">Reserved</th>
                    <th className="p-4 font-medium text-right">Available</th>
                    <th className="p-4 font-medium text-center">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 100).map((p) => (
                    <tr key={p.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                      <td className="p-4">
                        <p className="text-sm font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-ink-3">{p.sku}</p>
                      </td>
                      <td className="p-4 text-sm text-ink-2">
                        {p.categories?.map((pc) => pc.category.name).join(", ") ?? "—"}
                      </td>
                      <td className="p-4 text-sm text-ink-2">{p.brand?.name ?? "—"}</td>
                      <td className="p-4 text-right text-sm text-ink">{p.totalStock}</td>
                      <td className="p-4 text-right text-sm text-ink-2">{p.reservedStock}</td>
                      <td className="p-4 text-right">
                        <span className={`text-sm font-semibold ${p.availableStock <= 0 ? "text-sale" : p.availableStock <= 5 ? "text-amber-600" : "text-ink"}`}>
                          {p.availableStock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <label className="relative inline-flex cursor-pointer items-center p-1">
                          <input
                            type="checkbox"
                            checked={p.isActive}
                            onChange={() => toggleActive(p.id, p.isActive)}
                            disabled={toggling === p.id}
                            className="peer sr-only"
                          />
                          <div className="h-5 w-9 rounded-full bg-bg3 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand peer-checked:after:translate-x-full disabled:opacity-50" />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
