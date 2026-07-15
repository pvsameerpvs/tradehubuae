"use client";

import { useMemo, useCallback, useEffect } from "react";
import { useChatStore } from "@/lib/store";
import { useChatWs } from "@/hooks/useChatWs";
import { SessionHeader } from "./SessionHeader";
import { MessageList } from "./MessageList";
import { ReplyBox } from "./ReplyBox";
import type { ChatMessage } from "@/types";

interface ChatPanelProps {
  sessionId: string;
}

export function ChatPanel({ sessionId }: ChatPanelProps) {
  const sessions = useChatStore((s) => s.sessions);
  const messages = useChatStore((s) => s.messages[sessionId] || []);
  const { sendMessage, joinSession, leaveSession } = useChatWs();

  const session = useMemo(
    () => sessions.find((s) => s.id === sessionId),
    [sessions, sessionId]
  );

  useEffect(() => {
    joinSession(sessionId);
    return () => leaveSession(sessionId);
  }, [sessionId, joinSession, leaveSession]);

  const handleSend = useCallback(
    (content: string) => {
      const optimistic: ChatMessage = {
        id: `opt-${Date.now()}`,
        sessionId,
        senderType: "admin",
        messageType: "text",
        content,
        createdAt: new Date().toISOString(),
      };
      useChatStore.getState().addMessage(sessionId, optimistic);
      sendMessage(sessionId, content);
    },
    [sessionId, sendMessage]
  );

  const handleGenerateAi = useCallback(
    () => {
      // TODO: POST /chat/sessions/:id/generate-ai-reply
    },
    []
  );

  if (!session) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-ink-3">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block h-8 w-8 animate-pulse rounded-full bg-ink-3/20" />
          <span className="animate-pulse text-ink-3">Loading conversation...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SessionHeader session={session} />
      <MessageList messages={messages} sessionId={sessionId} />
      <ReplyBox onSend={handleSend} onGenerateAi={handleGenerateAi} />
    </>
  );
}
