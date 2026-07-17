import { useCallback, useState } from "react";
import { api, ApiError } from "@/lib/api";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi() {
  const [state, setState] = useState<AsyncState<unknown>>({ data: null, loading: false, error: null });

  const wrap = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await fn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const msg = err instanceof ApiError ? `API error: ${err.message}` : "Network error";
      setState({ data: null, loading: false, error: msg });
      return null;
    }
  }, []);

  const fetchSessions = useCallback(
    () => wrap(() => api.sessions.list({ status: "new,in_progress" })),
    [wrap],
  );

  const fetchMessages = useCallback(
    (sessionId: string) => wrap(() => api.messages.list(sessionId)),
    [wrap],
  );

  const sendMessage = useCallback(
    async (sessionId: string, content: string) => {
      const result = await wrap(() => api.messages.send(sessionId, content));
      return result !== null;
    },
    [wrap],
  );

  const closeSession = useCallback(
    (id: string) => wrap(() => api.sessions.close(id)),
    [wrap],
  );

  const assignSession = useCallback(
    (id: string) => wrap(() => api.sessions.assign(id)),
    [wrap],
  );

  return {
    ...state,
    fetchSessions,
    fetchMessages,
    sendMessage,
    closeSession,
    assignSession,
  };
}
