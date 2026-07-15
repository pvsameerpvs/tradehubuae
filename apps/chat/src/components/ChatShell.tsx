"use client";

import { useChatStore } from "@/lib/store";

export function ChatShell({ children }: { children: React.ReactNode }) {
  const isConnected = useChatStore((s) => s.isConnected);

  return (
    <div className="flex h-dvh flex-col bg-white">
      {!isConnected && (
        <div className="flex items-center justify-center gap-2 bg-amber-50 px-4 py-1.5 text-xs text-amber-700">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
          Reconnecting...
        </div>
      )}
      {children}
    </div>
  );
}
