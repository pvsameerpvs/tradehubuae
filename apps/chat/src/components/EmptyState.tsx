import { MessageSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-bg2">
        <MessageSquare className="h-10 w-10 text-ink-3" />
      </div>
      <h2 className="text-xl font-semibold text-ink">TradeHub Chat</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-2">
        Select a conversation from the sidebar to start chatting with customers.
      </p>
      <p className="mt-1 text-xs text-ink-3">
        When customers message you, their conversations will appear here.
      </p>
    </div>
  );
}
