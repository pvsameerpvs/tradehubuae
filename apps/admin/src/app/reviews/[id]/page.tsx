"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Star, ThumbsUp, Flag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  status: string;
  customerName: string;
  productName: string;
  createdAt: string;
}

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    api.get<Review>(`/reviews/${params.id}`)
      .then(setReview)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load review"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const updateStatus = async (status: string) => {
    setActionLoading(true);
    try {
      await api.put(`/reviews/${params.id}`, { status });
      if (review) setReview({ ...review, status });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-2">Loading review...</p>;
  if (error) return <p className="text-sm text-sale">{error}</p>;
  if (!review) return <p className="text-sm text-ink-2">Review not found</p>;

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back
      </button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/5">
                <Star className="h-6 w-6 text-brand" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>{review.title}</h1>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < review.rating ? "fill-brand text-brand" : "text-ink-3"}`}
                        strokeWidth={1.75}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-ink-2">by {review.customerName}</span>
                </div>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              review.status === "approved" ? "bg-emerald-50 text-emerald-700" :
              review.status === "rejected" ? "bg-red-50 text-red-700" :
              "bg-amber-50 text-amber-700"
            }`}>
              {review.status}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <CardTitle className="text-sm font-semibold text-ink">Review</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-sm text-ink">{review.comment}</p>
              <p className="mt-3 text-xs text-ink-3">Posted on {new Date(review.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold text-ink">Product</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-sm text-ink">{review.productName}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="lg:sticky lg:top-24">
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold text-ink">Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {review.status === "pending" && (
                <>
                  <Button className="w-full" onClick={() => updateStatus("approved")} disabled={actionLoading}>
                    <ThumbsUp className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
                    Approve
                  </Button>
                  <Button className="w-full" variant="secondary" onClick={() => updateStatus("rejected")} disabled={actionLoading}>
                    <Flag className="mr-1.5 h-4 w-4 text-sale" strokeWidth={1.75} />
                    Reject
                  </Button>
                </>
              )}
              {review.status !== "pending" && (
                <p className="text-center text-sm text-ink-3">Review has been {review.status}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
