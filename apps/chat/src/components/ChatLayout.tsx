"use client";

import { useEffect } from "react";
import { useChatStore } from "@/lib/store";
import { useApi } from "@/hooks/useApi";
import type { RawSession, Source, ProductContext, ChatSession } from "@/types";
import { Sidebar } from "./Sidebar";
import { ChatPanel } from "./ChatPanel";
import { EmptyState } from "./EmptyState";

export function ChatLayout() {
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const setSessions = useChatStore((s) => s.setSessions);
  const setLoading = useChatStore((s) => s.setLoading);
  const { fetchSessions } = useApi();

  useEffect(() => {
    setLoading(true);
    fetchSessions().then((result) => {
      if (!result) return;
      const data = typeof result === "object" && "data" in result
        ? (result as { data: RawSession[] }).data
        : (result as RawSession[]);
      if (Array.isArray(data)) {
        const mapped = data.map((s) => ({
          id: s.id,
          userId: s.userId,
          userName: s.userName,
          userEmail: s.userEmail,
          userPhone: s.userPhone ?? "",
          status: s.status as ChatSession["status"],
          source: (s.source ?? "web") as Source,
          unreadCount: 0,
          createdAt: s.createdAt,
          lastMessageAt: s.lastMessageAt,
          assignedAdminName: s.assignedAdminName ?? undefined,
          productContext: s.productContext as ProductContext | null | undefined,
        }));
        setSessions(mapped);
      }
      setLoading(false);
    });
  }, []);

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
