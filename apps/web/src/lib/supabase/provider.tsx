"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from "react";

type User = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
};

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  setAuth: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function getStoredAuth(): { user: User | null; token: string | null } {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const token = localStorage.getItem("tradehub_token");
    const user = localStorage.getItem("tradehub_user");
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  } catch {
    return { user: null, token: null };
  }
}

function storeAuth(user: User | null, token: string | null) {
  if (user && token) {
    localStorage.setItem("tradehub_token", token);
    localStorage.setItem("tradehub_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("tradehub_token");
    localStorage.removeItem("tradehub_user");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { user: storedUser, token: storedToken } = getStoredAuth();
    setUser(storedUser);
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const { login } = await import("@/lib/actions/auth");
      const result = await login(email, password);
      if ("error" in result) return result;
      setUser(result.user);
      setToken(result.token);
      storeAuth(result.user, result.token);
      router.push("/");
      router.refresh();
      return { error: null };
    } catch {
      return { error: "Login failed. Please try again." };
    }
  }, [router]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      const { register } = await import("@/lib/actions/auth");
      const result = await register(name, email, password);
      if ("error" in result) return result;
      setUser(result.user);
      setToken(result.token);
      storeAuth(result.user, result.token);
      router.push("/");
      router.refresh();
      return { error: null };
    } catch {
      return { error: "Registration failed. Please try again." };
    }
  }, [router]);

  const setAuth = useCallback((user: User, token: string) => {
    setUser(user);
    setToken(token);
    storeAuth(user, token);
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setToken(null);
    storeAuth(null, null);
    router.push("/auth");
    router.refresh();
  }, [router]);

  const signInWithGoogle = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        reject(new Error("Google Client ID not configured"));
        return;
      }

      async function handleCredentialResponse(response: { credential: string }) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential: response.credential }),
            },
          );
          if (!res.ok) throw new Error("Google auth failed");
          const data = await res.json();
          if (data.token && data.user) {
            setAuth(data.user, data.token);
            router.push("/");
            router.refresh();
            resolve();
          } else {
            reject(new Error("Invalid response from server"));
          }
        } catch {
          reject(new Error("Google sign-in failed"));
        }
      }

      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          cancel_on_tap_outside: false,
        });
        window.google.accounts.id.prompt();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google?.accounts?.id?.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          cancel_on_tap_outside: false,
        });
        window.google?.accounts?.id?.prompt();
      };
      document.body.appendChild(script);
    });
  }, [setAuth, router]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signInWithGoogle, signInWithEmail, signUp, signOut, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
