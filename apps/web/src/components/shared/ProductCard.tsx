import Link from "next/link";
import { Badge, Button } from "@tradehubuae/ui";
import { ImageIcon } from "@/components/icons";
import type { Product } from "@/data";

const badgeVariant: Record<string, "default" | "warning" | "success" | "destructive"> = {
  "Best Seller": "success",
  New: "default",
  Popular: "warning",
  "Out of Stock": "destructive",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-xl border bg-card shadow-sm transition hover:shadow-md"
    >
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        {product.badge && (
          <Badge variant={badgeVariant[product.badge] ?? "default"} className="absolute left-3 top-3">
            {product.badge}
          </Badge>
        )}
        <ImageIcon className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 font-medium group-hover:text-primary">{product.name}</h3>
        <p className="mt-2 font-semibold text-primary">AED {product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

export function WishlistCard({ item, onToggle }: { item: Product; onToggle?: () => void }) {
  return (
    <div className="group relative rounded-xl border bg-card shadow-sm transition hover:shadow-md">
      <div className="flex aspect-square items-center justify-center bg-muted">
        <ImageIcon className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
      </div>
      <button
        onClick={onToggle}
        className="absolute right-3 top-3 rounded-full bg-background p-1.5 shadow-sm"
      >
        <svg className="h-4 w-4 fill-destructive text-destructive" viewBox="0 0 24 24">
          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>
      <div className="p-4">
        {!item.inStock && <Badge variant="destructive" className="mb-2">Out of Stock</Badge>}
        <Link href={`/products/${item.slug}`}>
          <h3 className="font-medium transition-colors hover:text-primary">{item.name}</h3>
        </Link>
        <p className="mt-1 font-semibold text-primary">AED {item.price.toLocaleString()}</p>
        <Button className="mt-3 w-full" size="sm" disabled={!item.inStock}>
          {item.inStock ? "Add to Cart" : "Notify Me"}
        </Button>
      </div>
    </div>
  );
}
