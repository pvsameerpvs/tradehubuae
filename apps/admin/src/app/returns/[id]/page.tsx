"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  RotateCcw,
  User,
  Phone,
  CreditCard,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  DollarSign,
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

interface ReturnDetail {
  id: string;
  orderId: string;
  reason: string;
  status: string;
  refundAmount: string | null;
  notes: string | null;
  items: { id: string; quantity: number; name: string }[] | null;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
  orderStatus: string;
  contactName: string | null;
  contactPhone: string | null;
  total: string;
  shippingMethod: string | null;
  paymentMethod: string | null;
  deliveredAt: string | null;
  trackingNumber: string | null;
}

const STATUS_FLOW: Record<string, string[]> = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["REFUNDED"],
  REJECTED: [],
  REFUNDED: [],
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "Pending Review", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  APPROVED: { label: "Approved", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  REFUNDED: { label: "Refunded", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: DollarSign },
};

const actionConfig: Record<string, { label: string; variant: "default" | "destructive" | "outline"; description: string; effect: string }> = {
  APPROVED: { label: "Approve Return", variant: "default", description: "Accept the return and restore stock", effect: "Stock restored · Order → Returned" },
  REJECTED: { label: "Reject Return", variant: "destructive", description: "Decline the return request", effect: "No changes to order" },
  REFUNDED: { label: "Process Refund", variant: "default", description: "Complete the refund", effect: "Order → Refunded · Payment closed" },
};

