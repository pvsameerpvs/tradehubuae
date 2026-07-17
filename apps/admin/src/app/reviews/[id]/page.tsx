"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  Star,
  User,
  Package,
  Mail,
  Check,
  X,
  Trash2,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MessageSquareText,
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@tradehubuae/ui";

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
  updatedAt: string;
  product?: ReviewProduct | null;
  user?: ReviewUser | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating ? "fill-amber-400 text-amber-400" : "text-ink-3"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get<Review>(`/reviews/${params.id}`)
      .then(setReview)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load review"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const toggleApproval = async () => {
    if (!review) return;
    setUpdating(true);
    try {
      const updated = await api.put<Review>(`/reviews/${review.id}`, {
        isApproved: !review.isApproved,
      });
      setReview(updated);
      toast.success(`Review ${updated.isApproved ? "approved" : "unapproved"}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update review";
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!review) return;
    setDeleting(true);
    try {
      await api.delete(`/reviews/${review.id}`);
      toast.success("Review deleted");
      router.push("/reviews");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete review";
      setError(msg);
      toast.error(msg);
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading)
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 animate-pulse rounded bg-bg2" />
        <div className="h-40 animate-pulse rounded-xl bg-bg2" />
        <div className="h-32 animate-pulse rounded-xl bg-bg2" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <MessageSquareText className="h-10 w-10 text-sale" strokeWidth={1.75} />
        <p className="text-sm text-sale">{error}</p>
        <Button onClick={() => router.push("/reviews")}>Back to Reviews</Button>
      </div>
    );

  if (!review)
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <MessageSquareText className="h-10 w-10 text-ink-3" strokeWidth={1.75} />
        <p className="text-sm font-medium text-ink-2">Review not found</p>
        <Button onClick={() => router.push("/reviews")}>Back to Reviews</Button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-1.5 text-ink-2 transition-colors hover:bg-bg3 hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1
              className="text-lg font-semibold text-ink sm:text-2xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              {review.title ?? "Product Review"}
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                review.isApproved
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {review.isApproved ? "Approved" : "Pending"}
            </span>
            {review.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                Verified Purchase
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-ink-3">
            Review by {review.user?.name ?? "Anonymous"}
          </p>
        </div>
      </div>

      {/* Rating & Product Info */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StarRating rating={review.rating} />
              <span className="text-sm font-medium text-ink">
                {review.rating} / 5
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-3">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
              {new Date(review.createdAt).toLocaleDateString([], {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 text-sm">
              <Package className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
              <span className="text-ink">
                {review.product?.name ?? "Unknown Product"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
              <span className="text-ink">{review.user?.name ?? "Anonymous"}</span>
              {review.user?.email && (
                <>
                  <span className="text-ink-3">·</span>
                  <a
                    href={`mailto:${review.user.email}`}
                    className="text-brand hover:underline"
                  >
                    <Mail className="mr-1 inline h-3.5 w-3.5" strokeWidth={1.75} />
                    {review.user.email}
                  </a>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Content */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-ink">Review</h2>
          {review.content ? (
            <p className="text-sm leading-relaxed text-ink-2">{review.content}</p>
          ) : (
            <p className="text-sm text-ink-3">No written content.</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-emerald-50/50 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <ThumbsUp className="h-3.5 w-3.5" strokeWidth={2} />
                Pros
              </div>
              {review.pros ? (
                <p className="text-sm text-ink-2">{review.pros}</p>
              ) : (
                <p className="text-sm text-ink-3">None listed</p>
              )}
            </div>
            <div className="rounded-lg bg-red-50/50 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-red-700">
                <ThumbsDown className="h-3.5 w-3.5" strokeWidth={2} />
                Cons
              </div>
              {review.cons ? (
                <p className="text-sm text-ink-2">{review.cons}</p>
              ) : (
                <p className="text-sm text-ink-3">None listed</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {!review.isApproved ? (
          <Button onClick={toggleApproval} disabled={updating}>
            {updating ? "Approving..." : "Approve Review"}
          </Button>
        ) : (
          <Button onClick={toggleApproval} variant="secondary" disabled={updating}>
            {updating ? "Rejecting..." : "Unapprove Review"}
          </Button>
        )}

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="text-sale">
              <Trash2 className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Review</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this review? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
