"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, type PaginatedResponse } from "@/lib/api";
import { toast } from "sonner";
import {
  ShoppingBag,
  Users,
  Loader2,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Truck,
  AlertTriangle,
  User,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@tradehubuae/ui";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  customer: { name: string; email: string } | null;
  createdAt: string;
}

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  _count: { orders: number };
}

interface GroupedCustomer {
  email: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  latestOrder: Order;
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

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-violet-50 text-violet-700 border-violet-200",
  SHIPPED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURNED: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-ink-2/10 text-ink-2 border-ink-2/20",
};

const statusIcons: Record<string, typeof Clock> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PROCESSING: RefreshCw,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
  RETURNED: XCircle,
  REFUNDED: RefreshCw,
};

const TABS = [
  { id: "ordered", label: "Ordered Customers", icon: ShoppingBag },
  { id: "users", label: "All Customers", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CustomersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("ordered");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Customers</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">View customers and authenticated users</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg border border-line bg-white p-0.5 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-brand text-white"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "ordered" ? <OrderedCustomersTab /> : <AllUsersTab />}
    </div>
  );
}

function OrderedCustomersTab() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<{
    orderId: string;
    orderNumber: string;
    currentStatus: string;
  } | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    api
      .get<PaginatedResponse<Order>>("/orders", {
        limit: 100,
        sort: "createdAt",
        order: "desc",
      })
      .then((res) => setOrders(res.data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load orders")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const grouped = groupByCustomer(orders);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setUpdateTarget(null);
      setConfirmCancel(null);
      toast.success(`Order status updated to ${newStatus.charAt(0) + newStatus.slice(1).toLowerCase()}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const StatusIcon = updateTarget
    ? statusIcons[updateTarget.currentStatus] || Clock
    : Clock;

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-ink-3" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</div>
      ) : grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-line py-20">
          <ShoppingBag className="mb-3 h-10 w-10 text-ink-3" strokeWidth={1} />
          <p className="text-sm font-medium text-ink-2">No orders yet</p>
          <p className="mt-1 text-xs text-ink-3">Customers will appear once they place an order.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink-2">{grouped.length} customer(s) with orders</p>
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="divide-y divide-line sm:hidden">
              {grouped.map((c) => {
                const StatusIcon = statusIcons[c.latestOrder.status] || Clock;
                return (
                  <div
                    key={c.email}
                    className="px-4 py-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ink">{c.name || "Unnamed"}</p>
                      <span
                        onClick={() =>
                          setUpdateTarget({
                            orderId: c.latestOrder.id,
                            orderNumber: c.latestOrder.orderNumber,
                            currentStatus: c.latestOrder.status,
                          })
                        }
                        className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${statusStyles[c.latestOrder.status] ?? "bg-bg2 text-ink-3"}`}
                      >
                        <StatusIcon className="h-3 w-3" strokeWidth={2} />
                        {c.latestOrder.status.charAt(0) + c.latestOrder.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-ink-3">
                      <span>{c.email}</span>
                      <span>·</span>
                      <span>{c.orderCount} order(s)</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-ink-3">
                      <span>#{c.latestOrder.orderNumber}</span>
                      <span>{new Date(c.latestOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Orders</th>
                  <th className="p-4 font-medium">Latest Order</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Total Spent</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {grouped.map((c) => {
                  const StatusIcon = statusIcons[c.latestOrder.status] || Clock;
                  return (
                    <tr
                      key={c.email}
                      className="border-b last:border-0 transition-colors hover:bg-bg2"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                            <User className="h-4 w-4 text-brand" strokeWidth={1.75} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ink">{c.name || "Unnamed"}</p>
                            <p className="text-xs text-ink-3">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-ink">{c.orderCount}</span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => router.push(`/orders/${c.latestOrder.id}`)}
                          className="text-sm font-medium text-brand hover:underline"
                        >
                          #{c.latestOrder.orderNumber}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            setUpdateTarget({
                              orderId: c.latestOrder.id,
                              orderNumber: c.latestOrder.orderNumber,
                              currentStatus: c.latestOrder.status,
                            })
                          }
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${statusStyles[c.latestOrder.status] ?? "bg-bg2 text-ink-3"}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" strokeWidth={2} />
                          {c.latestOrder.status.charAt(0) + c.latestOrder.status.slice(1).toLowerCase()}
                        </button>
                      </td>
                      <td className="p-4 text-sm font-medium text-ink">
                        AED {c.totalSpent.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-ink-2">
                        {new Date(c.latestOrder.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => router.push(`/orders/${c.latestOrder.id}`)}
                          className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-bg3 hover:text-ink"
                        >
                          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Dialog
        open={!!updateTarget}
        onOpenChange={(open) => {
          if (!open) {
            setUpdateTarget(null);
            setConfirmCancel(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Order #{updateTarget?.orderNumber} &middot; Current status:{" "}
              {updateTarget?.currentStatus
                ? updateTarget.currentStatus.charAt(0) +
                  updateTarget.currentStatus.slice(1).toLowerCase()
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 rounded-lg bg-bg2 p-3">
            <StatusIcon className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-medium ${
                updateTarget
                  ? statusStyles[updateTarget.currentStatus] ?? "bg-bg2 text-ink-3"
                  : "bg-bg2 text-ink-3"
              }`}
            >
              {updateTarget?.currentStatus
                ? updateTarget.currentStatus.charAt(0) +
                  updateTarget.currentStatus.slice(1).toLowerCase()
                : ""}
            </span>
          </div>

          {(() => {
            const current = updateTarget?.currentStatus;
            const nextStatuses = current ? (STATUS_FLOW[current] ?? []) : [];
            if (!current || nextStatuses.length === 0) {
              return <p className="text-sm text-ink-3">No further status changes available for this order.</p>;
            }
            return (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">Move to</p>
                <div className="flex flex-col gap-2">
                  {nextStatuses.map((status) => {
                  const isDestructive = status === "CANCELLED";
                  const NextIcon = statusIcons[status] || Clock;
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        if (isDestructive) {
                          setConfirmCancel(status);
                        } else {
                          handleStatusUpdate(updateTarget.orderId, status);
                        }
                      }}
                      disabled={updating}
                      className={`flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
                        isDestructive
                          ? "border-red-200 bg-white text-red-600 hover:bg-red-50"
                          : "border-line bg-white text-ink hover:bg-bg2 hover:border-ink/20"
                      } disabled:opacity-50`}
                    >
                      <NextIcon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                      <span className="capitalize">
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          );
          })()}

          {confirmCancel && updateTarget && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-medium text-red-700">Confirm cancellation</p>
                <p className="mt-0.5 text-xs text-red-600">
                  This will cancel the order permanently. The customer will be notified.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmCancel(null)}
                    disabled={updating}
                  >
                    Keep Order
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleStatusUpdate(updateTarget.orderId, confirmCancel)}
                    disabled={updating}
                  >
                    {updating ? "Cancelling..." : "Cancel Order"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setUpdateTarget(null); setConfirmCancel(null); }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AllUsersTab() {
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse<UserItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<PaginatedResponse<UserItem>>("/customers", { limit: 100, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load customers")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-ink-3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
        {error}
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-line py-20">
        <Users className="mb-3 h-10 w-10 text-ink-3" strokeWidth={1} />
        <p className="text-sm font-medium text-ink-2">No users found</p>
        <p className="mt-1 text-xs text-ink-3">User accounts will appear here once they register.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-ink-2">{data.meta.total} registered customer(s)</p>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="divide-y divide-line sm:hidden">
          {data.data.map((customer) => (
            <div
              key={customer.id}
              onClick={() => router.push(`/customers/${customer.id}`)}
              className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-bg2"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                <User className="h-4 w-4 text-brand" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-ink">{customer.name || "Unnamed"}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${customer.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                  >
                    {customer.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="truncate text-xs text-ink-3">{customer.email}</p>
              </div>
            </div>
          ))}
        </div>
        <table className="hidden sm:table w-full">
          <thead>
            <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Orders</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Joined</th>
              <th className="p-4 font-medium" />
            </tr>
          </thead>
          <tbody>
            {data.data.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => router.push(`/customers/${customer.id}`)}
                className="cursor-pointer border-b last:border-0 transition-colors hover:bg-bg2"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                      <User className="h-4 w-4 text-brand" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{customer.name || "Unnamed"}</p>
                      <p className="text-xs text-ink-3">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-ink">{customer.email}</p>
                  {customer.phone && <p className="text-xs text-ink-3">{customer.phone}</p>}
                </td>
                <td className="p-4">
                  <span className="font-medium text-ink">{customer._count.orders}</span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      customer.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {customer.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4 text-sm text-ink-2">
                  {new Date(customer.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4">
                  <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function groupByCustomer(orders: Order[]): GroupedCustomer[] {
  const map = new Map<string, GroupedCustomer>();

  for (const order of orders) {
    if (!order.customer?.email) continue;

    const email = order.customer.email;
    const existing = map.get(email);

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.total;
    } else {
      map.set(email, {
        email,
        name: order.customer.name || "Unnamed",
        orderCount: 1,
        totalSpent: order.total,
        latestOrder: order,
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.latestOrder.createdAt).getTime() -
      new Date(a.latestOrder.createdAt).getTime()
  );
}
