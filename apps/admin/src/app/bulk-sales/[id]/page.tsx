"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BulkSaleDetailPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="rounded-lg p-1.5 text-ink-2 transition-colors hover:bg-bg3 hover:text-ink">
          <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Bulk Sale Detail</h1>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-line bg-white p-12">
        <div className="text-center">
          <p className="text-sm font-medium text-ink-2">Bulk sales API not yet available</p>
          <p className="mt-1 text-xs text-ink-3">Bulk sales details will appear once the backend module is deployed.</p>
        </div>
      </div>
    </div>
  );
}
