"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Mail, Phone, Building2, User, MessageSquare, Package } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

interface BulkRequestItem {
  id: string;
  productId: string;
  quantity: number;
  targetPrice: string | null;
  product?: { id: string; name: string; slug: string };
}

interface BulkRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  items: BulkRequestItem[];
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  QUOTED: "bg-blue-50 text-blue-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

const statusIcons: Record<string, string> = {
  PENDING: "⏳",
  QUOTED: "💰",
  APPROVED: "✅",
  REJECTED: "❌",
};

export default function BulkSaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<BulkRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get<BulkRequest>(`/bulk-sales/${params.id}`)
      .then(setRequest)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load request"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const updated = await api.put<BulkRequest>(`/bulk-sales/${params.id}/status`, { status });
      setRequest(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-2">Loading request...</p>;
  if (error) return <p className="text-sm text-sale">{error}</p>;
  if (!request) return <p className="text-sm text-ink-2">Request not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-lg p-1.5 text-ink-2 transition-colors hover:bg-bg3 hover:text-ink">
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>
              {request.companyName}
            </h1>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[request.status] ?? "bg-bg2 text-ink-3"}`}>
              {statusIcons[request.status]} {request.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-3">Bulk purchase request</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink">Contact Information</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
              <span className="text-ink">{request.contactName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
              <span className="text-ink">{request.companyName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
              <a href={`mailto:${request.email}`} className="text-brand hover:underline">{request.email}</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
              <a href={`tel:${request.phone}`} className="text-brand hover:underline">{request.phone}</a>
            </div>
          </div>
          {request.message && (
            <div className="flex items-start gap-3 text-sm">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.75} />
              <p className="text-ink-2">{request.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink">Requested Items</h2>
          {!request.items?.length ? (
            <p className="text-sm text-ink-3">No items listed</p>
          ) : (
            <div className="divide-y divide-line">
              {request.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
                    <div>
                      <p className="text-sm font-medium text-ink">{item.product?.name ?? item.productId}</p>
                      <p className="text-xs text-ink-3">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  {item.targetPrice && (
                    <span className="text-sm font-medium text-ink-2">Target: AED {Number(item.targetPrice).toFixed(2)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {request.status === "PENDING" && (
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => updateStatus("QUOTED")} disabled={updating}>
            {updating ? "Updating..." : "Send Quote"}
          </Button>
          <Button onClick={() => updateStatus("APPROVED")} variant="outline" disabled={updating}>
            Approve
          </Button>
          <Button onClick={() => updateStatus("REJECTED")} variant="secondary" disabled={updating}>
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
