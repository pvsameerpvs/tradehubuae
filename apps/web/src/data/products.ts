import { getProducts, getProductBySlug, searchProducts as searchProductsApi } from "@/lib/actions/products";
import type { ProductData } from "@/lib/actions/products";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  categoryName: string;
  categorySlug: string;
  slug: string;
  badge?: string;
  inStock?: boolean;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  specs?: string;
  gpu?: string;
  detailedSpecs?: ProductSpec[];
  image?: string;
  images?: { url: string; alt?: string }[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface CompareSpec {
  label: string;
  getValue: (p: Product) => string;
}

function toProduct(data: ProductData): Product {
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    originalPrice: data.originalPrice,
    categoryName: data.category?.name ?? "",
    categorySlug: data.category?.slug ?? "",
    slug: data.slug,
    badge: data.badge,
    inStock: (data.stock ?? 0) > 0,
    stock: data.stock,
    rating: data.rating,
    reviewCount: data.reviewCount,
    specs: data.specs?.map((s) => `${s.label}: ${s.value}`).join(" · "),
    detailedSpecs: data.specs,
    image: data.images?.[0]?.url,
    images: data.images,
  };
}

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  use?: string;
  search?: string;
  sort?: string;
  order?: string;
}): Promise<{ products: Product[]; total: number; totalPages: number }> {
  try {
    const res = await getProducts(params);
    return {
      products: res.data.map(toProduct),
      total: res.meta.total,
      totalPages: res.meta.totalPages,
    };
  } catch (e) {
    console.error("[fetchProducts] Failed:", e);
    return { products: [], total: 0, totalPages: 0 };
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await getProductBySlug(slug);
    return data ? toProduct(data) : null;
  } catch (e) {
    console.error(`[fetchProductBySlug] Failed for ${slug}:`, e);
    return null;
  }
}

export async function searchProducts(
  query: string,
  params?: { limit?: number; category?: string },
): Promise<Product[]> {
  try {
    const results = await searchProductsApi(query, params);
    return results.map(toProduct);
  } catch (e) {
    console.error("[searchProducts] Failed:", e);
    return [];
  }
}

export const defaultSpecs: ProductSpec[] = [];

export const compareSpecs: CompareSpec[] = [];

export async function fetchWishlistItems(slugs: string[]): Promise<Product[]> {
  if (!slugs.length) return [];
  try {
    const res = await getProducts({ limit: 50 });
    const slugSet = new Set(slugs);
    return res.data.filter((p) => slugSet.has(p.slug)).map(toProduct);
  } catch (e) {
    console.error("[fetchWishlistItems] Failed:", e);
    return [];
  }
}
