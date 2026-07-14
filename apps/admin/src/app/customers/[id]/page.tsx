"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CustomerDetailPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back
      </button>
      <div className="flex items-center justify-center rounded-xl border border-line bg-white p-12">
        <div className="text-center">
          <p className="text-sm font-medium text-ink-2">Customer detail API not yet available</p>
          <p className="mt-1 text-xs text-ink-3">Customer details will appear once the backend module is deployed.</p>
        </div>
      </div>
    </div>
  );
}
