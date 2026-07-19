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

export async function getMyReturns(userId: string) {
  try {
    const rows = await sql`
      SELECT r.id, r.order_id, r.status, r.reason, r.refund_amount, r.created_at, r.updated_at
      FROM sales.returns r
      JOIN sales.orders o ON o.id = r.order_id
      WHERE o.user_id = ${userId}
      ORDER BY r.created_at DESC
    `;
    return rows || [];
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load returns";
    throw new Error(msg);
  }
}

export async function updateOrderStatusFromSupabase(orderId: string, status: string) {
  if (status === "CANCELLED") {
    const [order] = await sql`SELECT status FROM sales.orders WHERE id = ${orderId}`;
    if (!order) throw new Error("Order not found");
    if (order.status !== "PENDING") {
      throw new Error("Only pending orders can be cancelled");
    }
  }
  await sql`UPDATE sales.orders SET status = ${status} WHERE id = ${orderId}`;
}
