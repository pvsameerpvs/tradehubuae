import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/products/new"
          className="h-10 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground inline-flex items-center hover:bg-primary/90"
        >
          Add Product
        </Link>
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="p-6">
          <p className="text-muted-foreground">Product management table will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
