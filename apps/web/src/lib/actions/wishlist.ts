"use server";

const WISHLIST_KEY = "tradehub_wishlist";

export async function getWishlist(): Promise<string[]> {
  return [];
}

export async function addToWishlist(productId: string): Promise<void> {
}

export async function removeFromWishlist(productId: string): Promise<void> {
}

export async function isInWishlist(productId: string): Promise<boolean> {
  return false;
}
