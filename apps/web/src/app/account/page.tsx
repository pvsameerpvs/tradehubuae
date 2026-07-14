"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";
import { orderStatusColor, formatStatus } from "@/data";
import { getMyOrders, type OrderData } from "@/lib/actions/orders";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "details", label: "Account Details" },
  { id: "addresses", label: "Addresses" },
];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-sm text-ink-2">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PROCESSING" || o.status === "SHIPPED",
  );
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
        My Account
      </h1>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-line bg-white p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">Ahmed Al Maktoum</p>
                <p className="truncate text-sm text-ink-2">ahmed@example.com</p>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-brand text-white"
                      : "text-ink-2 hover:bg-bg3 hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <hr className="my-4" />
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Total Orders" value={String(orders.length)} />
                <StatCard label="Active Orders" value={String(activeOrders.length)} />
                <StatCard label="Wishlist Items" value="5" />
              </div>

              <div className="rounded-xl border border-line bg-white">
                <div className="border-b border-line p-4">
                  <h2 className="font-semibold text-ink">Recent Orders</h2>
                </div>
                {recentOrders.length === 0 && !loading ? (
                  <div className="p-6 text-center text-sm text-ink-2">No orders yet</div>
                ) : (
                  <div className="divide-y divide-line">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{order.orderNumber}</p>
                          <p className="mt-0.5 text-sm text-ink-2">
                            {new Date(order.createdAt).toLocaleDateString("en-AE", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            {" · "}
                            {order.items.length} item(s)
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <Badge variant={orderStatusColor[order.status] || "default"}>
                            {formatStatus(order.status)}
                          </Badge>
                          <p className="mt-1 text-sm font-medium text-ink">AED {Number(order.total).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-line p-4">
                  <Link href="/orders">
                    <Button variant="ghost" size="sm">View All Orders</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="rounded-xl border border-line bg-white">
              <div className="border-b border-line p-4">
                <h2 className="font-semibold text-ink">Order History</h2>
              </div>
              {orders.length === 0 && !loading ? (
                <div className="p-6 text-center text-sm text-ink-2">No orders yet</div>
              ) : (
                <div className="divide-y divide-line">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{order.orderNumber}</p>
                        <p className="mt-0.5 text-sm text-ink-2">
                          {new Date(order.createdAt).toLocaleDateString("en-AE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {" · "}
                          {order.items.length} item(s)
                          {" · "}
                          AED {Number(order.total).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Badge variant={orderStatusColor[order.status] || "default"}>
                          {formatStatus(order.status)}
                        </Badge>
                        <Link href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}>
                          <Button variant="outline" size="sm">Track</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="rounded-xl border border-line bg-white p-6">
              <h2 className="mb-6 font-semibold text-ink">Account Details</h2>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">First Name</label>
                    <input className="flex h-10 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink" defaultValue="Ahmed" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Last Name</label>
                    <input className="flex h-10 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink" defaultValue="Al Maktoum" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
                    <input className="flex h-10 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink" defaultValue="ahmed@example.com" type="email" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">Phone</label>
                    <input className="flex h-10 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink" defaultValue="+971 50 123 4567" type="tel" />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </form>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-line bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-ink">Saved Addresses</h2>
                  <Button size="sm">Add New</Button>
                </div>
                <div className="rounded-lg border border-line bg-bg2/30 p-4">
                  <p className="font-medium text-ink">Home</p>
                  <p className="mt-1 text-sm text-ink-2">
                    Sheikh Zayed Road, Downtown Dubai<br />
                    Dubai, UAE
                  </p>
                  <p className="mt-1 text-sm text-ink-2">+971 50 123 4567</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
