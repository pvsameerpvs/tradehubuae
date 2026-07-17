"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from "react";
import { createClient } from "./client";

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
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          name: session.user.user_metadata?.full_name ?? null,
          avatar: session.user.user_metadata?.avatar_url ?? null,
        });
        setToken(session.access_token);
      } else {
        const { user: storedUser, token: storedToken } = getStoredAuth();
        setUser(storedUser);
        setToken(storedToken);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          name: session.user.user_metadata?.full_name ?? null,
          avatar: session.user.user_metadata?.avatar_url ?? null,
        });
        setToken(session.access_token);
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => subscription.unsubscribe();
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
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setToken(null);
    storeAuth(null, null);
    router.push("/auth");
    router.refresh();
  }, [router]);

  const signInWithGoogle = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signInWithGoogle, signInWithEmail, signUp, signOut, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
