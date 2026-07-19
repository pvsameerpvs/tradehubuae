import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "../product-form";
import { BarcodeLabel } from "@/components/shared/BarcodeLabel";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <Link href="/products" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back to Products
      </Link>
      <h1 className="mb-6 text-lg font-semibold text-ink sm:mb-8 sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Edit Product</h1>
      <div className="space-y-6">
        <div className="rounded-xl border border-line bg-white">
          <div className="p-4 sm:p-6">
            <ProductForm id={id} />
          </div>
        </div>
        {product && (
          <BarcodeLabel
            value={product.barcode || product.sku}
            sku={product.sku}
            price={Number(product.price)}
            productName={product.name}
          />
        )}
      </div>
    </div>
  );
}
