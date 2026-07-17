"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useChatStore } from "@/lib/store";
import { useApi } from "@/hooks/useApi";
import type { SenderType, RawSession, RawMessage, ProductContext, Source, MessageType, ChatSession } from "@/types";
import { ChatPanel } from "@/components/ChatPanel";
import { Sidebar } from "@/components/Sidebar";

export default function ChatDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const setActiveSession = useChatStore((s) => s.setActiveSession);
  const setMessages = useChatStore((s) => s.setMessages);
  const setSessions = useChatStore((s) => s.setSessions);
  const setLoading = useChatStore((s) => s.setLoading);
  const isConnected = useChatStore((s) => s.isConnected);
  const { fetchSessions, fetchMessages } = useApi();

  useEffect(() => {
    setActiveSession(sessionId);
    setLoading(true);
    const load = () => Promise.all([
      fetchSessions().then((result) => {
        if (!result) return;
        const data = typeof result === "object" && "data" in result
          ? (result as { data: RawSession[] }).data
          : (result as RawSession[]);
        if (Array.isArray(data)) {
          setSessions(data.map((s) => ({
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
          })));
        }
      }),
      fetchMessages(sessionId).then((data) => {
        if (data && Array.isArray(data)) {
          setMessages(sessionId, (data as RawMessage[]).map((m) => ({
            id: m.id,
            sessionId: m.sessionId,
            senderType: m.senderType as SenderType,
            messageType: (m.messageType ?? "text") as MessageType,
            content: m.content,
            createdAt: m.createdAt,
            readAt: m.readAt ?? undefined,
          })));
        }
      }),
    ]).finally(() => setLoading(false));

    load();
    const interval = setInterval(load, 5000);
    return () => { clearInterval(interval); setActiveSession(null); };
  }, [sessionId, setActiveSession]);

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <div className="hidden md:flex md:w-[380px] xl:w-[420px] flex-shrink-0 flex-col border-r border-line">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden bg-chat-panel-bg">
        <ChatPanel sessionId={sessionId} />
      </div>
    </div>
  );
}
