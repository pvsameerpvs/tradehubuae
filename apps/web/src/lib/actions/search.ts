"use server";

import { api } from "@/lib/api";
import type { ProductData } from "./products";

export async function searchAll(query: string, limit = 20): Promise<{
  products: ProductData[];
  total: number;
}> {
  try {
    const res = await api.get<{ data: ProductData[]; meta: { total: number } }>(
      "/products/search",
      { q: query, limit },
    );
    return { products: res.data ?? [], total: res.meta?.total ?? 0 };
  } catch {
    return { products: [], total: 0 };
  }
}
