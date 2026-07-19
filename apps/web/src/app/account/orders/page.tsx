"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, AlertCircle, RefreshCw, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@tradehubuae/ui";
import { useAuth } from "@/lib/supabase/provider";
import { orderStatusColor, formatStatus, ORDER_STATUS_FLOW, ORDER_TERMINAL_STATUSES } from "@/data";
import { getMyOrdersFromSupabase, updateOrderStatusFromSupabase } from "@/lib/actions/orders-supabase";

const CANCELLABLE_STATUSES = ORDER_STATUS_FLOW.slice(0, -1);
const PAGE_SIZE = 10;

function OrderStatusTimeline({ status }: { status: string }) {
  if (ORDER_TERMINAL_STATUSES.includes(status as any)) {
    return <div className="flex items-center gap-2 rounded-lg bg-sale/5 px-3 py-2"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sale/10"><Package className="h-3.5 w-3.5 text-sale" strokeWidth={2.5} /></div><span className="text-sm font-medium text-sale">{formatStatus(status)}</span></div>;
  }
  const currentIdx = ORDER_STATUS_FLOW.indexOf(status as any);
  return <div className="space-y-0">{ORDER_STATUS_FLOW.map((step, i) => {
    const isCompleted = i <= currentIdx;
    const isCurrent = i === currentIdx;
    return <div key={step} className="flex items-start gap-3"><div className="flex flex-col items-center"><div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isCompleted ? "border-brand bg-brand text-white" : "border-ink-3 bg-white text-ink-3"}`}>{isCompleted && <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}</div>{i < ORDER_STATUS_FLOW.length - 1 && <div className={`h-4 w-0.5 ${isCompleted ? "bg-brand" : "bg-line"}`} />}</div><div className={`pb-3 text-sm ${isCompleted ? "font-medium text-ink" : "text-ink-3"}`}>{formatStatus(step)}{isCurrent && <span className="ml-1.5 inline-flex items-center rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">Current</span>}</div></div>;
  })}</div>;
}

function CancelDialog({ order, open, onOpenChange, onConfirm, loading }: { order: any; open: boolean; onOpenChange: (v: boolean) => void; onConfirm: () => void; loading: boolean }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-[400px]"><DialogHeader><DialogTitle>Cancel Order</DialogTitle><DialogDescription>Are you sure you want to cancel order <span className="font-semibold text-ink">{order?.orderNumber}</span>? This action cannot be undone.</DialogDescription></DialogHeader><div className="rounded-lg border border-line bg-bg2/50 px-4 py-3"><p className="text-sm text-ink-2"><span className="font-medium text-ink">Items:</span> {order?.items?.map((i: any) => `${i.name} × ${i.quantity}`).join(", ")}</p><p className="mt-1 text-sm text-ink-2"><span className="font-medium text-ink">Total:</span> AED {Number(order?.total || 0).toLocaleString()}</p></div><DialogFooter className="gap-2 sm:gap-0"><Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Keep Order</Button><Button variant="destructive" onClick={onConfirm} disabled={loading}>{loading ? "Cancelling..." : "Yes, Cancel Order"}</Button></DialogFooter></DialogContent></Dialog>;
}

function OrderCard({ order, onCancel, cancelling }: any) {
  const isCancellable = CANCELLABLE_STATUSES.includes(order.status);
  return <div className="rounded-xl border border-line bg-white p-4 shadow-sm transition-all hover:shadow-card sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0 flex-1"><Link href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`} className="text-sm font-semibold text-ink transition-colors hover:text-brand sm:text-base">{order.orderNumber}</Link><p className="mt-0.5 text-xs text-ink-2 sm:text-sm">{new Date(order.createdAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })} · {order.items.reduce((s: number, i: any) => s + i.quantity, 0)} item(s)</p></div>
      <Badge variant={orderStatusColor[order.status] || "default"} className="shrink-0 text-xs">{formatStatus(order.status)}</Badge>
    </div>
    <div className="mt-4"><OrderStatusTimeline status={order.status} /></div>
    <div className="mt-3 flex flex-wrap gap-1.5">{order.items.map((item: any, i: number) => <span key={i} className="inline-flex items-center rounded-md bg-bg2 px-2 py-1 text-xs text-ink-2">{item.name} × {item.quantity}</span>)}</div>
    <hr className="my-3 border-line" />
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-base font-bold text-ink sm:text-lg">AED {Number(order.total).toLocaleString()}</p>
      <div className="flex items-center gap-2">
        <Link href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}><Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm">View Details <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} /></Button></Link>
        {isCancellable && <Button variant="destructive" size="sm" className="text-xs sm:text-sm" onClick={() => onCancel(order)} disabled={cancelling}>Cancel</Button>}
      </div>
    </div>
  </div>;
}

