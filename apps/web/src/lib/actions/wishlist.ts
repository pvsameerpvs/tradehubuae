"use server";

import { api } from "@/lib/api";

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
}

export async function getWishlist(): Promise<string[]> {
  try {
    const res = await api.get<{ data: WishlistItem[] }>("/wishlist");
    return res.data.map((item) => item.productId);
  } catch {
    return [];
  }
}

export async function addToWishlist(productId: string): Promise<boolean> {
  try {
    await api.post("/wishlist", { productId });
    return true;
  } catch {
    return false;
  }
}

export async function removeFromWishlist(productId: string): Promise<boolean> {
  try {
    await api.delete(`/wishlist/${encodeURIComponent(productId)}`);
    return true;
  } catch {
    return false;
  }
}
