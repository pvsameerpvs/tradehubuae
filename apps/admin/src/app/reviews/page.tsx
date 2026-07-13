"use client";

import { useState, useEffect } from "react";
import { api, type PaginatedResponse } from "@/lib/api";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  isApproved: boolean;
  createdAt: string;
  user: { name: string } | null;
  product: { name: string } | null;
}

export default function ReviewsPage() {
  const [data, setData] = useState<PaginatedResponse<Review> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<Review>>("/reviews", { limit: 50, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reviews"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Reviews</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Customer reviews and ratings</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <p className="text-sm font-medium text-ink-2">No reviews yet</p>
            <p className="mt-1 text-xs text-ink-3">Customer reviews will appear here once products are purchased.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((review) => (
                <div key={review.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "text-brand fill-brand" : "text-ink-3"}`} strokeWidth={1.5} />
                      ))}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${review.isApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink">{review.user?.name ?? "Anonymous"}</p>
                  <p className="text-xs text-ink-3">{review.product?.name ?? "—"}</p>
                  {review.content && <p className="mt-1 text-xs text-ink-2 line-clamp-2">{review.content}</p>}
                </div>
              ))}
            </div>
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Review</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((review) => (
                  <tr key={review.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4 text-sm text-ink">{review.product?.name ?? "—"}</td>
                    <td className="p-4 text-sm text-ink">{review.user?.name ?? "Anonymous"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "text-brand fill-brand" : "text-ink-3"}`} strokeWidth={1.5} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      {review.title && <p className="text-sm font-medium text-ink">{review.title}</p>}
                      {review.content && <p className="text-xs text-ink-3 line-clamp-2">{review.content}</p>}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${review.isApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ink-2">
                      {new Date(review.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
