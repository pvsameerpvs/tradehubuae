"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/store";
import { getInitials, getContactInfo, formatShortTime, getAvatarColor } from "@/lib/utils";
import { cn } from "@tradehubuae/ui";
import type { ChatSession } from "@/types";
import { Circle } from "lucide-react";

function handleAvatarClick(e: React.MouseEvent, userId?: string) {
  e.stopPropagation();
  if (userId) {
    window.location.href = `/chats/user/${userId}`;
  }
}

const STATUS_DOT: Record<string, string> = {
  new: "text-green-500",
  in_progress: "text-amber-500",
  closed: "text-gray-400",
};

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  in_progress: "In Progress",
  closed: "Closed",
};

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
  const color = session.avatarColor || getAvatarColor(session.userName, session.userEmail);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-3 border-b border-line-soft px-4 py-3 text-left transition-colors",
        isActive ? "bg-bg2" : "hover:bg-bg2"
      )}
    >
      <div
        className="relative flex-shrink-0 cursor-pointer"
        onClick={(e) => handleAvatarClick(e, session.userId)}
        title={session.userId ? "View profile" : undefined}
      >
        {session.avatarUrl ? (
          <img src={session.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white", color)}>
            {initials}
          </div>
        )}
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
          <Circle className={cn("h-2.5 w-2.5 fill-current", STATUS_DOT[session.status] || "text-gray-400")} />
          <span className="text-xs text-ink-3">{STATUS_LABEL[session.status] || session.status}</span>
        </div>
      </div>
    </button>
  );
}

export const SessionCard = memo(SessionCardComponent);
