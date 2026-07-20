"use client";

import { useEffect, useCallback } from "react";
import { useChatStore } from "@/lib/store";
import { chatWs } from "@/lib/websocket";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, ...rest] = cookie.split("=");
      if (name === "token" || name === "sb-token" || name === "access_token") {
        return rest.join("=");
      }
    }
    const stored = localStorage.getItem("token") || localStorage.getItem("sb-token");
    if (stored) return stored;
  } catch { /* ignore token error */ }
  return null;
}

export function useChatWs() {
  const { setConnected, addMessage, updateSession, markSessionRead } = useChatStore();

  useEffect(() => {
    const token = getToken();
    if (token) chatWs.setToken(token);

    chatWs.onConnectionChange(setConnected);
    chatWs.connect();

    const unsub = chatWs.subscribe((data) => {
      switch (data.event) {
        case "chat:message:new":
          addMessage(data.message.sessionId, data.message);
          break;
        case "chat:session:updated":
          updateSession(data.session.id, data.session);
          break;
        case "chat:unread:count": {
          const session = useChatStore.getState().sessions.find((s) => s.id === data.sessionId);
          if (session) {
            updateSession(data.sessionId, { unreadCount: (session.unreadCount || 0) + 1 });
          }
          break;
        }
        case "chat:typing:update": {
          updateSession(data.sessionId, {
            ...(data.adminName ? { assignedAdminName: data.adminName } : {}),
          });
          break;
        }
      }
    });

    return () => {
      unsub();
      chatWs.disconnect();
    };
  }, [addMessage, updateSession, setConnected]);

  const sendMessage = useCallback((sessionId: string, content: string) => {
    chatWs.send({ event: "chat:message", sessionId, content });
  }, []);

  const sendTyping = useCallback((sessionId: string, isTyping: boolean) => {
    chatWs.send({ event: "chat:typing", sessionId, isTyping });
  }, []);

  const joinSession = useCallback((sessionId: string) => {
    chatWs.send({ event: "chat:join", sessionId });
  }, []);

  const leaveSession = useCallback((sessionId: string) => {
    chatWs.send({ event: "chat:leave", sessionId });
  }, []);

  return { sendMessage, sendTyping, joinSession, leaveSession };
}
