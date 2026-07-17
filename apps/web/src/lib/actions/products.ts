"use server";

import { api } from "@/lib/api";

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description?: string;
  category?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string; slug: string } | null;
  images?: { url: string; alt?: string }[];
  specs?: { label: string; value: string }[];
  sku?: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  isActive?: boolean;
  badge?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  use?: string;
  search?: string;
  sort?: string;
  order?: string;
}): Promise<PaginatedResponse<ProductData>> {
  return api.get<PaginatedResponse<ProductData>>("/products", { isActive: true, ...params } as Record<string, string | number | boolean | undefined>);
}

export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  try {
    return await api.get<ProductData>(`/products/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function searchProducts(query: string, params?: {
  limit?: number;
  category?: string;
}): Promise<ProductData[]> {
  try {
    const res = await api.get<PaginatedResponse<ProductData>>("/products/search", {
      q: query,
      ...(params as Record<string, string | number | boolean | undefined>),
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}
