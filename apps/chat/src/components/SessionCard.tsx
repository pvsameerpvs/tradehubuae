"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/store";
import { getInitials, getContactInfo, formatShortTime } from "@/lib/utils";
import { cn } from "@tradehubuae/ui";
import type { ChatSession } from "@/types";

function SessionCardComponent({ session, isActive }: { session: ChatSession; isActive: boolean }) {
  const router = useRouter();
  const setActiveSession = useChatStore((s) => s.setActiveSession);
  const markSessionRead = useChatStore((s) => s.markSessionRead);

  const handleClick = useCallback(() => {
    setActiveSession(session.id);
    if (session.unreadCount > 0) markSessionRead(session.id);
    router.push(`/chats/${session.id}`);
  }, [session.id, session.unreadCount, setActiveSession, markSessionRead, router]);

  const contactInfo = getContactInfo(session);
  const initials = getInitials(session.userName || session.userEmail || "?");

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-3 border-b border-line-soft px-4 py-3 text-left transition-colors",
        isActive ? "bg-bg2" : "hover:bg-bg2"
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {initials}
        </div>
        {session.unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
            {session.unreadCount > 99 ? "99+" : session.unreadCount}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between">
          <span className="truncate text-sm font-semibold text-ink">
            {session.userName || session.userEmail || session.userPhone || "Unknown"}
          </span>
          <span className="ml-2 flex-shrink-0 text-xs text-ink-3">
            {formatShortTime(session.lastMessageAt)}
          </span>
        </div>

        {contactInfo && (
          <span className="truncate text-xs text-ink-3">{contactInfo}</span>
        )}

        <div className="flex items-center gap-2">
          {session.source && session.source !== "web" && (
            <span className="flex-shrink-0 text-xs text-ink-3">
              {session.source === "whatsapp" ? "🟢" : "📧"}
            </span>
          )}
          <span className="truncate text-xs text-ink-2">
            {session.unreadCount > 0 ? (
              <span className="font-medium text-ink">New messages</span>
            ) : (
              "No messages yet"
            )}
          </span>
        </div>
      </div>
    </button>
  );
}

export const SessionCard = memo(SessionCardComponent);