export default function ReturnDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ret, setReturn] = useState<ReturnDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState("");

  const fetchReturn = useCallback(() => {
    setLoading(true);
    api.get<ReturnDetail>(`/returns/${params.id}`)
      .then((data) => {
        setReturn(data);
        setRefundAmount(data.total || "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load return"))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => { fetchReturn(); }, [fetchReturn]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!ret) return;
    setUpdating(true);
    try {
      const body: Record<string, unknown> = { status: newStatus };
      if (newStatus === "REFUNDED") {
        body.refundAmount = parseFloat(refundAmount) || parseFloat(ret.total);
      }
      await api.put(`/returns/${ret.id}/status`, body);
      setConfirmStatus(null);
      const effects: Record<string, string> = {
        APPROVED: "Stock restored and order moved to Returned",
        REJECTED: "Return request closed, no changes to order",
        REFUNDED: "Refund processed and order marked as Refunded",
      };
      toast.success(effects[newStatus] || `Return ${newStatus.toLowerCase()} successfully`);
      fetchReturn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-bg2" />
        <div className="space-y-1">
          <div className="h-6 w-64 animate-pulse rounded bg-bg2" />
          <div className="h-4 w-40 animate-pulse rounded bg-bg2" />
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="h-32 animate-pulse rounded-xl bg-bg2" />
          <div className="h-48 animate-pulse rounded-xl bg-bg2" />
        </div>
        <div className="w-full space-y-4 lg:w-80">
          <div className="h-64 animate-pulse rounded-xl bg-bg2" />
        </div>
      </div>
    </div>
  );
  if (error) return <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</div>;
  if (!ret) return <p className="text-sm text-ink-2">Return not found</p>;

  const currentStatus = ret.status;
  const nextStatuses = STATUS_FLOW[currentStatus] ?? [];
  const statusInfo = statusConfig[currentStatus] ?? { label: currentStatus, color: "bg-bg2 text-ink-3 border-line", icon: Clock };
  const StatusIcon = statusInfo.icon;
  const isTerminal = nextStatuses.length === 0;

  const itemsList = Array.isArray(ret.items) ? ret.items : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-lg p-1.5 text-ink-2 transition-colors hover:bg-bg3 hover:text-ink">
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>
              Return — #{ret.orderNumber}
            </h1>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
              <StatusIcon className="h-3.5 w-3.5" strokeWidth={2} />
              {statusInfo.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">
            Requested on {new Date(ret.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          {/* Reason */}
          <Card>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Return Reason</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-sm text-ink-2">{ret.reason}</p>
              {ret.notes && (
                <div className="mt-3 rounded-lg bg-bg2 px-3 py-2 text-sm text-ink-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Customer Notes</span>
                  <p className="mt-0.5">{ret.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items requested for return */}
          {itemsList.length > 0 && (
            <Card>
              <CardHeader className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Return Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="divide-y divide-line">
                  {itemsList.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <p className="text-sm text-ink">{item.name}</p>
                      <p className="text-sm text-ink-2">× {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Info */}
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6">
            <Card>
              <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Customer</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 px-4 pb-4 text-sm sm:px-5 sm:pb-5">
                <p className="font-medium text-ink">{ret.contactName || "N/A"}</p>
                {ret.contactPhone && (
                  <p className="flex items-center gap-1 text-ink-2">
                    <Phone className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {ret.contactPhone}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Order Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4 text-sm sm:px-5 sm:pb-5">
                <div className="flex justify-between">
                  <span className="text-ink-2">Order Total</span>
                  <span className="font-semibold text-ink">AED {Number(ret.total).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Order Status</span>
                  <span className="text-ink">{ret.orderStatus.charAt(0) + ret.orderStatus.slice(1).toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Payment</span>
                  <span className="capitalize text-ink">{ret.paymentMethod?.replace("_", " ") || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Shipping</span>
                  <span className="capitalize text-ink">{ret.shippingMethod?.replace("_", " ") || "Standard"}</span>
                </div>
                {ret.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-ink-2">Delivered</span>
                    <span className="text-ink-2">{new Date(ret.deliveredAt).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Sidebar */}
        <div className="w-full space-y-4 lg:w-80">
          <Card className="lg:sticky lg:top-24">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
              <CardTitle className="text-sm font-semibold text-ink">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
              {/* Current Status */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-3">Return Status</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.color}`}>
                  <StatusIcon className="h-3.5 w-3.5" strokeWidth={2} />
                  {statusInfo.label}
                </span>
              </div>

              {/* Order Status */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-3">Order Status</p>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                  ret.orderStatus === "RETURNED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                  ret.orderStatus === "REFUNDED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {ret.orderStatus.charAt(0) + ret.orderStatus.slice(1).toLowerCase()}
                </span>
              </div>

              {/* Global Status Flow */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink-3">Lifecycle</p>
                <div className="space-y-1">
                  {[
                    { key: "PENDING", label: "Return Requested" },
                    { key: "APPROVED", label: "Stock Restored", sub: "Order → Returned" },
                    { key: "REFUNDED", label: "Refund Processed", sub: "Order → Refunded" },
                  ].map((step, i) => {
                    const isComplete = (
                      ret.status === "REFUNDED" ||
                      (step.key === "APPROVED" && ret.status === "APPROVED") ||
                      (step.key === "PENDING" && ret.status !== "REJECTED")
                    );
                    const isCurrent = (
                      (step.key === "PENDING" && ret.status === "PENDING") ||
                      (step.key === "APPROVED" && ret.status === "APPROVED") ||
                      (step.key === "REFUNDED" && ret.status === "REFUNDED")
                    );
                    const isSkipped = ret.status === "REJECTED" && step.key !== "PENDING";

                    return (
                      <div key={step.key} className="flex items-start gap-2">
                        <div className="flex flex-col items-center">
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSkipped ? "border-red-300 bg-red-50" :
                            isComplete ? "border-emerald-400 bg-emerald-50" :
                            "border-line bg-white"
                          }`}>
                            {isSkipped ? (
                              <XCircle className="h-3 w-3 text-red-400" strokeWidth={2.5} />
                            ) : isComplete ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />
                            ) : (
                              <div className="h-1.5 w-1.5 rounded-full bg-ink-3/30" />
                            )}
                          </div>
                          {i < 2 && (
                            <div className={`h-4 w-0.5 ${isComplete && !isSkipped ? "bg-emerald-300" : "bg-line"}`} />
                          )}
                        </div>
                        <div className={`pb-2 ${isCurrent ? "font-medium text-ink" : "text-ink-2"}`}>
                          <p className={`text-xs ${isSkipped ? "text-red-400 line-through" : ""}`}>{step.label}</p>
                          {step.sub && <p className="text-[10px] text-ink-3">{step.sub}</p>}
                        </div>
                      </div>
                    );
                  })}
                  {ret.status === "REJECTED" && (
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col items-center">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-300 bg-red-50">
                          <XCircle className="h-3 w-3 text-red-400" strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="pb-2 font-medium text-red-600">
                        <p className="text-xs">Return Rejected</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isTerminal ? (
                <div className="rounded-lg bg-bg2 px-3 py-2.5 text-xs text-ink-3">
                  No further actions available for this return.
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Actions</p>
                  <div className="flex flex-col gap-2">
                    {nextStatuses.map((status) => {
                      const config = actionConfig[status];
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
                          ) : status === "REFUNDED" ? (
                            <DollarSign className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={1.75} />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm">{config.label}</p>
                            <p className="text-[10px] text-ink-3">{config.description}</p>
                            <p className="text-[10px] font-medium text-brand">{config.effect}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {ret.trackingNumber && (
                <div className="rounded-lg bg-brand/5 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Tracking</p>
                  <p className="mt-0.5 text-sm font-medium text-ink">{ret.trackingNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!confirmStatus} onOpenChange={(open) => { if (!open) setConfirmStatus(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmStatus === "REJECTED" ? "Reject Return" :
               confirmStatus === "REFUNDED" ? "Process Refund" :
               "Approve Return"}
            </DialogTitle>
            <DialogDescription>
              {confirmStatus === "REJECTED"
                ? "Are you sure you want to reject this return request? The customer will be notified."
                : confirmStatus === "REFUNDED"
                  ? "Process the refund for this return. This will update the order status to Refunded."
                  : "Approve this return and restore items to inventory?"}
            </DialogDescription>
          </DialogHeader>

          {confirmStatus === "REJECTED" && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" strokeWidth={1.75} />
              <p className="text-xs text-red-700">
                Rejecting will close this return request. The customer will be notified of the rejection.
              </p>
            </div>
          )}

          {confirmStatus === "REFUNDED" && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3">
                <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={1.75} />
                <p className="text-xs text-emerald-700">
                  This will mark the order as refunded and update its status accordingly.
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Refund Amount (AED)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink/30"
                  placeholder="Enter refund amount"
                />
              </div>
            </div>
          )}

          {confirmStatus === "APPROVED" && (
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" strokeWidth={1.75} />
              <p className="text-xs text-blue-700">
                Stock will be restored for all returned items. The order status will change to Returned.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmStatus(null)} disabled={updating}>
              Cancel
            </Button>
            <Button
              variant={confirmStatus === "REJECTED" ? "destructive" : "default"}
              onClick={() => confirmStatus && handleStatusUpdate(confirmStatus)}
              disabled={updating}
              className="min-w-[100px]"
            >
              {updating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : confirmStatus === "REJECTED" ? (
                "Reject Return"
              ) : confirmStatus === "REFUNDED" ? (
                "Process Refund"
              ) : (
                "Approve Return"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
