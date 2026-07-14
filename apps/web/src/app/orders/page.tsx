"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";
import { Package, Search, ChevronRight } from "lucide-react";
import { orders as staticOrders, orderStatusColor, formatStatus } from "@/data";
import { getMyOrders, type OrderData } from "@/lib/actions/orders";

function OrderCard({ order }: { order: OrderData }) {
  const orderNumber = order.orderNumber;
  const items = order.items;
  return (
    <div className="rounded-xl border border-line bg-white p-4 transition-all hover:shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-ink">{orderNumber}</span>
            <Badge variant={orderStatusColor[order.status] || "default"} className="shrink-0">
              {formatStatus(order.status)}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink-2">
            {new Date(order.createdAt).toLocaleDateString("en-AE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {items.reduce((s: number, i: { qty?: number; quantity?: number }) => s + (i.qty || i.quantity || 1), 0)} item(s)
          </p>
          {order.contactName && (
            <p className="mt-0.5 text-xs text-ink-3">{order.contactName}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <p className="text-lg font-semibold text-ink">
            AED {Number(order.total).toLocaleString()}
          </p>
          <Link href={`/track-order?order=${encodeURIComponent(orderNumber)}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              Track
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-3 border-t border-line pt-3">
        <div className="flex flex-wrap gap-2">
          {items.map((item: { name: string; qty?: number; quantity?: number; price?: number; image?: string | null }, i: number) => (
            <span key={i} className="rounded-md bg-bg2 px-2.5 py-1 text-xs text-ink-2">
              {item.name} × {item.qty || item.quantity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function mapStaticToOrderData(o: typeof staticOrders[number]): OrderData {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    contactName: o.contactName,
    contactPhone: o.contactPhone,
    subtotal: o.subtotal,
    shippingCost: o.shippingCost,
    taxAmount: 0,
    discountAmount: 0,
    total: o.total,
    currency: "AED",
    paymentMethod: o.paymentMethod,
    shippingMethod: o.shippingMethod,
    trackingNumber: o.trackingNumber,
    estimatedDeliveryDate: o.estimatedDeliveryDate,
    shippedAt: null,
    deliveredAt: null,
    notes: null,
    createdAt: o.createdAt,
    updatedAt: o.createdAt,
    items: o.items.map((i) => ({
      id: "",
      name: i.name,
      sku: "",
      quantity: i.qty,
      unitPrice: String(i.price || 0),
      totalPrice: String((i.price || 0) * i.qty),
      image: i.image || null,
    })),
    user: null,
    shippingAddress: null,
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        setOrders(res.data.length > 0 ? res.data : null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const displayOrders = orders ?? (staticOrders.length > 0 ? staticOrders.map(mapStaticToOrderData) : []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
            My Orders
          </h1>
          <p className="mt-1 text-sm text-ink-2">
            Track and manage your orders
          </p>
        </div>
        <Link href="/track-order">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" strokeWidth={1.75} />
            Track by Order ID
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-32 rounded bg-bg2" />
                <div className="h-5 w-20 rounded-full bg-bg2" />
              </div>
              <div className="mt-3 h-4 w-48 rounded bg-bg2" />
              <div className="mt-3 flex gap-2">
                <div className="h-6 w-24 rounded-md bg-bg2" />
                <div className="h-6 w-20 rounded-md bg-bg2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && displayOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="mb-4 h-16 w-16 text-ink-3" strokeWidth={1} />
          <h2 className="mb-2 text-xl font-semibold text-ink">No orders yet</h2>
          <p className="mb-6 text-sm text-ink-2">
            Your order history will appear here once you make a purchase.
          </p>
          <Link href="/categories">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      )}

      {!loading && displayOrders.length > 0 && (
        <div className="space-y-4">
          {displayOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
