"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";
import {
  ArrowLeft,
  Package,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  Truck,
  CreditCard,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { ORDER_STATUS } from "@tradehubuae/config";
import { formatStatus, orderStatusColor, ORDER_STATUS_FLOW } from "@/data";
import { getOrderById, updateOrderStatus, type OrderData } from "@/lib/actions/orders";

const STATUS_TRANSITIONS: Record<string, string[]> = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.RETURNED]: [ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.REFUNDED]: [],
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg2">
        <Icon className="h-4 w-4 text-ink-2" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

function TimelineBar({ status, shippedAt, deliveredAt }: { status: string; shippedAt?: string | null; deliveredAt?: string | null }) {
  const currentIdx = ORDER_STATUS_FLOW.indexOf(status as any);
  if (currentIdx === -1) return null;

  return (
    <div className="flex items-center gap-0">
      {ORDER_STATUS_FLOW.map((s, i) => {
        const isCompleted = i <= currentIdx;
        const isLast = i === ORDER_STATUS_FLOW.length - 1;
        return (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                isCompleted
                  ? "bg-brand text-white"
                  : "bg-bg2 text-ink-3"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                i + 1
              )}
            </div>
            {!isLast && (
              <div className={`h-0.5 w-8 sm:w-12 ${isCompleted && i < currentIdx ? "bg-brand" : "bg-line"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [statusMenu, setStatusMenu] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(params.id as string);
      setOrder(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    setStatusMenu(null);
    try {
      const updated = await updateOrderStatus(order.id, newStatus);
      setOrder(updated);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-bg2" />
          <div className="h-64 rounded-xl bg-bg2" />
          <div className="h-48 rounded-xl bg-bg2" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <XCircle className="mx-auto mb-4 h-12 w-12 text-ink-3" strokeWidth={1} />
        <p className="text-sm font-medium text-ink-2">{error || "Order not found"}</p>
        <Link href="/dashboard/orders">
          <Button variant="outline" size="sm" className="mt-4 gap-1.5">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  const isTerminal = order.status === ORDER_STATUS.CANCELLED || order.status === ORDER_STATUS.REFUNDED;
  const availableTransitions = STATUS_TRANSITIONS[order.status] || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Back + Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-ink sm:text-xl" style={{ letterSpacing: "-0.01em" }}>
                {order.orderNumber}
              </h1>
              <Badge variant={orderStatusColor[order.status] || "default"}>
                {formatStatus(order.status)}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-ink-2">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-AE", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchOrder}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.75} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status Timeline */}
        <div className="rounded-xl border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Order Progress</h2>
            <div className="flex items-center gap-2">
              {updating && (
                <RefreshCw className="h-4 w-4 animate-spin text-ink-3" strokeWidth={1.75} />
              )}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusMenu(statusMenu === "status" ? null : "status")}
                  disabled={availableTransitions.length === 0 || updating}
                  className="gap-1.5"
                >
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Update Status
                </Button>
                {statusMenu === "status" && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-lg border border-line bg-white shadow-panel">
                    {availableTransitions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusUpdate(s)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-bg2"
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            s === ORDER_STATUS.CANCELLED
                              ? "bg-red-500"
                              : s === ORDER_STATUS.DELIVERED
                                ? "bg-emerald-500"
                                : "bg-brand"
                          }`}
                        />
                        Mark as {formatStatus(s)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <TimelineBar status={order.status} shippedAt={order.shippedAt} deliveredAt={order.deliveredAt} />
          <div className="mt-3 text-xs text-ink-3">
            Status: <span className="font-medium text-ink">{formatStatus(order.status)}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Customer Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <InfoRow icon={User} label="Name" value={order.contactName || order.user?.name} />
              <InfoRow icon={Phone} label="Phone" value={order.contactPhone || order.user?.phone} />
              <InfoRow icon={Mail} label="Email" value={order.user?.email} />
            </div>
            <div className="space-y-4">
              {order.shippingAddress && (
                <InfoRow
                  icon={MapPin}
                  label="Shipping Address"
                  value={[
                    order.shippingAddress.firstName,
                    order.shippingAddress.lastName,
                    order.shippingAddress.addressLine1,
                    order.shippingAddress.addressLine2,
                    order.shippingAddress.city,
                    order.shippingAddress.emirate,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
              )}
              {order.shippingAddress?.phone && (
                <InfoRow icon={Phone} label="Alt Phone" value={order.shippingAddress.phone} />
              )}
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Order Details</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Subtotal</p>
              <p className="mt-1 text-sm font-medium text-ink">AED {Number(order.subtotal).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Shipping</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {Number(order.shippingCost) === 0 ? "Free" : `AED ${Number(order.shippingCost).toLocaleString()}`}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Total</p>
              <p className="mt-1 text-sm font-semibold text-ink">AED {Number(order.total).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Payment</p>
              <p className="mt-1 text-sm font-medium capitalize text-ink">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Shipping Method</p>
              <p className="mt-1 text-sm font-medium capitalize text-ink">
                {order.shippingMethod?.replace("_", " ") || "Standard"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Tracking #</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {order.trackingNumber || <span className="text-ink-3">—</span>}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Est. Delivery</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {order.estimatedDeliveryDate
                  ? new Date(order.estimatedDeliveryDate).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : <span className="text-ink-3">—</span>}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Shipped At</p>
              <p className="mt-1 text-sm font-medium text-ink">
                {order.shippedAt
                  ? new Date(order.shippedAt).toLocaleDateString("en-AE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : <span className="text-ink-3">—</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Items ({order.items.length})</h2>
          <div className="divide-y divide-line">
            <div className="hidden pb-2 text-[10px] font-bold uppercase tracking-wider text-ink-3 sm:grid sm:grid-cols-12">
              <span className="col-span-5">Product</span>
              <span className="col-span-3 text-center">SKU</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Price</span>
            </div>
            {order.items.map((item) => (
              <div key={item.id} className="grid grid-cols-2 gap-2 py-3 sm:grid-cols-12 sm:items-center">
                <div className="col-span-2 flex items-center gap-3 sm:col-span-5">
                  {item.image && (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bg2">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                </div>
                <p className="text-xs text-ink-2 sm:text-center sm:col-span-3">{item.sku}</p>
                <p className="text-sm text-ink sm:text-center sm:col-span-2">×{item.quantity}</p>
                <p className="text-sm font-medium text-ink sm:text-right sm:col-span-2">
                  AED {Number(item.unitPrice).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-5">
          <p className="text-xs text-ink-3">
            Order ID: {order.id}
          </p>
          <div className="flex gap-2">
            {order.trackingNumber && (
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Truck className="h-4 w-4" strokeWidth={1.75} />
                Track Shipment
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
