"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Badge } from "@tradehubuae/ui";
import {
  Search,
  ShoppingCart,
  Check, CheckCircle2,
  RefreshCw,
  Truck,
  PackageCheck,
  Phone,
  MapPin,
  Calendar,
  Copy,
  ClipboardCheck,
  XCircle,
} from "lucide-react";
import { formatStatus, orderStatusColor, ORDER_STATUS_FLOW } from "@/data";
import { trackOrder, type OrderData } from "@/lib/actions/orders";

const TIMELINE_STEPS = [
  { key: "PENDING", label: "Order Placed", icon: ShoppingCart },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { key: "PROCESSING", label: "Processing", icon: RefreshCw },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: PackageCheck },
];

function getTimelineStatus(orderStatus: string, stepKey: string): "completed" | "current" | "upcoming" {
  const orderIdx = ORDER_STATUS_FLOW.indexOf(orderStatus as typeof ORDER_STATUS_FLOW[number]);
  const stepIdx = TIMELINE_STEPS.findIndex((s) => s.key === stepKey);
  if (stepIdx < orderIdx) return "completed";
  if (stepIdx === orderIdx) return "current";
  return "upcoming";
}

function Timeline({ status, shippedAt, deliveredAt }: { status: string; shippedAt?: string | null; deliveredAt?: string | null }) {
  const isTerminal = status === "CANCELLED" || status === "RETURNED" || status === "REFUNDED";

  return (
    <div className="relative">
      {TIMELINE_STEPS.map((step, i) => {
        const stepStatus = getTimelineStatus(status, step.key);
        const showLine = i < TIMELINE_STEPS.length - 1;

        if (isTerminal && stepStatus === "upcoming") return null;

        let dateLabel: string | null = null;
        if (step.key === "SHIPPED" && shippedAt) {
          dateLabel = new Date(shippedAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" });
        }
        if (step.key === "DELIVERED" && deliveredAt) {
          dateLabel = new Date(deliveredAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" });
        }

        const StepIcon = step.icon;

        return (
          <div key={step.key} className="flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-all ${
                  stepStatus === "completed"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : stepStatus === "current"
                      ? "border-brand bg-white text-brand ring-2 ring-brand/20"
                      : "border-line bg-white text-ink-3"
                }`}
              >
                {stepStatus === "completed" ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                ) : (
                  <StepIcon className="h-4 w-4" strokeWidth={2} />
                )}
              </div>
              {showLine && (
                <div
                  className={`mt-1 h-full w-0.5 ${
                    stepStatus === "completed" ? "bg-emerald-400" : "bg-line"
                  }`}
                />
              )}
            </div>
            <div className={`min-w-0 pt-1.5 ${stepStatus === "upcoming" ? "opacity-40" : ""}`}>
              <p
                className={`text-sm font-medium ${
                  stepStatus === "current" ? "text-brand" : "text-ink"
                }`}
              >
                {step.label}
              </p>
              {dateLabel && (
                <p className="mt-0.5 text-xs text-ink-2">{dateLabel}</p>
              )}
              {stepStatus === "current" && !isTerminal && (
                <span className="mt-1 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                  Current
                </span>
              )}
            </div>
          </div>
        );
      })}
      {isTerminal && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-red-300 bg-red-50 text-red-500">
              <XCircle className="h-4 w-4" strokeWidth={2} />
            </div>
          </div>
          <div className="min-w-0 pt-1.5">
            <p className="text-sm font-medium text-red-600">
              {status === "CANCELLED" ? "Cancelled" : status === "RETURNED" ? "Returned" : "Refunded"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      void 0;
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-bg2 hover:text-ink"
      title="Copy"
    >
      {copied ? <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />}
    </button>
  );
}

function OrderTrackCard({ order }: { order: OrderData }) {
  const isTerminal = order.status === "CANCELLED" || order.status === "RETURNED" || order.status === "REFUNDED";

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-ink-3">Order Number</p>
            <p className="mt-0.5 flex items-center gap-1 text-lg font-semibold text-ink">
              {order.orderNumber}
              <CopyButton text={order.orderNumber} />
            </p>
          </div>
          <Badge variant={orderStatusColor[order.status] || "default"} className="px-3 py-1 text-xs">
            {formatStatus(order.status)}
          </Badge>
        </div>

        {order.trackingNumber && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand/5 px-3 py-2">
            <Truck className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <span className="text-xs text-ink-2">Tracking:</span>
            <span className="text-sm font-medium text-ink">{order.trackingNumber}</span>
            <CopyButton text={order.trackingNumber} />
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Placed on</p>
            <p className="mt-1 text-sm font-medium text-ink">
              {new Date(order.createdAt).toLocaleDateString("en-AE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Total</p>
            <p className="mt-1 text-sm font-medium text-ink">
              AED {Number(order.total).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Payment</p>
            <p className="mt-1 text-sm font-medium capitalize text-ink">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "card" ? "Card Payment" : order.paymentMethod}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Shipping</p>
            <p className="mt-1 text-sm font-medium capitalize text-ink">
              {order.shippingMethod?.replace("_", " ") || "Standard"}
            </p>
          </div>
        </div>
      </div>

      {order.estimatedDeliveryDate && !isTerminal && (
        <div className="rounded-xl border border-line bg-brand/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
              <Calendar className="h-5 w-5 text-brand" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                Estimated Delivery
              </p>
              <p className="text-base font-semibold text-ink">
                {new Date(order.estimatedDeliveryDate).toLocaleDateString("en-AE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {isTerminal && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">
                Order {formatStatus(order.status)}
              </p>
              <p className="text-xs text-red-600">This order will not be processed further.</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-line bg-white p-5">
        <h3 className="mb-5 text-sm font-semibold text-ink">Order Progress</h3>
        <Timeline
          status={order.status}
          shippedAt={order.shippedAt}
          deliveredAt={order.deliveredAt}
        />
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-ink">Delivery Details</h3>
        <div className="space-y-4">
          {order.contactName && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg2">
                <ShoppingCart className="h-4 w-4 text-ink-2" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Name</p>
                <p className="text-sm font-medium text-ink">{order.contactName}</p>
              </div>
            </div>
          )}
          {order.contactPhone && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg2">
                <Phone className="h-4 w-4 text-ink-2" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Phone</p>
                <p className="text-sm font-medium text-ink">{order.contactPhone}</p>
              </div>
            </div>
          )}
          {order.shippingAddress && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg2">
                <MapPin className="h-4 w-4 text-ink-2" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Address</p>
                <p className="text-sm font-medium text-ink">
                  {[
                    order.shippingAddress.addressLine1,
                    order.shippingAddress.addressLine2,
                    order.shippingAddress.city,
                    order.shippingAddress.emirate,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-ink">Items ({order.items.length})</h3>
        <div className="divide-y divide-line">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              {item.image && (
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bg2">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink-2">SKU: {item.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-ink">×{item.quantity}</p>
                <p className="text-xs text-ink-2">AED {Number(item.unitPrice).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      setOrderId(orderParam);
      setLoading(true);
      trackOrder(orderParam)
        .then(setOrder)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const result = await trackOrder(orderId.trim());
      setOrder(result);
    } catch {
      setError("Order not found. Please check your order number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
            Track Your Order
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Enter your order number to see real-time status and delivery details.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
            <Input
              placeholder="Enter order number (e.g., TH-KX3A1-4B9F)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              className="h-12 pl-11 text-base"
            />
          </div>
          <Button
            size="lg"
            onClick={handleTrack}
            disabled={!orderId.trim() || loading}
            className="h-12 w-full sm:w-auto"
          >
            {loading ? "Searching..." : "Track"}
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading && (
          <div className="animate-pulse space-y-5">
            <div className="h-40 rounded-xl bg-bg2" />
            <div className="h-20 rounded-xl bg-bg2" />
            <div className="h-64 rounded-xl bg-bg2" />
          </div>
        )}

        {order && <OrderTrackCard order={order} />}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl animate-pulse space-y-5">
          <div className="h-8 w-48 rounded bg-bg2" />
          <div className="h-12 w-full rounded bg-bg2" />
          <div className="h-40 rounded bg-bg2" />
        </div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
