"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  address?: {
    line1: string;
    city: string;
    state: string;
    country: string;
  };
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Customer>(`/customers/${params.id}`)
      .then(setCustomer)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load customer"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-sm text-ink-2">Loading customer...</p>;
  if (error) return <p className="text-sm text-sale">{error}</p>;
  if (!customer) return <p className="text-sm text-ink-2">Customer not found</p>;

  const initials = customer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back
      </button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-lg font-semibold text-white">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>{customer.name}</h1>
              <p className="text-sm text-ink-2">Customer since {new Date(customer.createdAt).toLocaleDateString([], { month: "long", year: "numeric" })}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/5">
              <ShoppingBag className="h-5 w-5 text-brand" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs text-ink-2">Total Orders</p>
              <p className="text-lg font-semibold text-ink">{customer.totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <ShoppingBag className="h-5 w-5 text-emerald-600" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs text-ink-2">Total Spent</p>
              <p className="text-lg font-semibold text-ink">AED {customer.totalSpent.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-5 py-4">
          <CardTitle className="text-sm font-semibold text-ink">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
            <span className="text-ink">{customer.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
            <span className="text-ink">{customer.phone}</span>
          </div>
          {customer.address && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.75} />
              <span className="text-ink">
                {customer.address.line1}, {customer.address.city}, {customer.address.state}, {customer.address.country}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
