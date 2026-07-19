"use server";

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export async function getMyOrdersFromSupabase(userId: string) {
  try {
    const rows = await sql`
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'name', oi.name,
              'sku', oi.sku,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'total_price', oi.total_price,
              'image', oi.image
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as order_items
      FROM sales.orders o
      LEFT JOIN sales.order_items oi ON oi.order_id = o.id
      WHERE o.user_id = ${userId}
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    return rows || [];
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load orders";
    throw new Error(msg);
  }
}

export async function updateOrderStatusFromSupabase(orderId: string, status: string) {
  await sql`UPDATE sales.orders SET status = ${status} WHERE id = ${orderId}`;
}
