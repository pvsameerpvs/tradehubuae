"use server";

export interface UseData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export async function getUses(): Promise<UseData[]> {
  try {
    const { api } = await import("@/lib/api");
    const res = await api.get<{ data: UseData[] }>("/uses");
    return res.data ?? [];
  } catch (e) {
    console.error("[getUses] Failed:", e);
    return [];
  }
}

export async function getUseBySlug(slug: string): Promise<UseData | null> {
  try {
    const { api } = await import("@/lib/api");
    return await api.get<UseData>(`/uses/${encodeURIComponent(slug)}`);
  } catch (e) {
    console.error(`[getUseBySlug] Failed for ${slug}:`, e);
    return null;
  }
}
