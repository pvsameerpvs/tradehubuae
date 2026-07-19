"use server";

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
}

export async function getWishlist(userId: string): Promise<string[]> {
  try {
    const rows = await sql`
      SELECT product_id FROM sales.wishlist_items WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return rows.map((r: any) => r.product_id);
  } catch {
    return [];
  }
}

export async function addToWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    await sql`
      INSERT INTO sales.wishlist_items (user_id, product_id) VALUES (${userId}, ${productId})
      ON CONFLICT (user_id, product_id) DO NOTHING
    `;
    return true;
  } catch {
    return false;
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM sales.wishlist_items WHERE user_id = ${userId} AND product_id = ${productId}
    `;
    return true;
  } catch {
    return false;
  }
}
