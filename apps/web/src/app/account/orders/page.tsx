"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Package, ChevronRight, X, AlertTriangle, Check } from "lucide-react";
import {
  Button,
  Badge,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@tradehubuae/ui";
import { getMyOrders, updateOrderStatus, type OrderData } from "@/lib/actions/orders";
import { orderStatusColor, formatStatus, ORDER_STATUS_FLOW, ORDER_TERMINAL_STATUSES } from "@/data";

const CANCELLABLE_STATUSES = ORDER_STATUS_FLOW.slice(0, -1);

function OrderStatusTimeline({ status }: { status: string }) {
  if (ORDER_TERMINAL_STATUSES.includes(status as typeof ORDER_TERMINAL_STATUSES[number])) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-sale/5 px-3 py-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sale/10">
          <X className="h-3.5 w-3.5 text-sale" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-medium text-sale">{formatStatus(status)}</span>
      </div>
    );
  }

  const currentIdx = ORDER_STATUS_FLOW.indexOf(status as typeof ORDER_STATUS_FLOW[number]);

  return (
    <div className="space-y-0">
      {ORDER_STATUS_FLOW.map((step, i) => {
        const isCompleted = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted ? "border-brand bg-brand text-white" : "border-ink-3 bg-white text-ink-3"
                }`}
              >
                {isCompleted && (
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                )}
              </div>
              {i < ORDER_STATUS_FLOW.length - 1 && (
                <div className={`h-4 w-0.5 ${isCompleted ? "bg-brand" : "bg-line"}`} />
              )}
            </div>
            <div className={`pb-3 text-sm ${isCompleted ? "font-medium text-ink" : "text-ink-3"}`}>
              {formatStatus(step)}
              {isCurrent && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
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

function CancelDialog({
  order,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: {
  order: OrderData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel order <span className="font-semibold text-ink">{order.orderNumber}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-line bg-bg2/50 px-4 py-3">
          <p className="text-sm text-ink-2">
            <span className="font-medium text-ink">Items:</span>{" "}
            {order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
          </p>
          <p className="mt-1 text-sm text-ink-2">
            <span className="font-medium text-ink">Total:</span> AED {Number(order.total).toLocaleString()}
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

function OrderCard({
  order,
  onCancel,
  cancelling,
}: {
  order: OrderData;
  onCancel: (order: OrderData) => void;
  cancelling: boolean;
}) {
  const isCancellable = CANCELLABLE_STATUSES.includes(order.status as typeof CANCELLABLE_STATUSES[number]);

  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-sm transition-all hover:shadow-card sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
            className="text-sm font-semibold text-ink transition-colors hover:text-brand sm:text-base"
          >
            {order.orderNumber}
          </Link>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">
            {new Date(order.createdAt).toLocaleDateString("en-AE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
          </p>
        </div>
        <Badge variant={orderStatusColor[order.status] || "default"} className="shrink-0 text-xs">
          {formatStatus(order.status)}
        </Badge>
      </div>

      <div className="mt-4">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {order.items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-bg2 px-2 py-1 text-xs text-ink-2"
          >
            {item.name} × {item.quantity}
          </span>
        ))}
      </div>

      <hr className="my-3 border-line" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-bold text-ink sm:text-lg">
          AED {Number(order.total).toLocaleString()}
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
          >
            <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm">
              View Details
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </Link>
          {isCancellable && (
            <Button
              variant="destructive"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => onCancel(order)}
              disabled={cancelling}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountOrders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<OrderData | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {/* ignore */})
      .finally(() => setLoading(false));
  }, []);

  const handleCancelClick = useCallback((order: OrderData) => {
    setCancelTarget(order);
  }, []);

  const handleCancelConfirm = useCallback(async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await updateOrderStatus(cancelTarget.id, "CANCELLED");
      setOrders((prev) =>
        prev.map((o) => (o.id === cancelTarget.id ? { ...o, status: "CANCELLED" } : o)),
      );
      setCancelTarget(null);
    } catch {
      alert("Failed to cancel order. Please try again.");
    } finally {
      setCancelling(false);
    }
  }, [cancelTarget]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 animate-pulse rounded-xl border border-line bg-white p-5 sm:h-48">
            <div className="h-4 w-32 rounded bg-bg2" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-24 rounded bg-bg2" />
              <div className="h-3 w-20 rounded bg-bg2" />
              <div className="h-3 w-28 rounded bg-bg2" />
            </div>
            <div className="mt-4 h-4 w-20 rounded bg-bg2" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-white px-6 py-16 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2">
          <Package className="h-7 w-7 text-ink-3" strokeWidth={1} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink sm:text-base">No orders yet</p>
          <p className="mt-1 text-xs text-ink-2 sm:text-sm">Your order history will appear here once you make a purchase.</p>
        </div>
        <Link href="/">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCancel={handleCancelClick}
            cancelling={cancelling && cancelTarget?.id === order.id}
          />
        ))}
      </div>

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
    </>
  );
}
