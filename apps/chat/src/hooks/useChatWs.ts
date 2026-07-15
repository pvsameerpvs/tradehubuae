"use client";

import { useEffect, useCallback } from "react";
import { useChatStore } from "@/lib/store";
import { chatWs } from "@/lib/websocket";

export function useChatWs() {
  const { setConnected, addMessage, updateSession } = useChatStore();

  useEffect(() => {
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
