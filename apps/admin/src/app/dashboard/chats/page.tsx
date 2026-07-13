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

export default function ChatsPage() {
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Chat</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sessions.filter((s) => s.status === "active").length} active
            conversations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
            {chatEnabled ? (
              <ToggleRight className="h-5 w-5 text-green-600" strokeWidth={1.75} />
            ) : (
              <ToggleLeft className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
            )}
            <button
              onClick={handleToggle}
              className={`text-sm font-medium transition-colors ${
                chatEnabled ? "text-green-700" : "text-muted-foreground"
              }`}
            >
              Live Chat {chatEnabled ? "On" : "Off"}
            </button>
          </div>
          <button
            onClick={() => {
              const s = getSettings();
              setN8nUrl(s.n8nWebhookUrl);
              setN8nEnabled(s.n8nEnabled);
              setShowSettings(!showSettings);
            }}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Settings2 className="h-4 w-4" strokeWidth={1.75} />
            n8n Settings
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-6 rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">n8n Webhook Configuration</h3>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Webhook URL
              </label>
              <input
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
                placeholder="https://your-n8n.example.com/webhook/chat"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer">
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
              className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            When enabled, user messages are forwarded to the n8n webhook URL.
            Admin replies are sent back in real-time.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm"
              />
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <MessageCircle className="mb-2 h-8 w-8 text-muted-foreground/50" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">No conversations</p>
              </div>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  className={`w-full border-b px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedId === s.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-semibold text-primary">
                          {s.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {s.userName}
                          {s.status === "active" && (
                            <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-green-500" />
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {s.userEmail}
                        </p>
                      </div>
                    </div>
                    {s.unreadCount > 0 && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {s.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {new Date(s.lastMessageAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {s.status === "closed" && (
                      <span className="text-muted-foreground/60">Closed</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm flex flex-col h-[600px]">
          {!selected ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MessageCircle className="mb-3 h-12 w-12 text-muted-foreground/30" strokeWidth={1} />
              <p className="text-sm font-medium text-muted-foreground">Select a conversation</p>
              <p className="text-xs text-muted-foreground/60">Choose a chat from the list to view messages</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">
                      {selected.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{selected.userName}</p>
                    <p className="text-xs text-muted-foreground">{selected.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      selected.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {selected.status === "active" ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
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
                      onClick={() => {
                        closeSession(selected.id);
                        refresh();
                      }}
                      className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      <X className="h-3 w-3" strokeWidth={2} />
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        reopenSession(selected.id);
                        refresh();
                      }}
                      className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start gap-2 max-w-[75%]">
                      {msg.sender !== "user" && (
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          {msg.sender === "n8n" ? (
                            <Bot className="h-4 w-4 text-primary" strokeWidth={1.75} />
                          ) : (
                            <User className="h-4 w-4 text-primary" strokeWidth={1.75} />
                          )}
                        </div>
                      )}
                      <div
                        className={`rounded-xl px-4 py-2.5 text-sm ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted text-foreground rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            msg.sender === "user"
                              ? "text-primary-foreground/60"
                              : "text-muted-foreground"
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

              <div className="border-t p-4">
                <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2 focus-within:border-primary/50">
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
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!reply.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
                  >
                    <Send className="h-4 w-4" strokeWidth={2} />
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
