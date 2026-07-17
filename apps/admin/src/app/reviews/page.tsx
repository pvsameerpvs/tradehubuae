"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, type PaginatedResponse } from "@/lib/api";
import { Button } from "@tradehubuae/ui";
import { Star, MessageSquareText, Check, X, ExternalLink } from "lucide-react";

interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
}

interface ReviewUser {
  id: string;
  name: string;
  email: string;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string | null;
  content: string | null;
  pros: string | null;
  cons: string | null;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  product?: ReviewProduct | null;
  user?: ReviewUser | null;
}

type FilterStatus = "all" | "approved" | "pending";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${star <= rating ? "fill-amber-400 text-amber-400" : "text-ink-3"}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

const filterTabs: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
];

export default function ReviewsPage() {
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse<Review> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const loadReviews = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get<PaginatedResponse<Review>>("/reviews", { limit: 50, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reviews"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const toggleApproval = async (review: Review) => {
    setUpdating(review.id);
    try {
      const updated = await api.put<Review>(`/reviews/${review.id}`, { isApproved: !review.isApproved });
      setData((prev) =>
        prev
          ? { ...prev, data: prev.data.map((r) => (r.id === review.id ? updated : r)) }
          : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = data?.data?.filter((r) => {
    if (filter === "approved") return r.isApproved;
    if (filter === "pending") return !r.isApproved;
    return true;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Reviews</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage product reviews from customers</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-bg2 p-1 sm:mb-6 sm:w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              filter === tab.value ? "bg-white text-ink shadow-sm" : "text-ink-2 hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-24 animate-pulse rounded bg-bg2" />
                <div className="h-4 w-32 animate-pulse rounded bg-bg2" />
                <div className="h-4 w-16 animate-pulse rounded bg-bg2" />
                <div className="h-4 w-48 animate-pulse rounded bg-bg2" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-bg2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="mb-3 text-sm text-sale">{error}</p>
            <Button variant="secondary" size="sm" onClick={loadReviews}>Retry</Button>
          </div>
        ) : !filtered?.length ? (
          <div className="p-6 text-center">
            <MessageSquareText className="mx-auto h-8 w-8 text-ink-3" strokeWidth={1.5} />
            <p className="mt-2 text-sm font-medium text-ink-2">
              {filter === "all" ? "No reviews yet" : filter === "approved" ? "No approved reviews" : "No pending reviews"}
            </p>
            <p className="mt-0.5 text-xs text-ink-3">
              {filter === "all"
                ? "Customer reviews will appear here once submitted."
                : "Try changing the filter to see more reviews."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="divide-y divide-line sm:hidden">
              {filtered.map((review) => (
                <div
                  key={review.id}
                  onClick={() => router.push(`/reviews/${review.id}`)}
                  className="cursor-pointer px-4 py-3 transition-colors hover:bg-bg2"
                >
                  <div className="flex items-center justify-between">
                    <p className="max-w-[60%] truncate text-sm font-medium text-ink">
                      {review.product?.name ?? "Unknown Product"}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        review.isApproved
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating rating={review.rating} size="xs" />
                    <span className="text-xs text-ink-3">{review.user?.name ?? "Anonymous"}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-ink-3">
                    {review.content ?? review.title ?? "No content"}
                  </p>
                  <p className="mt-1 text-[10px] text-ink-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Review</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((review) => (
                  <tr key={review.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <button
                        onClick={() => router.push(`/reviews/${review.id}`)}
                        className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                      >
                        {review.product?.name ?? "Unknown"}
                        <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                      </button>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-ink">{review.user?.name ?? "Anonymous"}</p>
                      <p className="text-xs text-ink-3">{review.user?.email ?? ""}</p>
                    </td>
                    <td className="p-4">
                      <StarRating rating={review.rating} />
                    </td>
                    <td className="max-w-[240px] p-4">
                      <p className="truncate text-sm text-ink">
                        {review.content ?? review.title ?? "—"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          review.isApproved
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ink-2">
                      {new Date(review.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleApproval(review);
                          }}
                          disabled={updating === review.id}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            review.isApproved
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {updating === review.id ? (
                            "..." 
                          ) : review.isApproved ? (
                            <>
                              <X className="h-3 w-3" strokeWidth={2} /> Reject
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3" strokeWidth={2} /> Approve
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {data && (
          <div className="border-t border-line px-4 py-3 text-xs text-ink-3">
            {data.meta?.total ?? 0} review{(data.meta?.total ?? 0) !== 1 ? "s" : ""} total
            {filter !== "all" ? ` (${filtered?.length ?? 0} shown)` : ""}
          </div>
        )}
      </div>
    </div>
  );
}
