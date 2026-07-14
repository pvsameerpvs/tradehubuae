"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Search,
  Send,
  X,
  CheckCircle2,
  Clock,
  User,
  Bot,
  ToggleLeft,
  ToggleRight,
  Settings2,
  ArrowLeft,
} from "lucide-react";
import {
  getSessions,
  getMessages,
  markSessionRead,
  addAdminReply,
  closeSession,
  reopenSession,
  getSettings,
  toggleLiveChat,
  saveN8nSettings,
  type ChatSession,
  type ChatMessage,
} from "@/lib/chat-store";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [n8nUrl, setN8nUrl] = useState("");
  const [n8nEnabled, setN8nEnabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = () => {
    const all = getSessions();
    setSessions(all);
    if (selectedId) {
      markSessionRead(selectedId);
      setMessages(getMessages(selectedId));
    }
  };

  useEffect(() => {
    const s = getSettings();
    setChatEnabled(s.liveChatEnabled);
    setN8nUrl(s.n8nWebhookUrl);
    setN8nEnabled(s.n8nEnabled);
    refresh();
    pollRef.current = setInterval(refresh, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    if (selectedId) {
      markSessionRead(selectedId);
      setMessages(getMessages(selectedId));
    }
  }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    markSessionRead(id);
  };

  const handleSend = () => {
    if (!reply.trim() || !selectedId) return;
    addAdminReply(selectedId, reply.trim());
    setMessages(getMessages(selectedId));
    setReply("");
  };

  const handleToggle = () => {
    const next = !chatEnabled;
    setChatEnabled(next);
    toggleLiveChat(next);
  };

  const handleSaveN8n = () => {
    saveN8nSettings(n8nUrl, n8nEnabled);
    setShowSettings(false);
  };

  const filtered = sessions.filter(
    (s) =>
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = sessions.find((s) => s.id === selectedId);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-bg3 transition-colors">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Live Chat</h1>
            <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">
              {sessions.filter((s) => s.status === "active").length} active conversations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm ${
              chatEnabled ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-line text-ink-3"
            }`}
          >
            {chatEnabled ? (
              <ToggleRight className="h-4 w-4 text-emerald-600" strokeWidth={1.75} />
            ) : (
              <ToggleLeft className="h-4 w-4" strokeWidth={1.75} />
            )}
            {chatEnabled ? "On" : "Off"}
          </button>
          <button
            onClick={() => {
              const s = getSettings();
              setN8nUrl(s.n8nWebhookUrl);
              setN8nEnabled(s.n8nEnabled);
              setShowSettings(!showSettings);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:bg-bg3 sm:px-3 sm:py-2 sm:text-sm"
          >
            <Settings2 className="h-4 w-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">n8n</span> Settings
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-4 rounded-xl border border-line bg-white p-4 sm:mb-6 sm:p-5">
          <h3 className="mb-3 text-sm font-semibold text-ink sm:mb-4">n8n Webhook Configuration</h3>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-ink-2">
                Webhook URL
              </label>
              <input
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
                placeholder="https://your-n8n.example.com/webhook/chat"
                className="flex h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-3"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs sm:text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={n8nEnabled}
                  onChange={(e) => setN8nEnabled(e.target.checked)}
                  className="h-4 w-4"
                />
                Enabled
              </label>
              <button
                onClick={handleSaveN8n}
                className="flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Save
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-3">
            When enabled, user messages are forwarded to the n8n webhook URL.
            Admin replies are sent back in real-time.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="overflow-hidden rounded-xl border border-line bg-white lg:w-[360px] lg:shrink-0">
          <div className="border-b border-line px-3 py-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="flex h-9 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-3"
              />
            </div>
          </div>
          <div className="max-h-[240px] overflow-y-auto lg:max-h-[560px]">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <MessageCircle className="mb-2 h-8 w-8 text-ink-3/50" strokeWidth={1} />
                <p className="text-sm text-ink-2">No conversations</p>
              </div>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  className={`w-full border-b border-line px-4 py-3 text-left transition-colors hover:bg-bg2 ${
                    selectedId === s.id ? "bg-bg2" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                        <span className="text-xs font-semibold text-brand">
                          {s.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {s.userName}
                          {s.status === "active" && (
                            <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                          )}
                        </p>
                        <p className="truncate text-xs text-ink-2">
                          {s.userEmail}
                        </p>
                      </div>
                    </div>
                    {s.unreadCount > 0 && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                        {s.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-ink-3">
                    <span>
                      {new Date(s.lastMessageAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {s.status === "closed" && (
                      <span className="text-ink-3/60">Closed</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-line bg-white min-h-[400px] lg:min-h-[560px]">
          {!selected ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
              <MessageCircle className="mb-3 h-10 w-10 text-ink-3/30 sm:h-12 sm:w-12" strokeWidth={1} />
              <p className="text-sm font-medium text-ink-2">Select a conversation</p>
              <p className="text-xs text-ink-3">Choose a chat from the list to view messages</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 sm:h-9 sm:w-9">
                    <span className="text-xs font-semibold text-brand sm:text-sm">
                      {selected.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{selected.userName}</p>
                    <p className="truncate text-xs text-ink-2">{selected.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs ${
                      selected.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-bg2 text-ink-3"
                    }`}
                  >
                    {selected.status === "active" ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" strokeWidth={2} />
                        Closed
                      </>
                    )}
                  </span>
                  {selected.status === "active" ? (
                    <button
                      onClick={() => { closeSession(selected.id); refresh(); }}
                      className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-[10px] font-medium text-ink-2 transition-colors hover:bg-bg3 sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                      <X className="h-3 w-3" strokeWidth={2} />
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={() => { reopenSession(selected.id); refresh(); }}
                      className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-[10px] font-medium text-ink-2 transition-colors hover:bg-bg3 sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 sm:p-5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[75%]">
                      {msg.sender !== "user" && (
                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 sm:h-7 sm:w-7">
                          {msg.sender === "n8n" ? (
                            <Bot className="h-3.5 w-3.5 text-brand sm:h-4 sm:w-4" strokeWidth={1.75} />
                          ) : (
                            <User className="h-3.5 w-3.5 text-brand sm:h-4 sm:w-4" strokeWidth={1.75} />
                          )}
                        </div>
                      )}
                      <div
                        className={`rounded-xl px-3 py-2 text-sm sm:px-4 sm:py-2.5 ${
                          msg.sender === "user"
                            ? "bg-brand text-white rounded-tr-sm"
                            : "bg-bg2 text-ink rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            msg.sender === "user"
                              ? "text-white/60"
                              : "text-ink-3"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-line p-3 sm:p-4">
                <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-1.5 focus-within:border-brand/50 sm:px-4 sm:py-2">
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type your reply..."
                    className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!reply.trim()}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-opacity hover:opacity-90 disabled:opacity-30 sm:h-8 sm:w-8"
                  >
                    <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
