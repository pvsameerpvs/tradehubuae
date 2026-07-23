"use client";

import { useState, useEffect } from "react";
import { ImageIcon, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@tradehubuae/ui";
import { api } from "@/lib/api";

export default function MediaPage() {
  const [media, setMedia] = useState<{ url: string; filename: string }[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ url: string; filename: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ url: string; filename: string }[]>("/media")
      .then(setMedia)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load media"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = (url: string) => {
    setMedia((prev) => [...prev, { url, filename: url.split("/").pop() ?? "image" }]);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      const id = deleteTarget.url.split("/").pop() ?? "";
      await api.delete(`/media/${id}`);
      setMedia((prev) => prev.filter((item) => item.url !== deleteTarget.url));
      setDeleteTarget(null);
      toast.success("Image deleted");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete image";
      setError(msg);
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Media</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Upload and manage images</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-sale/20 bg-sale/5 px-4 py-3 text-sm text-sale">
          {error}
        </div>
      )}

      <div className="mb-6">
        <ImageUpload value="" onChange={handleUpload} label="Upload Image" folder="uploads" />
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4 sm:gap-4 sm:p-6 md:grid-cols-5 lg:grid-cols-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-bg2" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-sm text-sale">{error}</p>
          </div>
        ) : media.length === 0 ? (
          <div className="p-6 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-ink-3" strokeWidth={1.5} />
            <p className="mt-2 text-sm font-medium text-ink-2">No media yet</p>
            <p className="mt-0.5 text-xs text-ink-3">Upload images to use across your store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4 sm:gap-4 sm:p-6 md:grid-cols-5 lg:grid-cols-6">
            {media.map((item, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-bg2">
                <img src={item.url} alt={item.filename} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-[10px] text-white">{item.filename}</p>
                </div>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-sale group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
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
  );
}
