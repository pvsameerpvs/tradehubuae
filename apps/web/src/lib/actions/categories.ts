"use server";

import { api } from "@/lib/api";

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  parentId?: string | null;
  productCount?: number;
  children?: CategoryData[];
}

export async function getCategories(): Promise<CategoryData[]> {
  try {
    const res = await api.get<{ data: CategoryData[] }>("/categories");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getCategoryTree(): Promise<CategoryData[]> {
  try {
    return await api.get<CategoryData[]>("/categories/tree");
  } catch {
    return [];
  }
}

export async function getCategoryById(id: string): Promise<CategoryData | null> {
  try {
    return await api.get<CategoryData>(`/categories/${id}`);
  } catch {
    return null;
  }
}
