"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Badge } from "@tradehubuae/ui";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "details", label: "Account Details" },
  { id: "addresses", label: "Addresses" },
];

const recentOrders = [
  { id: "ORD-001", date: "2026-07-10", status: "Delivered", total: 5499, items: 1 },
  { id: "ORD-002", date: "2026-07-05", status: "Shipped", total: 698, items: 2 },
  { id: "ORD-003", date: "2026-06-28", status: "Processing", total: 1299, items: 1 },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                A
              </div>
              <div>
                <p className="font-medium">Ahmed Al Maktoum</p>
                <p className="text-sm text-muted-foreground">ahmed@example.com</p>
              </div>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="mt-1 text-2xl font-bold">12</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="mt-1 text-2xl font-bold">2</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                  <p className="mt-1 text-2xl font-bold">5</p>
                </div>
              </div>

              <div className="rounded-xl border bg-card">
                <div className="border-b p-4">
                  <h2 className="font-semibold">Recent Orders</h2>
                </div>
                <div className="divide-y">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date} &middot; {order.items} item(s)</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={order.status === "Delivered" ? "success" : order.status === "Shipped" ? "default" : "warning"}>
                          {order.status}
                        </Badge>
                        <p className="mt-1 text-sm font-medium">AED {order.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-4">
                  <Link href="/orders">
                    <Button variant="ghost" size="sm">View All Orders</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="rounded-xl border bg-card">
              <div className="border-b p-4">
                <h2 className="font-semibold">Order History</h2>
              </div>
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date} &middot; {order.items} item(s) &middot; AED {order.total}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={order.status === "Delivered" ? "success" : order.status === "Shipped" ? "default" : "warning"}>
                        {order.status}
                      </Badge>
                      <Link href="/track-order">
                        <Button variant="outline" size="sm">Track</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-6 font-semibold">Account Details</h2>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">First Name</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="Ahmed" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Last Name</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="Al Maktoum" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Email</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="ahmed@example.com" type="email" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Phone</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="+971 50 123 4567" type="tel" />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </form>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">Saved Addresses</h2>
                  <Button size="sm">Add New</Button>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="font-medium">Home</p>
                  <p className="text-sm text-muted-foreground">Sheikh Zayed Road, Downtown Dubai<br />Dubai, UAE</p>
                  <p className="mt-1 text-sm text-muted-foreground">+971 50 123 4567</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
