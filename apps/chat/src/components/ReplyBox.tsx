"use client";

import { useCallback, useRef, useState } from "react";
import { Paperclip, Bot, Send } from "lucide-react";

interface ReplyBoxProps {
  onSend: (content: string) => void;
  onGenerateAi: () => void;
}

export function ReplyBox({ onSend, onGenerateAi }: ReplyBoxProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex items-end gap-2 border-t border-line bg-chat-input-bg px-4 py-3">
      <button
        type="button"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-ink-3 hover:bg-bg2 hover:text-ink transition-colors"
        title="Attach file"
      >
        <Paperclip className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onGenerateAi}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-ink-3 hover:bg-bg2 hover:text-brand transition-colors"
        title="Generate AI reply"
      >
        <Bot className="h-5 w-5" />
      </button>

      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="block w-full resize-none rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ minHeight: "40px", maxHeight: "160px" }}
        />
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={!text.trim()}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Send message"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
