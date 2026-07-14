"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@tradehubuae/ui";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertTriangle className="h-10 w-10 text-sale" strokeWidth={1.75} />
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-xl" style={{ letterSpacing: "-0.01em" }}>Something went wrong</h1>
          <p className="mt-1 text-sm text-ink-2">{error.message ?? "An unexpected error occurred"}</p>
        </div>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
