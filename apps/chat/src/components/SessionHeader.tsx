"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, MoreVertical } from "lucide-react";
import { useChatStore } from "@/lib/store";
import { getInitials, getDisplayName, getContactInfo } from "@/lib/utils";
import type { ChatSession } from "@/types";

function SessionHeaderComponent({ session }: { session: ChatSession }) {
  const router = useRouter();
  const updateSession = useChatStore((s) => s.updateSession);
  const displayName = getDisplayName(session);
  const contactInfo = getContactInfo(session);

  function handleClose() {
    updateSession(session.id, { status: "closed", closedAt: new Date().toISOString() });
  }

  function handleReopen() {
    updateSession(session.id, { status: "active" });
  }

  return (
    <div className="flex items-center gap-2 border-b border-line bg-chat-header-bg px-2 py-2 md:px-4 md:py-3">
      <button
        onClick={() => router.push("/chats")}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 hover:text-ink transition-colors md:hidden"
        aria-label="Back to chats"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
        {getInitials(displayName)}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-ink">
            {displayName}
          </span>
          <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-500" title="Online" />
        </div>
        {contactInfo && (
          <span className="truncate text-xs text-ink-3">{contactInfo}</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {session.userPhone && (
          <a
            href={`tel:${session.userPhone}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 hover:text-ink transition-colors"
            title={`Call ${session.userPhone}`}
          >
            <Phone className="h-4 w-4" />
          </a>
        )}
        {session.userEmail && (
          <a
            href={`mailto:${session.userEmail}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 hover:text-ink transition-colors"
            title={`Email ${session.userEmail}`}
          >
            <Mail className="h-4 w-4" />
          </a>
        )}

        <button
          onClick={session.status === "active" ? handleClose : handleReopen}
          className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-ink-2 hover:bg-bg2 hover:text-ink transition-colors"
        >
          {session.status === "active" ? "Close" : "Reopen"}
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 hover:text-ink transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export const SessionHeader = memo(SessionHeaderComponent);