export default function AccountOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [page, setPage] = useState(1);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrdersFromSupabase(user.id);
      setOrders((data || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number,
        status: o.status,
        contactName: o.contact_name,
        contactPhone: o.contact_phone,
        total: Number(o.total),
        subtotal: Number(o.subtotal),
        shippingCost: Number(o.shipping_cost),
        paymentMethod: o.payment_method,
        shippingMethod: o.shipping_method,
        trackingNumber: o.tracking_number,
        estimatedDeliveryDate: o.estimated_delivery_date,
        shippedAt: o.shipped_at,
        deliveredAt: o.delivered_at,
        notes: o.notes,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        items: (o.order_items || []).map((i: any) => ({ id: i.id, name: i.name, sku: i.sku, quantity: i.quantity, unitPrice: i.unit_price, totalPrice: i.total_price, image: i.image })),
      })));
    } catch { setError("Could not load your orders"); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleCancelConfirm = useCallback(async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try { await updateOrderStatusFromSupabase(cancelTarget.id, "CANCELLED"); setCancelTarget(null); loadOrders(); }
    catch { alert("Failed to cancel order"); }
    finally { setCancelling(false); }
  }, [cancelTarget, loadOrders]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse rounded-xl border border-line bg-white p-5"><div className="flex items-start justify-between"><div className="space-y-2"><div className="h-4 w-32 rounded bg-bg2" /><div className="h-3 w-24 rounded bg-bg2" /></div><div className="h-5 w-16 rounded bg-bg2" /></div><div className="mt-4 space-y-2"><div className="h-3 w-full rounded bg-bg2" /><div className="h-3 w-3/4 rounded bg-bg2" /><div className="h-3 w-1/2 rounded bg-bg2" /></div><div className="mt-4 flex items-center justify-between"><div className="h-5 w-20 rounded bg-bg2" /><div className="h-8 w-24 rounded bg-bg2" /></div></div>)}</div>;

  if (error) return <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-white px-6 py-16 text-center shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-sale/10"><AlertCircle className="h-7 w-7 text-sale" strokeWidth={1.5} /></div><div><p className="text-sm font-medium text-ink sm:text-base">Something went wrong</p><p className="mt-1 text-xs text-ink-2 sm:text-sm">{error}</p></div><Button variant="outline" onClick={loadOrders} className="gap-1.5"><RefreshCw className="h-4 w-4" strokeWidth={2} /> Try Again</Button></div>;

  if (orders.length === 0) return <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-white px-6 py-16 text-center shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2"><Package className="h-7 w-7 text-ink-3" strokeWidth={1} /></div><div><p className="text-sm font-medium text-ink sm:text-base">No orders yet</p><p className="mt-1 text-xs text-ink-2 sm:text-sm">Your order history will appear here once you make a purchase.</p></div><Link href="/"><Button>Start Shopping</Button></Link></div>;

  return <>
    <div className="space-y-4">{paginatedOrders.map((order) => <OrderCard key={order.id} order={order} onCancel={setCancelTarget} cancelling={cancelling && cancelTarget?.id === order.id} />)}</div>
    {totalPages > 1 && <div className="mt-6 flex items-center justify-center gap-2"><Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="h-9 w-9 p-0"><ChevronLeft className="h-4 w-4" /></Button>{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)} className="h-9 w-9 p-0 text-xs">{p}</Button>)}<Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="h-9 w-9 p-0"><ChevronRightIcon className="h-4 w-4" /></Button></div>}
    {cancelTarget && <CancelDialog order={cancelTarget} open={!!cancelTarget} onOpenChange={(open) => { if (!open) setCancelTarget(null); }} onConfirm={handleCancelConfirm} loading={cancelling} />}
  </>;
}
