"use client";

import { useCallback, useMemo, useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  sessionId: string;
}

export function MessageList({ messages, sessionId }: MessageListProps) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const itemContent = useCallback(
    (index: number) => {
      const message = messages[index];
      if (!message) return null;
      return (
        <div className="py-0.5">
          <MessageBubble message={message} />
        </div>
      );
    },
    [messages]
  );

  const components = useMemo(
    () => ({
      Footer: () => (
        <div className="px-4 pb-2 pt-1">
          <TypingIndicator sessionId={sessionId} />
        </div>
      ),
    }),
    [sessionId]
  );

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-ink-3">No messages yet</p>
        <p className="mt-1 text-xs text-ink-3">Send a message to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Virtuoso
        ref={virtuosoRef}
        className="h-full scrollbar-thin"
        totalCount={messages.length}
        itemContent={itemContent}
        components={components}
        followOutput="smooth"
        alignToBottom
        initialTopMostItemIndex={messages.length - 1}
        overscan={{ main: 200, reverse: 200 }}
        increaseViewportBy={{ top: 200, bottom: 200 }}
      />
    </div>
  );
}
