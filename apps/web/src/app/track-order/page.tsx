"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Badge } from "@tradehubuae/ui";
import {
  Search,
  ShoppingCart,
  CheckCircle2,
  RefreshCw,
  Truck,
  PackageCheck,
  Phone,
  MapPin,
  Calendar,
  Copy,
  ClipboardCheck,
  XCircle,
  Package,
  CreditCard,
  Clock,
  ArrowRight,
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

function getTimelineStatus(
  orderStatus: string,
  stepKey: string,
): "completed" | "current" | "upcoming" {
  const orderIdx = ORDER_STATUS_FLOW.indexOf(
    orderStatus as (typeof ORDER_STATUS_FLOW)[number],
  );
  const stepIdx = TIMELINE_STEPS.findIndex((s) => s.key === stepKey);
  if (stepIdx < orderIdx) return "completed";
  if (stepIdx === orderIdx) return "current";
  return "upcoming";
}

function Timeline({
  status,
  shippedAt,
  deliveredAt,
}: {
  status: string;
  shippedAt?: string | null;
  deliveredAt?: string | null;
}) {
  const isTerminal =
    status === "CANCELLED" || status === "RETURNED" || status === "REFUNDED";

  return (
    <div className="relative">
      {TIMELINE_STEPS.map((step, i) => {
        const stepStatus = getTimelineStatus(status, step.key);
        const showLine = i < TIMELINE_STEPS.length - 1;

        if (isTerminal && stepStatus === "upcoming") return null;

        let dateLabel: string | null = null;
        if (step.key === "SHIPPED" && shippedAt) {
          dateLabel = new Date(shippedAt).toLocaleDateString("en-AE", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        }
        if (step.key === "DELIVERED" && deliveredAt) {
          dateLabel = new Date(deliveredAt).toLocaleDateString("en-AE", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        }

        const StepIcon = step.icon;

        return (
          <div key={step.key} className="flex gap-4 pb-7 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-medium transition-all ${
                  stepStatus === "completed"
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                    : stepStatus === "current"
                      ? "border-brand bg-white text-brand shadow-sm shadow-brand/10 ring-2 ring-brand/20"
                      : "border-line bg-white text-ink-3"
                }`}
              >
                {stepStatus === "completed" ? (
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
                ) : (
                  <StepIcon className="h-4 w-4" strokeWidth={1.75} />
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
            <div
              className={`min-w-0 pt-2 ${
                stepStatus === "upcoming" ? "opacity-40" : ""
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  stepStatus === "current"
                    ? "text-brand"
                    : stepStatus === "completed"
                      ? "text-emerald-700"
                      : "text-ink"
                }`}
              >
                {step.label}
              </p>
              {dateLabel && (
                <p className="mt-0.5 text-xs text-ink-2">{dateLabel}</p>
              )}
              {stepStatus === "current" && !isTerminal && (
                <span className="mt-1.5 inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                  <Clock className="mr-1 h-3 w-3" strokeWidth={2} />
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-red-200 bg-red-50 text-red-500">
              <XCircle className="h-5 w-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="min-w-0 pt-2">
            <p className="text-sm font-medium text-red-600">
              {status === "CANCELLED"
                ? "Cancelled"
                : status === "RETURNED"
                  ? "Returned"
                  : "Refunded"}
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
      className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-ink-3 transition-all hover:bg-brand/5 hover:text-brand"
      title="Copy"
    >
      {copied ? (
        <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
      )}
    </button>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Package;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg2">
        <Icon className="h-4 w-4 text-ink-2" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium text-ink">{children}</div>
      </div>
    </div>
  );
}

function OrderTrackCard({ order }: { order: OrderData }) {
  const isTerminal =
    order.status === "CANCELLED" ||
    order.status === "RETURNED" ||
    order.status === "REFUNDED";

  return (
    <div className="space-y-5">
      {/* Order Header */}
      <div className="relative overflow-hidden rounded-2xl border border-line/60 bg-white p-5 shadow-sm sm:p-6">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand/[0.02]" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">
                Order Number
              </p>
              <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-ink">
                {order.orderNumber}
                <CopyButton text={order.orderNumber} />
              </p>
            </div>
            <Badge
              variant={orderStatusColor[order.status] || "default"}
              className="px-3 py-1 text-xs"
            >
              {formatStatus(order.status)}
            </Badge>
          </div>

          {order.trackingNumber && !isTerminal && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-brand/5 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                <Truck className="h-4 w-4 text-brand" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand/70">
                  Tracking Number
                </p>
                <p className="flex items-center text-sm font-medium text-ink">
                  {order.trackingNumber}
                  <CopyButton text={order.trackingNumber} />
                </p>
              </div>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line/60 pt-5 sm:grid-cols-4">
            <InfoRow icon={Calendar} label="Placed on">
              {new Date(order.createdAt).toLocaleDateString("en-AE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </InfoRow>
            <InfoRow icon={Package} label="Total">
              AED {Number(order.total).toLocaleString()}
            </InfoRow>
            <InfoRow icon={CreditCard} label="Payment">
              <span className="capitalize">
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : order.paymentMethod === "card"
                    ? "Card Payment"
                    : order.paymentMethod}
              </span>
            </InfoRow>
            <InfoRow icon={Truck} label="Shipping">
              <span className="capitalize">
                {order.shippingMethod?.replace("_", " ") || "Standard"}
              </span>
            </InfoRow>
          </div>
        </div>
      </div>

      {/* Estimated Delivery */}
      {order.estimatedDeliveryDate && !isTerminal && (
        <div className="relative overflow-hidden rounded-2xl border border-line/60 bg-gradient-to-br from-brand/5 to-brand/[0.02] p-5 shadow-sm sm:p-6">
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand/[0.04]" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10">
              <Calendar className="h-6 w-6 text-brand" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand/70">
                Estimated Delivery
              </p>
              <p className="text-base font-semibold text-ink">
                {new Date(order.estimatedDeliveryDate).toLocaleDateString(
                  "en-AE",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terminal State */}
      {isTerminal && (
        <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-red-50/50 p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <XCircle className="h-6 w-6 text-red-500" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">
                Order {formatStatus(order.status)}
              </p>
              <p className="text-xs text-red-500">
                This order will not be processed further.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Progress */}
      <div className="rounded-2xl border border-line/60 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold text-ink">
          <RefreshCw className="h-4 w-4 text-brand" strokeWidth={1.5} />
          Order Progress
        </h3>
        <Timeline
          status={order.status}
          shippedAt={order.shippedAt}
          deliveredAt={order.deliveredAt}
        />
      </div>

      {/* Delivery Details */}
      <div className="rounded-2xl border border-line/60 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold text-ink">
          <MapPin className="h-4 w-4 text-brand" strokeWidth={1.5} />
          Delivery Details
        </h3>
        <div className="space-y-4">
          {order.contactName && (
            <InfoRow icon={ShoppingCart} label="Name">
              {order.contactName}
            </InfoRow>
          )}
          {order.contactPhone && (
            <InfoRow icon={Phone} label="Phone">
              {order.contactPhone}
            </InfoRow>
          )}
          {order.shippingAddress && (
            <InfoRow icon={MapPin} label="Address">
              {[
                order.shippingAddress.addressLine1,
                order.shippingAddress.addressLine2,
                order.shippingAddress.city,
                order.shippingAddress.emirate,
              ]
                .filter(Boolean)
                .join(", ")}
            </InfoRow>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-2xl border border-line/60 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold text-ink">
          <Package className="h-4 w-4 text-brand" strokeWidth={1.5} />
          Items ({order.items.length})
        </h3>
        <div className="divide-y divide-line/60">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              {item.image && (
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-bg2 shadow-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink-2">SKU: {item.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">
                  &times;{item.quantity}
                </p>
                <p className="text-xs text-ink-2">
                  AED {Number(item.unitPrice).toLocaleString()}
                </p>
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
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/10 to-brand/5">
            <Package className="h-7 w-7 text-brand" strokeWidth={1.5} />
          </div>
          <h1
            className="text-[26px] font-semibold leading-[30px] text-ink"
            style={{ letterSpacing: "-0.01em" }}
          >
            Track Your Order
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Enter your order number to see real-time status and delivery
            details.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
              strokeWidth={1.75}
            />
            <Input
              placeholder="Enter order number (e.g., TH-KX3A1-4B9F)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              className="h-12 rounded-xl border-line/60 pl-11 text-base shadow-sm transition-all focus-within:border-brand/30"
            />
          </div>
          <Button
            size="lg"
            onClick={handleTrack}
            disabled={!orderId.trim() || loading}
            className="h-12 gap-2 rounded-xl shadow-sm sm:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={2} />
                Searching...
              </>
            ) : (
              <>
                Track
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </>
            )}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-red-50/50 p-5 text-center">
            <div className="flex items-center justify-center gap-2.5">
              <XCircle className="h-5 w-5 text-red-400" strokeWidth={1.5} />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="animate-pulse space-y-5">
            <div className="h-48 rounded-2xl bg-gradient-to-r from-bg2 to-bg3" />
            <div className="h-24 rounded-2xl bg-gradient-to-r from-bg2 to-bg3" />
            <div className="h-72 rounded-2xl bg-gradient-to-r from-bg2 to-bg3" />
          </div>
        )}

        {/* Order Details */}
        {order && <OrderTrackCard order={order} />}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-2xl animate-pulse space-y-5">
            <div className="mx-auto h-8 w-48 rounded-lg bg-bg2" />
            <div className="h-12 w-full rounded-xl bg-bg2" />
            <div className="h-48 rounded-2xl bg-bg2" />
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
