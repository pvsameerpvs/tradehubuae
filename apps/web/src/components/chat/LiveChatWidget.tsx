"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Minus, User, Bot, MessageSquareMore } from "lucide-react";
import {
  getSettings,
  startSession,
  getCurrentSessionId,
  getSessionById,
  getMessages,
  saveMessage,
  getProductContext,
  clearProductContext,
  markSessionRead,
  type ChatMessage,
  type ChatSession,
  type ProductContext,
} from "@/lib/chat-store";

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageContent({ text }: { text: string }) {
  if (text.startsWith("I'm interested in **") && text.includes("**")) {
    const rest = text.slice("I'm interested in **".length);
    const end = rest.indexOf("**");
    const productName = rest.slice(0, end);
    const after = rest.slice(end + 2);
    return (
      <div>
        <span className="text-sm leading-relaxed">I'm interested in </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-sm font-semibold">
          <MessageSquareMore className="h-3 w-3" strokeWidth={2} />
          {productName}
        </span>
        <span className="text-sm leading-relaxed">{after}</span>
      </div>
    );
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  if (parts.length > 1) {
    return (
      <p className="text-sm leading-relaxed">
        {parts.map((part, i) =>
          urlRegex.test(part) ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80"
            >
              {part}
            </a>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    );
  }

  return <p className="text-sm leading-relaxed">{text}</p>;
}

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [started, setStarted] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [settings, setSettings] = useState(getSettings());
  const [productCtx, setProductCtx] = useState<ProductContext | null>(null);
  const [showProductChip, setShowProductChip] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  useEffect(() => {
    if (!open) return;

    const ctx = getProductContext();
    if (ctx) {
      setProductCtx(ctx);
    }

    const existingId = getCurrentSessionId();
    if (existingId) {
      const s = getSessionById(existingId);
      if (s && s.status === "active") {
        setSession(s);
        setStarted(true);
        setMessages(getMessages(existingId));
        markSessionRead(existingId);
      }
    }
  }, [open]);

  useEffect(() => {
    if (!started || !session) return;

    markSessionRead(session.id);
    pollRef.current = setInterval(() => {
      setMessages(getMessages(session.id));
    }, 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [started, session]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name.trim() || !form.email.trim()) return;

      const ctx = productCtx;
      const s = startSession(form.name.trim(), form.email.trim(), ctx);
      setSession(s);
      setStarted(true);
      setMessages(getMessages(s.id));
      clearProductContext();
      setShowProductChip(false);
    },
    [form, productCtx],
  );

  const handleSend = useCallback(() => {
    if (!input.trim() || !session) return;
    const msg: ChatMessage = {
      id: genId(),
      sessionId: session.id,
      sender: "user",
      message: input.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    saveMessage(msg);
    setMessages(getMessages(session.id));
    setInput("");
  }, [input, session]);

  const openWithProduct = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const ctx = (e as CustomEvent<ProductContext>).detail;
      if (ctx?.slug) {
        setProductCtx(ctx);
      }
      setOpen(true);
    }
    window.addEventListener("open-chat-with-product", handler);
    return () => {
      window.removeEventListener("open-chat-with-product", handler);
    };
  }, []);

  if (!settings.liveChatEnabled) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 sm:bottom-6 sm:right-6">
      {open ? (
        <div className="mx-auto flex h-[85vh] w-full max-w-[400px] flex-col overflow-hidden rounded-t-2xl border border-line bg-white shadow-panel sm:h-[560px] sm:rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-brand px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <MessageSquareMore className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-semibold">TradeHub Sales</p>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  <p className="text-[11px] text-white/70">Online — replies in minutes</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
            >
              <Minus className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          {!started ? (
            /* PRE-CHAT FORM */
            <div className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                  <MessageSquareMore className="h-7 w-7 text-brand" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-ink">
                  {productCtx ? "Ask about this item" : "Need help with bulk orders?"}
                </h3>
                <p className="mt-1 text-sm text-ink-2">
                  {productCtx
                    ? `Get answers about ${productCtx.name} — pricing, availability, shipping & more.`
                    : "Our sales team is ready to assist you with volume pricing, availability, and custom quotes."}
                </p>

                {productCtx && showProductChip && (
                  <div className="mt-4 flex w-full items-center gap-3 rounded-xl border border-brand/20 bg-brand/[0.03] p-3 text-left">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-bg2 text-xs font-bold text-ink-2">
                      {productCtx.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {productCtx.name}
                      </p>
                      <p className="text-xs text-brand font-semibold">
                        AED {productCtx.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setProductCtx(null);
                        setShowProductChip(false);
                        clearProductContext();
                      }}
                      aria-label="Remove product"
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-bg3 hover:text-ink"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                )}

                <form onSubmit={handleStart} className="mt-6 w-full space-y-3">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                    aria-label="Your name"
                    className="flex h-11 w-full rounded-lg border border-line px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:border-ink/40 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                  />
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    type="email"
                    required
                    aria-label="Email address"
                    className="flex h-11 w-full rounded-lg border border-line px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:border-ink/40 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                  />
                  <button
                    type="submit"
                    className="btn-brand flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {productCtx ? "Ask about this item" : "Start Chat"}
                  </button>
                </form>
                <p className="mt-4 text-[11px] text-ink-3">
                  We typically reply within minutes during business hours.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-start gap-2 max-w-[85%]">
                        {msg.sender !== "user" && (
                          <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10">
                            {msg.sender === "n8n" ? (
                              <Bot className="h-4 w-4 text-brand" strokeWidth={1.75} />
                            ) : (
                              <User className="h-4 w-4 text-brand" strokeWidth={1.75} />
                            )}
                          </div>
                        )}
                        <div
                          className={`rounded-xl px-4 py-2.5 text-sm ${
                            msg.sender === "user"
                              ? "bg-brand text-white rounded-tr-sm"
                              : "bg-bg2 text-ink rounded-tl-sm"
                          }`}
                        >
                          <MessageContent text={msg.message} />
                          <p
                            className={`mt-1 text-[10px] ${
                              msg.sender === "user" ? "text-white/60" : "text-ink-3"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={bottomRef} />
              </div>

              {/* INPUT */}
              <div className="border-t border-line p-4">
                <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 transition-colors focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand/20">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-3 outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    aria-label="Send message"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white transition-all hover:opacity-90 disabled:opacity-30"
                  >
                    <Send className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] text-ink-3">
                  Messages are reviewed by our team during business hours.
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        /* FAB BUTTON */
        <div className="flex justify-end p-4 sm:p-0">
          <button
            onClick={openWithProduct}
            aria-label="Open live chat"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-panel transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <MessageSquareMore className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}
