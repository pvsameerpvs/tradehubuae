"use client";

import { useChatStore } from "@/lib/store";
import { SessionCard } from "./SessionCard";
import { SearchInput } from "./SearchInput";
import { StatusToggle } from "./StatusToggle";
import { useMemo } from "react";

function sortSessions(
  sessions: ReturnType<typeof useChatStore.getState>["sessions"],
  searchQuery: string
) {
  const query = searchQuery.toLowerCase().trim();

  const filtered = query
    ? sessions.filter(
        (s) =>
          s.userName.toLowerCase().includes(query) ||
          s.userEmail.toLowerCase().includes(query) ||
          s.userPhone?.toLowerCase().includes(query)
      )
    : sessions;

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  const active = sorted.filter((s) => s.status === "active");
  const closed = sorted.filter((s) => s.status === "closed");

  return { active, closed };
}

export function Sidebar() {
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const searchQuery = useChatStore((s) => s.searchQuery);

  const { active, closed } = useMemo(
    () => sortSessions(sessions, searchQuery),
    [sessions, searchQuery]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h1 className="text-lg font-bold text-ink">Chats</h1>
        <StatusToggle />
      </div>

      <SearchInput />

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-3 text-4xl text-ink-3">💬</div>
            <p className="text-sm text-ink-2">
              No conversations yet.
            </p>
            <p className="mt-1 text-xs text-ink-3">
              When customers message, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div>
                {active.map((session) => (
                  <SessionCard key={session.id} session={session} isActive={session.id === activeSessionId} />
                ))}
              </div>
            )}

            {closed.length > 0 && (
              <div>
                <div className="sticky top-0 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-3">
                  Closed
                </div>
                {closed.map((session) => (
                  <SessionCard key={session.id} session={session} isActive={session.id === activeSessionId} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
