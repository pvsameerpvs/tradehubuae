"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Package, MapPin, CreditCard, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import Link from "next/link";

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

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-violet-50 text-violet-700",
  shipped: "bg-cyan-50 text-cyan-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-rose-50 text-rose-700",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Order>(`/orders/${params.id}`)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load order"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-sm text-ink-2">Loading order...</p>;
  if (error) return <p className="text-sm text-sale">{error}</p>;
  if (!order) return <p className="text-sm text-ink-2">Order not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-lg p-1.5 text-ink-2 transition-colors hover:bg-bg3 hover:text-ink">
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Order #{order.orderNumber}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] ?? "bg-bg2 text-ink-3"}`}>
              {order.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Placed on {new Date(order.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}</p>
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.productName}</p>
                      <p className="text-xs text-ink-3">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-ink">AED {item.price.toFixed(2)}</p>
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
                <p className="text-sm text-ink-2">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
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
              <CardContent className="px-5 pb-5 space-y-2">
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
            <CardContent className="px-5 pb-5 space-y-1">
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
            <CardContent className="px-5 pb-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] ?? "bg-bg2 text-ink-3"}`}>
                  {order.status}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
