"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  MapPin,
  Heart,
  LogOut,
  Package,
  Clock,
  ChevronRight,
  Plus,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import { orderStatusColor, formatStatus } from "@/data";
import { getMyOrders, type OrderData } from "@/lib/actions/orders";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressData,
  type CreateAddressInput,
  type UpdateAddressInput,
} from "@/lib/actions/addresses";
import { AddressCard } from "@/components/shared/AddressCard";
import { AddressForm } from "@/components/shared/AddressForm";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "details", label: "Account Details", icon: UserCircle },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Package }) {
  return (
    <div className="group rounded-xl border border-line bg-white p-4 transition-all duration-200 hover:shadow-card sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 transition-colors group-hover:bg-brand/20 sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 text-brand sm:h-6 sm:w-6" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-ink-2 sm:text-sm">{label}</p>
          <p className="text-xl font-bold text-ink sm:text-2xl">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      getMyOrders()
        .then((res) => setOrders(res.data))
        .catch(() => {})
        .finally(() => setOrdersLoading(false)),
      getAddresses()
        .then(setAddresses)
        .catch(() => {})
        .finally(() => setLoading(false)),
    ]);
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PROCESSING" || o.status === "SHIPPED",
  );
  const recentOrders = orders.slice(0, 3);

  const handleSaveAddress = useCallback(async (data: CreateAddressInput | UpdateAddressInput) => {
    if (editingAddress) {
      const updated = await updateAddress(editingAddress.id, data);
      setAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? updated : a)));
    } else {
      const created = await createAddress(data as CreateAddressInput);
      setAddresses((prev) => [...prev, created]);
    }
    setEditingAddress(null);
  }, [editingAddress]);

  const handleDeleteAddress = useCallback(async (id: string) => {
    await deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleSetDefault = useCallback(async (id: string) => {
    await setDefaultAddress(id);
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const openEditAddress = useCallback((addr: AddressData) => {
    setEditingAddress(addr);
    setAddressFormOpen(true);
  }, []);

  const openAddAddress = useCallback(() => {
    setEditingAddress(null);
    setAddressFormOpen(true);
  }, []);

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          My Account
        </h1>
        <p className="mt-1 text-sm text-ink-2 sm:text-base">Manage your profile, orders, and addresses</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-lg font-bold text-white shadow-sm">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">Ahmed Al Maktoum</p>
                <p className="truncate text-sm text-ink-2">ahmed@example.com</p>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-brand text-white shadow-sm"
                        : "text-ink-2 hover:bg-bg2 hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            <hr className="my-4 border-line" />
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-sale transition-all duration-200 hover:bg-sale/5">
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Tab Selector */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileTabOpen(!mobileTabOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-line bg-white px-4 py-3.5 text-sm font-medium text-ink shadow-sm transition-all duration-200"
          >
            <span className="flex items-center gap-3">
              {tabs.find((t) => t.id === activeTab)?.icon && (
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10">
                  {(() => {
                    const Icon = tabs.find((t) => t.id === activeTab)?.icon;
                    return Icon ? <Icon className="h-4 w-4 text-brand" strokeWidth={1.5} /> : null;
                  })()}
                </span>
              )}
              <span>{tabs.find((t) => t.id === activeTab)?.label ?? "Overview"}</span>
            </span>
            <ChevronDown className={`h-4 w-4 text-ink-3 transition-transform duration-200 ${mobileTabOpen ? "rotate-180" : ""}`} strokeWidth={2} />
          </button>
          {mobileTabOpen && (
            <div className="mt-1.5 overflow-hidden rounded-xl border border-line bg-white shadow-sm animate-fade-in">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileTabOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id ? "bg-brand/10 text-brand" : "text-ink-2 hover:bg-bg2"
                    } ${i < tabs.length - 1 ? "border-b border-line" : ""}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <StatCard label="Total Orders" value={String(orders.length)} icon={ShoppingBag} />
                <StatCard label="Active" value={String(activeOrders.length)} icon={Clock} />
                <StatCard label="Wishlist" value="5" icon={Heart} />
              </div>

              <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <h2 className="text-sm font-semibold text-ink sm:text-base">Recent Orders</h2>
                  <button onClick={() => setActiveTab("orders")} className="text-sm font-medium text-brand transition-colors hover:text-brand-dark">
                    View All
                  </button>
                </div>
                {recentOrders.length === 0 && !ordersLoading ? (
                  <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2">
                      <Package className="h-7 w-7 text-ink-3" strokeWidth={1} />
                    </div>
                    <p className="text-sm text-ink-2">No orders yet</p>
                    <Link href="/">
                      <Button size="sm">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-line">
                    {recentOrders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
                        className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-bg2/50"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink sm:text-base">{order.orderNumber}</p>
                          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">
                            {new Date(order.createdAt).toLocaleDateString("en-AE", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            {" · "}
                            {order.items.length} item(s)
                          </p>
                        </div>
                        <div className="ml-3 flex shrink-0 items-center gap-3">
                          <div className="hidden sm:block">
                            <Badge variant={orderStatusColor[order.status] || "default"}>
                              {formatStatus(order.status)}
                            </Badge>
                          </div>
                          <div className="sm:hidden">
                            <Badge variant={orderStatusColor[order.status] || "default"} className="text-[10px]">
                              {formatStatus(order.status)}
                            </Badge>
                          </div>
                          <span className="text-sm font-semibold text-ink">AED {Number(order.total).toLocaleString()}</span>
                          <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={2} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
              <div className="border-b border-line px-5 py-4">
                <h2 className="text-sm font-semibold text-ink sm:text-base">Order History</h2>
              </div>
              {orders.length === 0 && !ordersLoading ? (
                <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2">
                    <Package className="h-7 w-7 text-ink-3" strokeWidth={1} />
                  </div>
                  <p className="text-sm text-ink-2">No orders yet</p>
                  <Link href="/">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}
                      className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-bg2/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink sm:text-base">{order.orderNumber}</p>
                        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">
                          {new Date(order.createdAt).toLocaleDateString("en-AE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {" · "}
                          {order.items.length} item(s)
                        </p>
                      </div>
                      <div className="ml-3 flex shrink-0 items-center gap-3">
                        <Badge variant={orderStatusColor[order.status] || "default"} className="hidden text-xs sm:inline-flex">
                          {formatStatus(order.status)}
                        </Badge>
                        <span className="text-sm font-semibold text-ink">AED {Number(order.total).toLocaleString()}</span>
                        <ChevronRight className="h-4 w-4 text-ink-3" strokeWidth={2} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-ink sm:text-base">Account Details</h2>
                <p className="mt-1 text-sm text-ink-2">Update your personal information</p>
              </div>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">First Name</label>
                    <input
                      className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
                      defaultValue="Ahmed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Last Name</label>
                    <input
                      className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
                      defaultValue="Al Maktoum"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Email</label>
                    <input
                      className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
                      defaultValue="ahmed@example.com"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Phone</label>
                    <input
                      className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
                      defaultValue="+971 50 123 4567"
                      type="tel"
                    />
                  </div>
                </div>
                <div className="pt-1 sm:pt-2">
                  <Button size="default" className="h-11 text-sm sm:h-12 sm:text-base">Save Changes</Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-ink sm:text-base">Saved Addresses</h2>
                  <p className="mt-0.5 text-sm text-ink-2">{addresses.length} address(es) on file</p>
                </div>
                <Button size="sm" className="h-9 text-xs sm:h-10 sm:text-sm" onClick={openAddAddress}>
                  <Plus className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Add New
                </Button>
              </div>

              {loading ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-28 animate-pulse rounded-xl bg-bg3 sm:h-32" />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-white px-6 py-14 text-center shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2">
                    <MapPin className="h-7 w-7 text-ink-3" strokeWidth={1} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink sm:text-base">No addresses saved</p>
                    <p className="mt-1 text-xs text-ink-2 sm:text-sm">Add an address for faster checkout</p>
                  </div>
                  <Button onClick={openAddAddress}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Address
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      onEdit={openEditAddress}
                      onDelete={handleDeleteAddress}
                      onSetDefault={handleSetDefault}
                    />
                  ))}
                </div>
              )}

              <AddressForm
                open={addressFormOpen}
                onOpenChange={(open) => {
                  setAddressFormOpen(open);
                  if (!open) setEditingAddress(null);
                }}
                address={editingAddress}
                onSave={handleSaveAddress}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
