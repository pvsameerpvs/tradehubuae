"use client";

import { useState, useCallback } from "react";
import { useChatStore } from "@/lib/store";
import type { OnlineStatus } from "@/types";
import { cn } from "@tradehubuae/ui";

const STATUS_CONFIG: Record<OnlineStatus, { color: string; label: string }> = {
  online: { color: "bg-green-500", label: "Online" },
  away: { color: "bg-amber-500", label: "Away" },
  offline: { color: "bg-gray-400", label: "Offline" },
};

export function StatusToggle() {
  const onlineStatus = useChatStore((s) => s.onlineStatus);
  const setOnlineStatus = useChatStore((s) => s.setOnlineStatus);
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (status: OnlineStatus) => {
      setOnlineStatus(status);
      setOpen(false);
    },
    [setOnlineStatus]
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs hover:bg-bg2"
      >
        <span className={cn("inline-block h-2 w-2 rounded-full", STATUS_CONFIG[onlineStatus].color)} />
        <span className="text-ink-2">{STATUS_CONFIG[onlineStatus].label}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-line bg-white shadow-panel animate-fade-in">
            {(Object.entries(STATUS_CONFIG) as [OnlineStatus, typeof STATUS_CONFIG[OnlineStatus]][]).map(
              ([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                    key === onlineStatus ? "bg-bg2 font-medium text-ink" : "text-ink-2 hover:bg-bg2"
                  )}
                >
                  <span className={cn("inline-block h-2 w-2 rounded-full", config.color)} />
                  {config.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
