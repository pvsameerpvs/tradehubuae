"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Package,
  MapPin,
  CreditCard,
  ChevronRight,
  Loader2,
  ShoppingBag,
  User,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from "@tradehubuae/ui";

interface CustomerAddress {
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
  isDefault: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  image: string | null;
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  items: OrderItem[];
}

interface CustomerDetail {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  _count: { orders: number };
  orders: CustomerOrder[];
  addresses: CustomerAddress[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-violet-50 text-violet-700",
  SHIPPED: "bg-cyan-50 text-cyan-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
  RETURNED: "bg-rose-50 text-rose-700",
  REFUNDED: "bg-ink-2/10 text-ink-2",
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(() => {
    setLoading(true);
    api.get<CustomerDetail>(`/customers/${params.id}`)
      .then(setCustomer)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load customer"))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => { fetchCustomer(); }, [fetchCustomer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-ink-3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Back
        </button>
        <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">{error}</div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back
      </button>

      {/* Profile Header */}
      <Card>
        <CardContent className="px-6 py-6 sm:px-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand/10 sm:h-20 sm:w-20">
              {customer.image ? (
                <img src={customer.image} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-brand" strokeWidth={1.5} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>
                  {customer.name || "Unnamed Customer"}
                </h1>
                <Badge variant={customer.isActive ? "default" : "destructive"} className="text-xs">
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" strokeWidth={1.75} />
                  {customer.email}
                </span>
                {customer.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" strokeWidth={1.75} />
                    {customer.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" strokeWidth={1.75} />
                  Joined {new Date(customer.createdAt).toLocaleDateString("en-AE", { month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                  {customer._count.orders} order(s)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Order History</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {customer.orders.length === 0 ? (
                <div className="flex flex-col items-center px-5 py-10 text-center">
                  <ShoppingBag className="mb-2 h-8 w-8 text-ink-3" strokeWidth={1} />
                  <p className="text-sm text-ink-2">No orders yet</p>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {customer.orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-bg2/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status] || "bg-bg2 text-ink-3"}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-ink-3">
                          {new Date(order.createdAt).toLocaleDateString("en-AE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {" · "}
                          {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {order.items.slice(0, 3).map((item) => (
                            <span key={item.id} className="rounded-md bg-bg2 px-1.5 py-0.5 text-[10px] text-ink-3">
                              {item.name} × {item.quantity}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-[10px] text-ink-3">+{order.items.length - 3} more</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="shrink-0 text-sm font-semibold text-ink">
                          AED {Number(order.total).toLocaleString()}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.75} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Addresses Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Saved Addresses</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-5 pb-5">
              {customer.addresses.length === 0 ? (
                <p className="text-sm text-ink-3">No addresses saved</p>
              ) : (
                customer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-lg border p-3 text-sm ${addr.isDefault ? "border-brand/30 bg-brand/5" : "border-line"}`}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink">{addr.firstName} {addr.lastName}</p>
                      {addr.isDefault && (
                        <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-ink-2">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-ink-2">{addr.addressLine2}</p>}
                    <p className="text-ink-2">{addr.city}, {addr.emirate}</p>
                    <p className="mt-1 flex items-center gap-1 text-ink-3">
                      <Phone className="h-3 w-3" strokeWidth={1.75} />
                      {addr.phone}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-5 pb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-2">Customer since</span>
                <span className="font-medium text-ink">
                  {new Date(customer.createdAt).toLocaleDateString("en-AE", { month: "short", year: "numeric" })}
                </span>
              </div>
              {customer.lastLoginAt && (
                <div className="flex justify-between">
                  <span className="text-ink-2">Last login</span>
                  <span className="font-medium text-ink">
                    {new Date(customer.lastLoginAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink-2">Total orders</span>
                <span className="font-medium text-ink">{customer._count.orders}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
