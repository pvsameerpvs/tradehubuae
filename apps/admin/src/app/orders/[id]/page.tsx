"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
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
  User,
  Mail,
  Phone,
  ShoppingBag,
  RotateCcw,
  Printer,
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
  Badge,
} from "@tradehubuae/ui";
import JsBarcode from "jsbarcode";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  image: string | null;
  product?: { name: string; slug: string };
}

interface OrderUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
}

interface OrderAddress {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  emirate: string;
  country: string;
  zipCode: string | null;
}

interface OrderReturnInfo {
  id: string;
  status: string;
  reason: string;
  refundAmount: string | null;
  items: { id: string; quantity: number; name: string }[] | null;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string;
  shippingCost: string;
  taxAmount: string;
  discountAmount: string;
  total: string;
  currency: string;
  paymentMethod: string | null;
  paymentStatus: string;
  shippingMethod: string | null;
  contactName: string | null;
  contactPhone: string | null;
  trackingNumber: string | null;
  estimatedDeliveryDate: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: OrderUser | null;
  items: OrderItem[];
  payment: unknown[];
  shippingAddress: Record<string, string> | null;
  returnInfo: OrderReturnInfo | null;
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

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${order.id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      setConfirmStatus(null);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintOrder = useCallback(() => {
    if (!order) return;

    const temp = document.createElement("div");
    temp.style.cssText = "position:absolute;left:-9999px;top:0";
    document.body.appendChild(temp);

    const itemsBarcodes = order.items.map((item) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      temp.appendChild(svg);
      JsBarcode(svg, item.sku, {
        format: "CODE128", width: 0.15, height: 6,
        displayValue: false, margin: 0,
      });
      const bw = parseInt(svg.getAttribute("width") || "30", 10);
      const bh = parseInt(svg.getAttribute("height") || "6", 10);
      const content = new XMLSerializer().serializeToString(svg);
      temp.removeChild(svg);
      return { sku: item.sku, bw, bh, content, name: item.product?.name || item.name, qty: item.quantity, price: Number(item.unitPrice).toFixed(2) };
    });

    document.body.removeChild(temp);

    const subRows = itemsBarcodes.map((it, i) => `
      <tr>
        <td style="padding:3px 0;font-size:8px;color:#aaa;text-align:center;width:16px">${i + 1}</td>
        <td style="padding:3px 0;font-size:8px;color:#555;width:80px">${it.sku}</td>
        <td style="padding:3px 0;font-size:9px;color:#111">${it.name}</td>
        <td style="padding:3px 0;font-size:8px;text-align:center;width:22px">${it.qty}</td>
        <td style="padding:3px 0;text-align:right;font-size:8px;white-space:nowrap;width:56px">${it.price}</td>
      </tr>
      <tr><td colspan="5" style="padding:0 0 3px 16px"><svg xmlns="http://www.w3.org/2000/svg" width="${it.bw}" height="${it.bh}" viewBox="0 0 ${it.bw} ${it.bh}">${it.content.replace(/<svg[^>]*>|<\/svg>/g, "")}</svg></td></tr>
    `).join("");

    const addr = order.shippingAddress as Record<string, string> | null;
    const name = addr ? `${addr.firstName ?? ""} ${addr.lastName ?? ""}`.trim() : order.contactName ?? "";
    const phone = addr ? addr.phone ?? "" : order.contactPhone ?? "";
    const addr1 = addr ? addr.addressLine1 : "";
    const addr2 = addr ? (addr.addressLine2 ? addr.addressLine2 + "<br>" : "") : "";
    const city = addr ? `${addr.city ?? ""}, ${addr.emirate ?? ""}` : "";
    const country = addr ? addr.country ?? "" : "";

    const blob = new Blob([`<!DOCTYPE html><html><head>
<title>Order #${order.orderNumber}</title>
<style>
@page{margin:3mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:9px;color:#222;line-height:1.35;padding:2mm}
table{width:100%;border-collapse:collapse}
td{vertical-align:middle}
.label{font-size:6px;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px}
.val{font-size:9px;color:#111;line-height:1.5}
hr{border:none;border-top:1px solid #e5e5e5;margin:5px 0}
@media print{.no-print{display:none}}
</style>
</head><body>

<div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:5px">
  <div><span style="font-size:15px;font-weight:800;letter-spacing:1.5px">tradehubuae</span><br><span style="font-size:7px;color:#bbb;letter-spacing:.5px">PACKING SLIP</span></div>
  <div style="text-align:right;font-size:10px;font-weight:600">${order.orderNumber}<br><span style="font-size:7px;color:#999;font-weight:400">${new Date(order.createdAt).toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"})}</span></div>
</div>

<hr>

<div style="display:flex;gap:10px">
  <div style="flex:1">
    <div class="label">Ship To</div>
    <div class="val"><b>${name}</b><br>${phone}<br>${addr1}<br>${addr2}${city}<br>${country}</div>
  </div>
  ${order.notes ? `<div style="flex:1">
    <div class="label">Notes</div>
    <div class="val" style="font-style:italic;color:#666">${order.notes}</div>
  </div>` : ""}
</div>

<hr>

<table>
<thead><tr>
<td style="font-size:6px;color:#bbb;font-weight:600;text-transform:uppercase;letter-spacing:.3px;padding:2px 0;width:16px">#</td>
<td style="font-size:6px;color:#bbb;font-weight:600;text-transform:uppercase;letter-spacing:.3px;padding:2px 0;width:80px">SKU</td>
<td style="font-size:6px;color:#bbb;font-weight:600;text-transform:uppercase;letter-spacing:.3px;padding:2px 0">Item</td>
<td style="font-size:6px;color:#bbb;font-weight:600;text-transform:uppercase;letter-spacing:.3px;padding:2px 0;text-align:center;width:22px">Qty</td>
<td style="font-size:6px;color:#bbb;font-weight:600;text-transform:uppercase;letter-spacing:.3px;padding:2px 0;text-align:right;width:56px">Price</td>
</tr></thead>
<tbody>${subRows}</tbody>
</table>

<hr style="margin-top:2px">

<div style="text-align:right;font-size:8px;color:#555">
<div>Subtotal <span style="margin-left:8px">${Number(order.subtotal).toFixed(2)}</span></div>
<div>Shipping <span style="margin-left:8px">${Number(order.shippingCost).toFixed(2)}</span></div>
${Number(order.discountAmount) > 0 ? `<div style="color:#c00">Discount <span style="margin-left:8px">-${Number(order.discountAmount).toFixed(2)}</span></div>` : ""}
<div style="font-size:11px;font-weight:700;color:#000;margin-top:2px;padding-top:2px;border-top:1px solid #ddd">AED ${Number(order.total).toFixed(2)}</div>
</div>

<div style="text-align:center;font-size:6px;color:#ddd;margin-top:6px">${order.orderNumber} · tradehubuae</div>

<div class="no-print" style="text-align:center;margin-top:10px">
  <button onclick="window.print()" style="padding:8px 32px;font-size:14px;cursor:pointer;border:none;background:#111;color:#fff;border-radius:6px;font-weight:500">Print</button>
  <p style="margin-top:6px;font-size:12px;color:#888">Click Print to generate the packing slip</p>
</div>

</body></html>`], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }, [order]);

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
          <div className="h-64 animate-pulse rounded-xl bg-bg2" />
          <div className="h-48 animate-pulse rounded-xl bg-bg2" />
          <div className="h-40 animate-pulse rounded-xl bg-bg2" />
        </div>
        <div className="w-full space-y-4 lg:w-80">
          <div className="h-48 animate-pulse rounded-xl bg-bg2" />
          <div className="h-24 animate-pulse rounded-xl bg-bg2" />
        </div>
      </div>
    </div>
  );
  if (error) return <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</div>;
  if (!order) return <p className="text-sm text-ink-2">Order not found</p>;

