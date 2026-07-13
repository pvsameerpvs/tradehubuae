"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Building2, CheckCircle2, XCircle, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

interface BulkItem {
  productId: string;
  quantity: number;
  product?: { name: string; price: number };
}

interface BulkRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
  notes: string;
  items: BulkItem[];
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  quoted: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};

export default function BulkSaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [req, setReq] = useState<BulkRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    api.get<BulkRequest>(`/bulk-sales/${params.id}`)
      .then(setReq)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load request"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const updateStatus = async (status: string) => {
    setActionLoading(true);
    try {
      await api.put(`/bulk-sales/${params.id}`, { status });
      if (req) setReq({ ...req, status });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-2">Loading request...</p>;
  if (error) return <p className="text-sm text-sale">{error}</p>;
  if (!req) return <p className="text-sm text-ink-2">Request not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-lg p-1.5 text-ink-2 transition-colors hover:bg-bg3 hover:text-ink">
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>{req.companyName}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[req.status] ?? "bg-bg2 text-ink-3"}`}>
              {req.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Requested on {new Date(req.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-1">
              <p className="text-sm text-ink">{req.contactName}</p>
              <p className="text-sm text-ink-2">{req.email}</p>
              <p className="text-sm text-ink-2">{req.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Requested Items</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="divide-y divide-line sm:hidden">
                {req.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{item.product?.name ?? item.productId}</p>
                      <p className="text-xs text-ink-3">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-ink">
                        {item.product ? `AED ${(item.product.price * item.quantity).toFixed(2)}` : "—"}
                      </p>
                      {item.product && <p className="text-xs text-ink-3">AED {item.product.price.toFixed(2)} each</p>}
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden sm:table w-full">
                <thead>
                  <tr className="border-t border-line text-left text-xs text-ink-3 uppercase tracking-wider">
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium text-right">Qty</th>
                    <th className="p-4 font-medium text-right">Unit Price</th>
                    <th className="p-4 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {req.items.map((item, i) => (
                    <tr key={i} className="border-t border-line">
                      <td className="p-4 text-sm text-ink">{item.product?.name ?? item.productId}</td>
                      <td className="p-4 text-right text-sm text-ink">{item.quantity}</td>
                      <td className="p-4 text-right text-sm text-ink-2">{item.product ? `AED ${item.product.price.toFixed(2)}` : "—"}</td>
                      <td className="p-4 text-right text-sm font-semibold text-ink">
                        {item.product ? `AED ${(item.product.price * item.quantity).toFixed(2)}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {req.notes && (
            <Card>
              <CardHeader className="px-5 py-4">
                <CardTitle className="text-sm font-semibold text-ink">Notes</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-sm text-ink-2">{req.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="lg:sticky lg:top-24">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold text-ink">Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {req.status === "pending" && (
                <>
                  <Button className="w-full" onClick={() => updateStatus("quoted")} disabled={actionLoading}>
                    Mark as Quoted
                  </Button>
                  <Button className="w-full" variant="secondary" onClick={() => updateStatus("approved")} disabled={actionLoading}>
                    <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" strokeWidth={1.75} />
                    Approve
                  </Button>
                  <Button className="w-full" variant="secondary" onClick={() => updateStatus("rejected")} disabled={actionLoading}>
                    <XCircle className="mr-1.5 h-4 w-4 text-sale" strokeWidth={1.75} />
                    Reject
                  </Button>
                </>
              )}
              {req.status === "quoted" && (
                <>
                  <Button className="w-full" onClick={() => updateStatus("approved")} disabled={actionLoading}>
                    <CheckCircle2 className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
                    Approve Quote
                  </Button>
                  <Button className="w-full" variant="secondary" onClick={() => updateStatus("rejected")} disabled={actionLoading}>
                    <XCircle className="mr-1.5 h-4 w-4 text-sale" strokeWidth={1.75} />
                    Reject
                  </Button>
                </>
              )}
              {(req.status === "approved" || req.status === "rejected") && (
                <p className="text-center text-sm text-ink-3">No further actions available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
