"use client";

import { memo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, MoreVertical, Circle } from "lucide-react";
import { useChatStore } from "@/lib/store";
import { getInitials, getDisplayName, getAvatarColor } from "@/lib/utils";
import { cn } from "@tradehubuae/ui";
import type { ChatSession } from "@/types";

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "text-green-500" },
  { value: "in_progress", label: "In Progress", color: "text-amber-500" },
  { value: "closed", label: "Closed", color: "text-red-500" },
] as const;

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  in_progress: "In Progress",
  closed: "Closed",
};

const STATUS_DOT: Record<string, string> = {
  new: "bg-green-500",
  in_progress: "bg-amber-500",
  closed: "bg-gray-400",
};

function SessionHeaderComponent({ session }: { session: ChatSession }) {
  const router = useRouter();
  const updateSession = useChatStore((s) => s.updateSession);
  const displayName = getDisplayName(session);
  const initials = getInitials(displayName);
  const color = session.avatarColor || getAvatarColor(session.userName, session.userEmail);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleStatus = useCallback(
    (value: string) => {
      setMenuOpen(false);
      updateSession(session.id, { status: value as ChatSession["status"] });
    },
    [session.id, updateSession]
  );

  return (
    <div className="flex items-center gap-2 border-b border-line bg-chat-header-bg px-2 py-2 md:px-4 md:py-3">
      <button
        onClick={() => router.push("/chats")}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 hover:text-ink transition-colors md:hidden"
        aria-label="Back to chats"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="relative flex-shrink-0">
        {session.avatarUrl ? (
          <img src={session.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white", color)}>
            {initials}
          </div>
        )}
        <span className={cn("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white", STATUS_DOT[session.status])} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-ink">{displayName}</span>
        <span className="truncate text-xs text-ink-3">{STATUS_LABEL[session.status] || session.status}</span>
      </div>

      <div className="flex items-center gap-1">
        {session.userPhone && (
          <a href={`tel:${session.userPhone}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 hover:text-ink transition-colors">
            <Phone className="h-4 w-4" />
          </a>
        )}
        {session.userEmail && (
          <a href={`mailto:${session.userEmail}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 hover:text-ink transition-colors">
            <Mail className="h-4 w-4" />
          </a>
        )}

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 hover:text-ink transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-line bg-white shadow-panel animate-scale-in">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatus(opt.value)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-bg2",
                      session.status === opt.value ? "font-medium text-ink" : "text-ink-2",
                      opt.value === "closed" ? "hover:text-red-600" : ""
                    )}
                  >
                    <Circle className={cn("h-3 w-3 fill-current", opt.color)} />
                    {opt.label}
                    {session.status === opt.value && (
                      <span className="ml-auto text-[10px] text-ink-3">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const SessionHeader = memo(SessionHeaderComponent);
