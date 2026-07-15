import { create } from "zustand";
import type { ChatSession, ChatMessage, OnlineStatus } from "@/types";
import { DEMO_SESSIONS, DEMO_MESSAGES } from "./demo-data";

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: Record<string, ChatMessage[]>;
  searchQuery: string;
  onlineStatus: OnlineStatus;
  isConnected: boolean;
  isLoading: boolean;

  setSessions: (sessions: ChatSession[]) => void;
  setActiveSession: (id: string | null) => void;
  setMessages: (sessionId: string, messages: ChatMessage[]) => void;
  addMessage: (sessionId: string, message: ChatMessage) => void;
  setSearchQuery: (query: string) => void;
  setOnlineStatus: (status: OnlineStatus) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  markSessionRead: (sessionId: string) => void;
  updateSession: (id: string, updates: Partial<ChatSession>) => void;
  addSession: (session: ChatSession) => void;
}

export type { ChatSession, ChatMessage } from "@/types";

export const useChatStore = create<ChatState>((set) => ({
  sessions: DEMO_SESSIONS,
  activeSessionId: "s1",
  messages: DEMO_MESSAGES,
  searchQuery: "",
  onlineStatus: "online",
  isConnected: false,
  isLoading: false,

  setSessions: (sessions) => set({ sessions }),

  setActiveSession: (id) => set({ activeSessionId: id }),

  setMessages: (sessionId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [sessionId]: messages },
    })),

  addMessage: (sessionId, message) =>
    set((state) => {
      const existing = state.messages[sessionId] || [];
      if (existing.some((m) => m.id === message.id)) return state;
      return {
        messages: {
          ...state.messages,
          [sessionId]: [...existing, message],
        },
        sessions: state.sessions.map((s) =>
          s.id === sessionId
            ? { ...s, lastMessageAt: message.createdAt, unreadCount: s.unreadCount + (message.senderType === "user" ? 1 : 0) }
            : s
        ),
      };
    }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setOnlineStatus: (onlineStatus) => set({ onlineStatus }),

  setConnected: (isConnected) => set({ isConnected }),

  setLoading: (isLoading) => set({ isLoading }),

  markSessionRead: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, unreadCount: 0 } : s
      ),
    })),

  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
    })),
}));
