"use client";

import { useChatStore } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { EmptyState } from "./EmptyState";

export function ChatLayout() {
  const activeSessionId = useChatStore((s) => s.activeSessionId);

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <div className="flex w-full flex-col md:w-[380px] xl:w-[420px] md:flex-shrink-0 md:border-r md:border-line">
        <Sidebar />
      </div>

      <div className="hidden md:flex md:flex-1 md:flex-col md:overflow-hidden md:bg-chat-panel-bg">
        {activeSessionId ? (
          <ChatPanel key={activeSessionId} sessionId={activeSessionId} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
