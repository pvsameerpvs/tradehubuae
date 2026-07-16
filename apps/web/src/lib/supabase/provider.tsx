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
};

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
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

  const signInWithGoogle = useCallback(async () => {
    try {
      const { login } = await import("@/lib/actions/auth");
      const result = await login("user@gmail.com", "google_oauth");
      if ("error" in result) return;
      setUser(result.user);
      setToken(result.token);
      storeAuth(result.user, result.token);
      router.push("/");
      router.refresh();
    } catch {
    }
  }, [router]);

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

  const signOut = useCallback(async () => {
    setUser(null);
    setToken(null);
    storeAuth(null, null);
    router.push("/auth");
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signInWithGoogle, signInWithEmail, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
