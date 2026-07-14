"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

export default function MediaPage() {
  const [media, setMedia] = useState<{ url: string; filename: string }[]>([]);

  const handleUpload = (url: string) => {
    setMedia((prev) => [...prev, { url, filename: url.split("/").pop() ?? "image" }]);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Media</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Upload and manage images</p>
        </div>
      </div>
      <div className="mb-6">
        <ImageUpload value="" onChange={handleUpload} label="Upload Image" folder="uploads" />
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {media.length === 0 ? (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
