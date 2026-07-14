"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  ChevronRight,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@tradehubuae/ui";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
  notes?: string;
}

const STATUS_FLOW: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
  RETURNED: [],
  REFUNDED: [],
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 },
  PROCESSING: { label: "Processing", color: "bg-violet-50 text-violet-700 border-violet-200", icon: RefreshCw },
  SHIPPED: { label: "Shipped", color: "bg-cyan-50 text-cyan-700 border-cyan-200", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  RETURNED: { label: "Returned", color: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
  REFUNDED: { label: "Refunded", color: "bg-ink-2/10 text-ink-2 border-ink-2/20", icon: RefreshCw },
};

const nextStatusConfig: Record<string, { label: string; variant: "default" | "destructive" | "outline"; description: string }> = {
  CONFIRMED: { label: "Confirm Order", variant: "default", description: "Mark order as confirmed" },
  PROCESSING: { label: "Start Processing", variant: "default", description: "Begin preparing items" },
  SHIPPED: { label: "Mark Shipped", variant: "default", description: "Order has been shipped" },
  DELIVERED: { label: "Mark Delivered", variant: "default", description: "Order has been delivered" },
  CANCELLED: { label: "Cancel Order", variant: "destructive", description: "This will cancel the order permanently" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);

  const fetchOrder = useCallback(() => {
    setLoading(true);
    api.get<Order>(`/orders/${params.id}`)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${order.id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      setConfirmStatus(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-2">Loading order...</p>;
  if (error) return <p className="text-sm text-sale">{error}</p>;
  if (!order) return <p className="text-sm text-ink-2">Order not found</p>;

  const currentStatus = order.status.toUpperCase();
  const nextStatuses = STATUS_FLOW[currentStatus] ?? [];
  const statusInfo = statusConfig[currentStatus] ?? { label: currentStatus, color: "bg-bg2 text-ink-3 border-line", icon: Clock };
  const StatusIcon = statusInfo.icon;
  const isTerminal = nextStatuses.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-lg p-1.5 text-ink-2 transition-colors hover:bg-bg3 hover:text-ink">
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>
              Order #{order.orderNumber}
            </h1>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
              <StatusIcon className="h-3.5 w-3.5" strokeWidth={2} />
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">
            Placed on {new Date(order.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Items</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="divide-y divide-line">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bg2">
                      {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{item.productName}</p>
                      <p className="text-xs text-ink-3">Qty: {item.quantity}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-ink">AED {item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Shipping Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-sm text-ink">{order.customerName}</p>
                <p className="text-sm text-ink-2">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p className="text-sm text-ink-2">{order.shippingAddress.line2}</p>}
                <p className="text-sm text-ink-2">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p className="text-sm text-ink-2">{order.shippingAddress.country}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-5 pb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-2">Subtotal</span>
                  <span className="text-ink">AED {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-2">Shipping</span>
                  <span className="text-ink">AED {order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-2">Tax</span>
                  <span className="text-ink">AED {order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-line pt-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-ink">Total</span>
                    <span className="text-ink">AED {order.total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="pt-1 text-xs text-ink-3">via {order.paymentMethod}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold text-ink">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 px-5 pb-5">
              <p className="text-sm text-ink">{order.customerName}</p>
              <p className="text-sm text-ink-2">{order.customerEmail}</p>
              <p className="text-sm text-ink-2">{order.customerPhone}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="lg:sticky lg:top-24">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold text-ink">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
                  <StatusIcon className="h-3.5 w-3.5" strokeWidth={2} />
                  {statusInfo.label}
                </span>
              </div>

              {isTerminal ? (
                <div className="rounded-lg bg-bg2 px-3 py-2.5 text-xs text-ink-3">
                  No further status changes available for this order.
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Update Status</p>
                  <div className="flex flex-col gap-2">
                    {nextStatuses.map((status) => {
                      const config = nextStatusConfig[status];
                      if (!config) return null;
                      return (
                        <button
                          key={status}
                          onClick={() => setConfirmStatus(status)}
                          disabled={updating}
                          className={`flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
                            config.variant === "destructive"
                              ? "border-red-200 bg-white text-red-600 hover:bg-red-50"
                              : "border-line bg-white text-ink hover:bg-bg2 hover:border-ink/20"
                          } disabled:opacity-50`}
                        >
                          {config.variant === "destructive" ? (
                            <XCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm">{config.label}</p>
                            <p className="text-[10px] text-ink-3">{config.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!confirmStatus} onOpenChange={(open) => !open && setConfirmStatus(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              {confirmStatus === "CANCELLED"
                ? "Are you sure you want to cancel this order? This action cannot be undone."
                : `Move this order to "${nextStatusConfig[confirmStatus ?? ""]?.label ?? confirmStatus}"?`}
            </DialogDescription>
          </DialogHeader>
          {confirmStatus === "CANCELLED" && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" strokeWidth={1.75} />
              <p className="text-xs text-red-700">
                Cancelling will stop any further processing. The customer will be notified.
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmStatus(null)} disabled={updating}>
              Keep Current
            </Button>
            <Button
              variant={confirmStatus === "CANCELLED" ? "destructive" : "default"}
              onClick={() => confirmStatus && handleStatusUpdate(confirmStatus)}
              disabled={updating}
              className="min-w-[100px]"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                confirmStatus === "CANCELLED" ? "Cancel Order" : "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
