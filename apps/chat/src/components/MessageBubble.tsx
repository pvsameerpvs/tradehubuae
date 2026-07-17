"use client";

import { memo } from "react";
import { cn } from "@tradehubuae/ui";
import { formatMessageTime } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { CheckCheck, Check } from "lucide-react";

function MessageBubbleComponent({ message }: { message: ChatMessage }) {
  const isMe = message.senderType === "admin";
  const isSystem = message.senderType === "system";
  const isBot = message.senderType === "bot";

  if (isSystem) {
    return (
      <div className="flex justify-center px-4 py-1">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-ink-3">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex px-4 py-0.5", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
          isMe
            ? "bg-brand text-white rounded-br-md"
            : isBot
              ? "bg-blue-50 text-ink rounded-bl-md"
              : "bg-gray-100 text-ink rounded-bl-md"
        )}
      >
        {message.messageType === "image" && message.attachmentUrl && (
          <div className="mb-2 overflow-hidden rounded-xl">
            <img
              src={message.attachmentUrl}
              alt={message.attachmentName || "Image"}
              className="max-w-full rounded-xl"
              loading="lazy"
            />
          </div>
        )}

        {message.messageType === "file" && message.attachmentUrl && (
          <div className="mb-2 flex items-center gap-2 rounded-xl bg-black/5 px-3 py-2">
            <span className="text-lg">📎</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">{message.attachmentName || "File"}</p>
              {message.attachmentSize && (
                <p className="text-[11px] opacity-70">{(message.attachmentSize / 1024).toFixed(1)} KB</p>
              )}
            </div>
          </div>
        )}

        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>

        <div className={cn(
          "mt-1 flex items-center justify-end gap-1",
          isMe ? "text-white/70" : "text-ink-3"
        )}>
          <span className="text-[10px] leading-none">
            {formatMessageTime(message.createdAt)}
          </span>
          {isMe && (
            message.readAt ? (
              <CheckCheck className="h-3 w-3 text-blue-300" />
            ) : (
              <Check className="h-3 w-3" />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleComponent);
