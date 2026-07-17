const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
  return match ? match[1] : null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  users: {
    get: (id: string) => request<unknown>(`/chat/users/${id}`),
    orders: (id: string) => request<unknown[]>(`/chat/users/${id}/orders`),
  },
  sessions: {
    list: (params?: { status?: string; page?: number }) => {
      const qs = new URLSearchParams();
      if (params?.status) qs.set("status", params.status);
      if (params?.page) qs.set("page", String(params.page));
      const q = qs.toString();
      return request<{ data: unknown[]; meta: unknown }>(`/chat/sessions${q ? `?${q}` : ""}`);
    },
    get: (id: string) => request<unknown>(`/chat/sessions/${id}`),
    assign: (id: string) => request<unknown>(`/chat/sessions/${id}/assign`, { method: "PATCH" }),
    close: (id: string) => request<unknown>(`/chat/sessions/${id}/close`, { method: "PATCH" }),
    reopen: (id: string) => request<unknown>(`/chat/sessions/${id}/reopen`, { method: "PATCH" }),
    updateStatus: (id: string, status: "new" | "in_progress" | "closed") =>
      request<unknown>(`/chat/sessions/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },
  messages: {
    list: (sessionId: string, params?: { page?: number }) => {
      const qs = params?.page ? `?page=${params.page}` : "";
      return request<unknown[]>(`/chat/sessions/${sessionId}/messages${qs}`);
    },
    send: (sessionId: string, content: string) =>
      request<unknown>(`/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content, senderType: "admin" }),
      }),
    generateAi: (sessionId: string) =>
      request<{ content: string }>(`/chat/sessions/${sessionId}/generate-ai-reply`, { method: "POST" }),
  },
  settings: {
    get: () => request<unknown>("/chat/settings"),
    update: (data: unknown) =>
      request<unknown>("/chat/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
};
