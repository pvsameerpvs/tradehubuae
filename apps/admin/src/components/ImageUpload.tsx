"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { api } from "@/lib/api";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, label = "Image", folder = "uploads" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value ?? "");
  }, [value]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File too large (max 10MB)");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await api.upload(file, folder);
      onChange(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
      setPreview(value ?? "");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clearImage = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="" className="h-32 w-32 rounded-lg border border-line bg-bg2 object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -right-2 -top-2 rounded-full bg-sale p-0.5 text-white"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-line bg-bg2/50 text-ink-3 transition-colors hover:bg-bg2"
        >
          {uploading ? (
            <span className="text-sm text-ink-3">Uploading...</span>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="h-6 w-6" strokeWidth={1.75} />
              <span className="text-xs">{label}</span>
            </div>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
