"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import {
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@tradehubuae/ui";
import { useAuth } from "@/lib/supabase/provider";
import { toast } from "sonner";
import { ORDER_STATUS } from "@tradehubuae/config";
import {
  orderStatusColor,
  formatStatus,
  ORDER_STATUS_FLOW,
  ORDER_TERMINAL_STATUSES,
} from "@/data";
import {
  getMyOrdersFromSupabase,
  getMyReturns,
  updateOrderStatusFromSupabase,
} from "@/lib/actions/orders-supabase";
import { requestReturn } from "@/lib/actions/returns";

const CANCELLABLE_STATUSES = [ORDER_STATUS.PENDING];
const RETURN_ELIGIBLE_STATUSES = [ORDER_STATUS.DELIVERED];

const returnStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Return Requested", color: "bg-amber-50 text-amber-700 border-amber-200" },
  APPROVED: { label: "Return Approved", color: "bg-blue-50 text-blue-700 border-blue-200" },
  REJECTED: { label: "Return Rejected", color: "bg-red-50 text-red-700 border-red-200" },
  REFUNDED: { label: "Refunded", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};
const PAGE_SIZE = 7;

function OrderStatusTimeline({ status }: { status: string }) {
  if (ORDER_TERMINAL_STATUSES.includes(status as any)) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
          <XCircle className="h-4 w-4 text-red-500" strokeWidth={2} />
        </div>
        <span className="text-sm font-medium text-red-600">{formatStatus(status)}</span>
      </div>
    );
  }

  const currentIdx = ORDER_STATUS_FLOW.indexOf(status as any);

  return (
    <div className="space-y-0">
      {ORDER_STATUS_FLOW.map((step, i) => {
        const isCompleted = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isCompleted
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isCurrent
                      ? "border-brand bg-white text-brand ring-2 ring-brand/20"
                      : "border-ink-3/30 bg-white text-ink-3"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                ) : isCurrent ? (
                  <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-ink-3/30" />
                )}
              </div>
              {i < ORDER_STATUS_FLOW.length - 1 && (
                <div
                  className={`h-5 w-0.5 ${isCompleted ? "bg-emerald-400" : "bg-line"}`}
                />
              )}
            </div>
            <div
              className={`pb-3 text-sm ${
                isCompleted
                  ? "font-medium text-ink"
                  : isCurrent
                    ? "font-medium text-brand"
                    : "text-ink-3"
              }`}
            >
              {formatStatus(step)}
              {isCurrent && (
                <span className="ml-2 inline-flex items-center rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                  Current
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReturnDialog({
  order,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: {
  order: any;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (reason: string, notes: string) => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Return Order</DialogTitle>
          <DialogDescription>
            Start a return for order <span className="font-semibold text-ink">{order?.orderNumber}</span>?
            Returns are accepted within 7 days of delivery.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Reason for Return *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink/30"
            >
              <option value="">Select a reason...</option>
              <option value="Defective or not working">Defective or not working</option>
              <option value="Wrong item received">Wrong item received</option>
              <option value="Item not as described">Item not as described</option>
              <option value="Damaged in transit">Damaged in transit</option>
              <option value="No longer needed">No longer needed</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any additional details..."
              className="min-h-[80px] w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink/30"
            />
          </div>
          <div className="rounded-xl border border-line/60 bg-bg2/50 px-4 py-3">
            <p className="text-sm text-ink-2">
              <span className="font-medium text-ink">Items:</span>{" "}
              {order?.items?.map((i: any) => `${i.name} × ${i.quantity}`).join(", ")}
            </p>
            <p className="mt-1 text-sm text-ink-2">
              <span className="font-medium text-ink">Total:</span> AED{" "}
              {Number(order?.total || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(reason, notes)} disabled={loading || !reason}>
            {loading ? "Submitting..." : "Submit Return Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CancelDialog({
  order,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: {
  order: any;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel order{" "}
            <span className="font-semibold text-ink">{order?.orderNumber}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-line/60 bg-bg2/50 px-4 py-3">
          <p className="text-sm text-ink-2">
            <span className="font-medium text-ink">Items:</span>{" "}
            {order?.items?.map((i: any) => `${i.name} × ${i.quantity}`).join(", ")}
          </p>
          <p className="mt-1 text-sm text-ink-2">
            <span className="font-medium text-ink">Total:</span> AED{" "}
            {Number(order?.total || 0).toLocaleString()}
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Keep Order
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Cancelling..." : "Yes, Cancel Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrderCard({ order, onCancel, cancelling, onReturn }: any) {
  const [expanded, setExpanded] = useState(false);
  const isCancellable = CANCELLABLE_STATUSES.includes(order.status);
  const isReturnEligible = RETURN_ELIGIBLE_STATUSES.includes(order.status) && !order.returnInfo;
  const returnInfo = order.returnInfo;

  return (
    <div className="group rounded-2xl border border-line/60 bg-white shadow-sm transition-all hover:shadow-card">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="truncate text-sm font-semibold text-ink sm:text-base">
            {order.orderNumber}
          </span>
          <p className="text-xs text-ink-2 sm:text-sm">
            {new Date(order.createdAt).toLocaleDateString("en-AE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <span className="text-xs text-ink-3">
            {order.items.reduce((s: number, i: any) => s + i.quantity, 0)} item(s)
          </span>
          <span className="text-sm font-semibold text-ink">
            AED {Number(order.total).toLocaleString()}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge
            variant={orderStatusColor[order.status] || "default"}
            className="px-3 py-1 text-xs"
          >
            {formatStatus(order.status)}
          </Badge>
          {returnInfo && (
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${returnStatusConfig[returnInfo.status]?.color || "bg-bg2 text-ink-3"}`}>
              {returnStatusConfig[returnInfo.status]?.label || returnInfo.status}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-ink-3 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            strokeWidth={2}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-line/60 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          <OrderStatusTimeline status={order.status} />

          <div className="mt-4 flex flex-wrap gap-1.5">
            {order.items.map((item: any, i: number) => (
              <span
                key={i}
                className="inline-flex items-center rounded-lg bg-bg2/80 px-2.5 py-1 text-xs font-medium text-ink-2"
              >
                {item.name} &times; {item.quantity}
              </span>
            ))}
          </div>

          <hr className="my-4 border-line/60" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                Total
              </p>
              <p className="text-base font-bold text-ink sm:text-lg">
                AED {Number(order.total).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl text-xs sm:text-sm"
                >
                  View Details
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Button>
              </Link>
              {isCancellable && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl text-xs sm:text-sm"
                  onClick={() => onCancel(order)}
                  disabled={cancelling}
                >
                  Cancel
                </Button>
              )}
              {isReturnEligible && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl text-xs sm:text-sm"
                  onClick={() => onReturn(order)}
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                  Return
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [returnTarget, setReturnTarget] = useState<any | null>(null);
  const [returning, setReturning] = useState(false);
  const [page, setPage] = useState(1);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [orderRows, returnRows] = await Promise.all([
        getMyOrdersFromSupabase(user.id),
        getMyReturns(user.id),
      ]);
      const returnMap: Record<string, any> = {};
      for (const r of returnRows || []) {
        if (!returnMap[r.order_id] || r.status !== "REJECTED") {
          returnMap[r.order_id] = { id: r.id, status: r.status, reason: r.reason, refundAmount: r.refund_amount, createdAt: r.created_at };
        }
      }
      setOrders(
        (orderRows || []).map((o: any) => ({
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
          items: (o.order_items || []).map((i: any) => ({
            id: i.id,
            name: i.name,
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.unit_price,
            totalPrice: i.total_price,
            image: i.image,
          })),
          returnInfo: returnMap[o.id] || null,
        })),
      );
    } catch {
      setError("Could not load your orders");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCancelConfirm = useCallback(async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await updateOrderStatusFromSupabase(cancelTarget.id, "CANCELLED");
      setCancelTarget(null);
      loadOrders();
    } catch {
      alert("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  }, [cancelTarget, loadOrders]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginatedOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading)
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-line/60 bg-white p-5 sm:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-36 rounded-lg bg-bg2" />
                <div className="h-3 w-28 rounded-lg bg-bg2" />
              </div>
              <div className="h-6 w-20 rounded-lg bg-bg2" />
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-3 w-full rounded-lg bg-bg2" />
              <div className="h-3 w-3/4 rounded-lg bg-bg2" />
              <div className="h-3 w-1/2 rounded-lg bg-bg2" />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-2 w-12 rounded bg-bg2" />
                <div className="h-5 w-24 rounded-lg bg-bg2" />
              </div>
              <div className="h-9 w-36 rounded-xl bg-bg2" />
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-line/60 bg-white px-6 py-16 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <AlertCircle className="h-7 w-7 text-red-400" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink sm:text-base">
            Something went wrong
          </p>
          <p className="mt-1 text-xs text-ink-2 sm:text-sm">{error}</p>
        </div>
        <Button variant="outline" onClick={loadOrders} className="gap-1.5">
          <RefreshCw className="h-4 w-4" strokeWidth={2} />
          Try Again
        </Button>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-line/60 bg-white px-6 py-16 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg2">
          <Package className="h-8 w-8 text-ink-3" strokeWidth={1} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink sm:text-base">No orders yet</p>
          <p className="mt-1 text-xs text-ink-2 sm:text-sm">
            Your order history will appear here once you make a purchase.
          </p>
        </div>
        <Link href="/">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );

  return (
    <>
      <div className="space-y-4">
        {paginatedOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCancel={setCancelTarget}
            cancelling={cancelling && cancelTarget?.id === order.id}
            onReturn={setReturnTarget}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="h-9 w-9 rounded-xl p-0"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-xl p-0 text-xs font-medium ${
                p === page ? "" : "text-ink-2 hover:text-ink"
              }`}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="h-9 w-9 rounded-xl p-0"
          >
            <ChevronRightIcon className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      )}

      {cancelTarget && (
        <CancelDialog
          order={cancelTarget}
          open={!!cancelTarget}
          onOpenChange={(open) => {
            if (!open) setCancelTarget(null);
          }}
          onConfirm={handleCancelConfirm}
          loading={cancelling}
        />
      )}

      <ReturnDialog
        order={returnTarget}
        open={!!returnTarget}
        onOpenChange={(open) => {
          if (!open) setReturnTarget(null);
        }}
        onConfirm={async (reason, notes) => {
          if (!returnTarget) return;
          setReturning(true);
          try {
            await requestReturn(returnTarget.id, reason, notes || undefined);
            setReturnTarget(null);
            toast.success("Return request submitted successfully");
            loadOrders();
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to submit return";
            toast.error(msg);
          } finally {
            setReturning(false);
          }
        }}
        loading={returning}
      />
    </>
  );
}
