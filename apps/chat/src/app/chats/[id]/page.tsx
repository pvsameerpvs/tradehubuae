"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useChatStore } from "@/lib/store";
import { ChatPanel } from "@/components/ChatPanel";
import { Sidebar } from "@/components/Sidebar";

export default function ChatDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const setActiveSession = useChatStore((s) => s.setActiveSession);

  useEffect(() => {
    setActiveSession(sessionId);
    return () => setActiveSession(null);
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
