"use client";

import { useState } from "react";

export function TypingIndicator({ sessionId: _sessionId }: { sessionId: string }) {
  const [isTyping] = useState(false);

  if (!isTyping) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-1">
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-ink-3" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-xs italic text-ink-3">Customer is typing...</span>
    </div>
  );
}
