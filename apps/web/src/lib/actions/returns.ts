"use server";

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function requestReturn(orderId: string, reason: string, notes?: string) {
  try {
    const res = await fetch(`${API_BASE}/returns/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, notes }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Failed to request return" }));
      throw new Error(err.message ?? "Failed to request return");
    }

    return res.json();
  } catch (e) {
    console.error("[requestReturn] Failed:", e);
    throw e;
  }
}

export async function checkReturnEligibility(orderId: string) {
  try {
    const [order] = await sql`
      SELECT status, delivered_at FROM sales.orders WHERE id = ${orderId}
    `;
    if (!order) return { eligible: false, reason: "Order not found" };
    if (order.status !== "DELIVERED") return { eligible: false, reason: "Order must be delivered" };

    const [existing] = await sql`
      SELECT id FROM sales.returns WHERE order_id = ${orderId} AND status != 'REJECTED' LIMIT 1
    `;
    if (existing) return { eligible: false, reason: "Return already requested" };

    if (order.delivered_at) {
      const daysSince = Math.floor(
        (Date.now() - new Date(order.delivered_at).getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysSince > 7) return { eligible: false, reason: "7-day return window has expired" };
    }

    return { eligible: true, reason: null };
  } catch {
    return { eligible: false, reason: "Could not verify eligibility" };
  }
}
