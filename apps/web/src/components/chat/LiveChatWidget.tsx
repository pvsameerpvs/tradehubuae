"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Minus, User, Bot, MessageSquareMore } from "lucide-react";
import {
  getSettings,
  apiCreateSession,
  apiGetMessages,
  apiSendMessage,
  getCurrentSessionId,
  getSessionById,
  getMessages,
  getProductContext,
  clearProductContext,
  markSessionRead,
  getUnreadCount,
  type ChatMessage,
  type ChatSession,
  type ProductContext,
} from "@/lib/chat-store";
import { ChatBubbleFilled } from "@/components/icons";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/lib/supabase/provider";

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
      <div className="w-full">
        <span className="text-sm leading-relaxed">I'm interested in </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-sm font-semibold break-all max-w-full">
          <MessageSquareMore className="h-3 w-3 shrink-0" strokeWidth={2} />
          <span className="truncate">{productName}</span>
        </span>
        <span className="text-sm leading-relaxed">{after}</span>
      </div>
    );
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  if (parts.length > 1) {
    return (
      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap w-full">
        {parts.map((part, i) =>
          urlRegex.test(part) ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80 break-all"
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

  return <p className="text-sm leading-relaxed break-words whitespace-pre-wrap w-full">{text}</p>;
}

function hasPhoneBeenAsked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("th_chat_phone_asked") === "true";
}

function markPhoneAsked(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("th_chat_phone_asked", "true");
}

function getStoredPhone(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("th_chat_phone") ?? "";
}

function storePhone(phone: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("th_chat_phone", phone);
}

export function LiveChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [phoneInput, setPhoneInput] = useState(getStoredPhone());
  const [started, setStarted] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [settings, setSettings] = useState(getSettings());
  const [productCtx, setProductCtx] = useState<ProductContext | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unreadPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  useEffect(() => {
    if (!open || !user) return;

    const phone = getStoredPhone();
    const asked = hasPhoneBeenAsked();
    if (!asked || !phone) {
      setShowPhoneForm(true);
      setPhoneInput(phone);
      return;
    }

    startChat();
  }, [open, user]);

  const startChat = useCallback(async (phone?: string) => {
    if (!user) return;
    const ctx = getProductContext();
    setProductCtx(ctx ?? null);
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

    const existingId = getCurrentSessionId();
    if (existingId && /^[0-9a-f-]{36}$/i.test(existingId)) {
      try {
        const res = await fetch(`${apiBase}/chat/sessions/${existingId}`);
        if (res.ok) {
          const s = await res.json();
          if (s && s.status !== "closed") {
            setSession({ id: s.id, userName: s.userName, userEmail: s.userEmail, status: s.status, createdAt: s.createdAt, lastMessageAt: s.lastMessageAt, unreadCount: 0, productContext: s.productContext ?? null });
            setStarted(true);
            apiGetMessages(existingId).then(setMessages);
            markSessionRead(existingId);
            return;
          }
        }
      } catch { /* fall through */ }
    }

    try {
      const listRes = await fetch(`${apiBase}/chat/sessions?status=new,in_progress`);
      if (listRes.ok) {
        const list = await listRes.json();
        const existing = (list.data ?? []).find((s: any) =>
          s.userEmail === user.email && s.status !== "closed"
        );
        if (existing) {
          localStorage.setItem("th_session_id", existing.id);
          setSession({ id: existing.id, userName: existing.userName, userEmail: existing.userEmail, status: existing.status, createdAt: existing.createdAt, lastMessageAt: existing.lastMessageAt, unreadCount: 0, productContext: existing.productContext ?? null });
          setStarted(true);
          apiGetMessages(existing.id).then(setMessages);
          markSessionRead(existing.id);
          return;
        }
      }
    } catch { /* fall through */ }

    if (existingId && typeof window !== "undefined") {
      localStorage.removeItem("th_session_id");
    }

    apiCreateSession(user.name ?? user.email, user.email, (phone ?? getStoredPhone()) || undefined, ctx)
      .then((s) => {
        setSession(s);
        setStarted(true);
        apiGetMessages(s.id).then(setMessages);
      });
    clearProductContext();
  }, [user]);

  const handlePhoneSubmit = () => {
    storePhone(phoneInput);
    markPhoneAsked();
    setShowPhoneForm(false);
    startChat(phoneInput);
  };

  const handlePhoneSkip = () => {
    markPhoneAsked();
    setShowPhoneForm(false);
    startChat();
  };

  useEffect(() => {
    if (!started || !session) return;

    markSessionRead(session.id);
    pollRef.current = setInterval(() => {
      apiGetMessages(session.id).then(setMessages);
    }, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [started, session]);

  useEffect(() => {
    if (open) {
      setUnreadCount(0);
      return;
    }
    setUnreadCount(getUnreadCount());
    unreadPollRef.current = setInterval(() => {
      setUnreadCount(getUnreadCount());
    }, 5000);
    return () => {
      if (unreadPollRef.current) clearInterval(unreadPollRef.current);
    };
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !session) return;
    apiSendMessage(session.id, input.trim());
    apiGetMessages(session.id).then(setMessages);
    setInput("");
  }, [input, session]);

  const openWithProduct = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const ctx = (e as CustomEvent<ProductContext>).detail;
      if (ctx?.slug) setProductCtx(ctx);
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
        <div className="mx-auto flex h-[85vh] w-screen max-w-[400px] flex-col overflow-hidden rounded-t-2xl border border-line bg-white shadow-panel sm:h-[560px] sm:w-full sm:rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
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

          {!user ? (
            /* AUTH GATE */
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                <MessageSquareMore className="h-7 w-7 text-brand" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-ink">
                {productCtx ? "Sign in to ask about this item" : "Sign in to chat with our team"}
              </h3>
              <p className="mt-1 text-sm text-ink-2">
                {productCtx
                  ? `Sign in with Google to get answers about ${productCtx.name}.`
                  : "Sign in with Google to get help with bulk pricing, availability, and custom quotes."}
              </p>
              <div className="mt-6 w-full max-w-[280px]">
                <GoogleSignInButton onSignIn={() => {}} onClose={() => setOpen(false)} />
              </div>
            </div>
          ) : showPhoneForm ? (
            /* PHONE COLLECTION */
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                <MessageSquareMore className="h-7 w-7 text-brand" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-ink">Share your number (optional)</h3>
              <p className="mt-1 text-sm text-ink-2">
                If you provide your phone number, our team can reach you easily.
              </p>
              <div className="mt-5 w-full max-w-[280px] space-y-3">
                <input
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+971 5X XXX XXXX"
                  type="tel"
                  className="flex h-11 w-full rounded-lg border border-line px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:border-ink/40 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                />
                <button
                  onClick={handlePhoneSubmit}
                  className="btn-brand flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Start Chat
                </button>
                <button
                  onClick={handlePhoneSkip}
                  className="text-xs text-ink-3 transition-colors hover:text-ink-2"
                >
                  Skip — I'll chat now
                </button>
              </div>
            </div>
          ) : !started ? (
            /* LOADING */
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-ink-3">Starting chat...</p>
            </div>
          ) : (
            <>
              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3">
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-start gap-2 max-w-[85%] min-w-0">
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
                          className={`rounded-xl px-3.5 py-2.5 text-sm break-words ${
                            msg.sender === "user"
                              ? "bg-brand text-white rounded-tr-sm"
                              : "bg-bg2 text-ink rounded-tl-sm"
                          }`}
                          style={{ minWidth: 0, maxWidth: "100%" }}
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
          <div className="group relative">
            <button
              onClick={openWithProduct}
              aria-label="Open live chat"
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-panel transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-[22px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white shadow-sm">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              {unreadCount > 0 && (
                <span className="absolute inset-0 animate-ping rounded-full bg-brand/40" />
              )}
              <ChatBubbleFilled className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
            </button>
            <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs text-white opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100">
              Chat with us
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
