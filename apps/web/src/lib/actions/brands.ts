"use server";

import { api } from "@/lib/api";

export interface BrandData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  sortOrder?: number;
  productCount?: number;
}

export async function getBrands(): Promise<BrandData[]> {
  try {
    const res = await api.get<{ data: BrandData[] }>("/brands");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getBrandById(id: string): Promise<BrandData | null> {
  try {
    return await api.get<BrandData>(`/brands/${id}`);
  } catch {
    return null;
  }
}
