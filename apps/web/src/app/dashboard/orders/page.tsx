"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button, Input, Badge } from "@tradehubuae/ui";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Package,
  Phone,
  User,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { ORDER_STATUS } from "@tradehubuae/config";
import { orders as staticOrders, formatStatus, orderStatusColor } from "@/data";
import { getAllOrders, type OrderData } from "@/lib/actions/orders";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: ORDER_STATUS.PENDING, label: "Pending" },
  { value: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
  { value: ORDER_STATUS.PROCESSING, label: "Processing" },
  { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
  { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
  { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
  { value: ORDER_STATUS.RETURNED, label: "Returned" },
  { value: ORDER_STATUS.REFUNDED, label: "Refunded" },
];

function OrderRow({ order }: { order: OrderData }) {
  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="block border-b border-line transition-colors last:border-0 hover:bg-bg2/50"
    >
      <div className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-5 sm:items-center sm:gap-4">
        <div className="min-w-0 sm:col-span-2">
          <p className="truncate text-sm font-medium text-ink">{order.orderNumber}</p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-2">
            <User className="h-3 w-3" strokeWidth={1.75} />
            <span className="truncate">{order.contactName || order.user?.name || "Guest"}</span>
          </div>
          {order.contactPhone && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-3">
              <Phone className="h-3 w-3" strokeWidth={1.75} />
              <span>{order.contactPhone}</span>
            </div>
          )}
        </div>
        <div className="sm:text-center">
          <Badge variant={orderStatusColor[order.status] || "default"} className="text-[11px]">
            {formatStatus(order.status)}
          </Badge>
        </div>
        <div className="sm:text-right">
          <p className="text-sm font-semibold text-ink">
            AED {Number(order.total).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end sm:gap-4">
          <p className="text-xs text-ink-3">
            {new Date(order.createdAt).toLocaleDateString("en-AE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
        </div>
      </div>
    </Link>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>(() =>
    staticOrders.map((o) => ({
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
    })),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllOrders({ page, limit: 20, status: statusFilter || undefined, search: search || undefined });
      setOrders(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setOrders(staticOrders);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>
          Orders
        </h1>
        <p className="mt-1 text-sm text-ink-2">
          View and manage all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
            <Input
              placeholder="Search by order #, name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  fetchOrders();
                }
              }}
              className="h-10 pl-10 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setStatusFilter(opt.value);
                  setPage(1);
                }}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === opt.value
                    ? "bg-ink text-white"
                    : "border border-line bg-white text-ink-2 hover:border-ink/30 hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchOrders}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.75} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-line bg-white">
        {loading ? (
          <div className="space-y-0 divide-y divide-line">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse p-4">
                <div className="flex items-center gap-4">
                  <div className="h-5 w-40 rounded bg-bg2" />
                  <div className="h-5 w-20 rounded-full bg-bg2" />
                  <div className="h-5 w-24 rounded bg-bg2" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <Package className="mb-3 h-12 w-12 text-ink-3" strokeWidth={1} />
            <p className="text-sm font-medium text-ink-2">No orders found</p>
            <p className="text-xs text-ink-3">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            <div className="hidden px-4 py-3 sm:grid sm:grid-cols-5">
              <p className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-ink-3">Order / Customer</p>
              <p className="text-center text-[10px] font-bold uppercase tracking-wider text-ink-3">Status</p>
              <p className="text-right text-[10px] font-bold uppercase tracking-wider text-ink-3">Total</p>
              <p className="text-right text-[10px] font-bold uppercase tracking-wider text-ink-3">Date</p>
            </div>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            Previous
          </Button>
          <span className="text-sm text-ink-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </div>
      )}
    </div>
  );
}
