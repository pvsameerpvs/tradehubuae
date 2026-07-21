"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type PaginatedResponse } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@tradehubuae/ui";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  parent: { id: string; name: string; slug: string } | null;
  _count: { children: number; products: number };
}

export default function CategoriesPage() {
  const [data, setData] = useState<PaginatedResponse<Category> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      setData((prev) => prev ? { ...prev, data: prev.data.filter((c) => c.id !== deleteTarget.id) } : prev);
      setDeleteTarget(null);
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete category");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    api.get<PaginatedResponse<Category>>("/categories", { limit: 100, sort: "sortOrder", order: "asc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Categories</h1>
        <Link
          href="/categories/new"
          className="inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:h-10 sm:px-6"
        >
          Add Category
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No categories yet</p>
            <p className="mt-1 text-xs text-ink-3">Create your first category to get started.</p>
            <Link href="/categories/new" className="mt-4 inline-flex h-9 items-center rounded-lg bg-brand px-4 text-xs font-semibold text-white hover:bg-brand-dark">
              Add Category
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((cat) => (
                <div key={cat.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{cat.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      cat.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-ink-3">
                    <span>{cat.parent?.name ?? "Root"}</span>
                    <span>·</span>
                    <span>{cat._count.products} products</span>
                    <span>·</span>
                    <span>{cat._count.children} sub</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <Link href={`/categories/${cat.id}`} className="text-xs font-semibold text-brand">Edit</Link>
                    <button onClick={() => setDeleteTarget(cat)} className="text-xs font-semibold text-sale">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Parent</th>
                  <th className="p-4 font-medium">Products</th>
                  <th className="p-4 font-medium">Subcategories</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((cat) => (
                  <tr key={cat.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <p className="text-sm font-medium text-ink">{cat.name}</p>
                      <p className="text-xs text-ink-3">/{cat.slug}</p>
                    </td>
                    <td className="p-4 text-sm text-ink-2">{cat.parent?.name ?? <span className="italic text-ink-3">Root</span>}</td>
                    <td className="p-4 text-sm text-ink">{cat._count.products}</td>
                    <td className="p-4 text-sm text-ink">{cat._count.children}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        cat.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/categories/${cat.id}`} className="text-sm font-semibold text-brand hover:underline">
                          Edit
                        </Link>
                        <button onClick={() => setDeleteTarget(cat)} className="text-sm font-semibold text-sale hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
              {deleteTarget && (
                <span className="mt-2 block text-sm">
                  This category has <strong>{deleteTarget._count.products}</strong> linked product{deleteTarget._count.products !== 1 ? "s" : ""}
                  {deleteTarget._count.children > 0 && <> and <strong>{deleteTarget._count.children}</strong> subcategor{deleteTarget._count.children !== 1 ? "ies" : "y"}</>}.
                  This action cannot be undone.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