  const currentStatus = order.status.toUpperCase();
  const nextStatuses = STATUS_FLOW[currentStatus] ?? [];
  const statusInfo = statusConfig[currentStatus] ?? { label: currentStatus, color: "bg-bg2 text-ink-3 border-line", icon: Clock };
  const StatusIcon = statusInfo.icon;
  const isTerminal = nextStatuses.length === 0;

  const fullName = order.contactName
    || (order.user ? [order.user.name, order.user.email].filter(Boolean).join(" - ") : null)
    || "N/A";

  const shippingAddr = order.shippingAddress as Record<string, string> | null;
  const customerDisplay = order.user;

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

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Items ({order.items.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="divide-y divide-line">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 px-4 py-4 sm:items-center sm:gap-4 sm:px-5">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bg2 sm:h-14 sm:w-14">
                      {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{item.product?.name || item.name}</p>
                      <p className="mt-0.5 text-xs text-ink-3">SKU: {item.sku} · Qty: {item.quantity}</p>
                    </div>
                    <p className="shrink-0 text-xs font-semibold text-ink sm:text-sm">AED {Number(item.unitPrice).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Return Info */}
          {order.returnInfo && (
            <Card className="border-rose-200 bg-rose-50/30">
              <CardHeader className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-rose-600" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Return Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-ink-2">
                      <span className="font-medium text-ink">Status:</span>{" "}
                      <span className="font-medium capitalize text-rose-700">{order.returnInfo.status.toLowerCase()}</span>
                    </p>
                    <p className="text-sm text-ink-2">
                      <span className="font-medium text-ink">Reason:</span> {order.returnInfo.reason}
                    </p>
                    {order.returnInfo.refundAmount && (
                      <p className="text-sm text-ink-2">
                        <span className="font-medium text-ink">Refund:</span> AED {Number(order.returnInfo.refundAmount).toLocaleString()}
                      </p>
                    )}
                    <p className="text-sm text-ink-2">
                      <span className="font-medium text-ink">Requested:</span>{" "}
                      {new Date(order.returnInfo.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <Link
                    href={`/returns/${order.returnInfo.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
                  >
                    <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                    View Return Details
                  </Link>
                </div>
                {order.returnInfo.items && order.returnInfo.items.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {order.returnInfo.items.map((item: any, i: number) => (
                      <span key={i} className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-xs text-ink-2">
                        {item.name} &times; {item.quantity}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Shipping Address + Payment */}
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6">
            <Card>
              <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Shipping Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 px-4 pb-4 text-sm sm:px-5 sm:pb-5">
                {shippingAddr ? (
                  <>
                    <p className="font-medium text-ink">{shippingAddr.firstName} {shippingAddr.lastName}</p>
                    <p className="text-ink-2">{shippingAddr.addressLine1}</p>
                    {shippingAddr.addressLine2 && <p className="text-ink-2">{shippingAddr.addressLine2}</p>}
                    <p className="text-ink-2">{shippingAddr.city}, {shippingAddr.emirate}</p>
                    <p className="text-ink-2">{shippingAddr.country}</p>
                    <p className="flex items-center gap-1 text-ink-3"><Phone className="h-3 w-3" strokeWidth={1.75} />{shippingAddr.phone}</p>
                  </>
                ) : order.contactName ? (
                  <>
                    <p className="font-medium text-ink">{order.contactName}</p>
                    <p className="flex items-center gap-1 text-ink-3"><Phone className="h-3 w-3" strokeWidth={1.75} />{order.contactPhone || "N/A"}</p>
                    <p className="mt-2 text-xs text-ink-3">Manual entry during checkout</p>
                  </>
                ) : (
                  <p className="text-ink-3">No shipping address on file</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  <CardTitle className="text-sm font-semibold text-ink">Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4 text-sm sm:px-5 sm:pb-5">
                <div className="flex justify-between">
                  <span className="text-ink-2">Subtotal</span>
                  <span className="text-ink">AED {Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Shipping</span>
                  <span className="text-ink">AED {Number(order.shippingCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Tax</span>
                  <span className="text-ink">AED {Number(order.taxAmount).toFixed(2)}</span>
                </div>
                {Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-brand">
                    <span className="text-ink-2">Discount</span>
                    <span>-AED {Number(order.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-line pt-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-ink">Total</span>
                    <span className="text-ink">AED {Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
                <p className="pt-1 text-xs text-ink-3">
                  via {order.paymentMethod?.replace("_", " ") || "N/A"}
                  {" · "}
                  <span className="capitalize">{order.paymentStatus.toLowerCase()}</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Info */}
          <Card>
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Customer</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
              {customerDisplay ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    {customerDisplay.image ? (
                      <img src={customerDisplay.image} alt="" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-brand" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{customerDisplay.name || "N/A"}</p>
                    <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
                        {customerDisplay.email || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" strokeWidth={1.75} />
                        {customerDisplay.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : order.contactName ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg2">
                    <User className="h-6 w-6 text-ink-3" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{order.contactName}</p>
                    <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2">
                      {order.contactPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" strokeWidth={1.75} />
                          {order.contactPhone}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-3">Guest checkout</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-ink-3">Guest checkout — no account linked</div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm sm:grid-cols-4 sm:gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Order Total</p>
                  <p className="mt-0.5 font-semibold text-ink">AED {Number(order.total).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Payment</p>
                  <p className="mt-0.5 font-medium capitalize text-ink">{order.paymentMethod?.replace("_", " ") || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Shipping</p>
                  <p className="mt-0.5 font-medium capitalize text-ink">{order.shippingMethod?.replace("_", " ") || "Standard"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Items</p>
                  <p className="mt-0.5 font-medium text-ink">{order.items.reduce((s, i) => s + i.quantity, 0)} unit(s)</p>
                </div>
              </div>
              {order.notes && (
                <div className="mt-3 rounded-lg bg-bg2 px-3 py-2 text-sm text-ink-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Notes</span>
                  <p className="mt-0.5">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Sidebar */}
        <div className="w-full space-y-4 lg:w-80">
          <Card className="lg:sticky lg:top-24">
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
              <CardTitle className="text-sm font-semibold text-ink">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
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

              {order.trackingNumber && (
                <div className="rounded-lg bg-brand/5 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Tracking</p>
                  <p className="mt-0.5 text-sm font-medium text-ink">{order.trackingNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
              <CardTitle className="text-sm font-semibold text-ink">Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5">
              <Button variant="outline" className="w-full" onClick={handlePrintOrder}>
                <Printer className="mr-2 h-4 w-4" /> Print Order
              </Button>
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
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
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
