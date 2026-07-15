"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from "react";

type MockUser = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
};

type AuthState = {
  user: MockUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function generateId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("tradehub_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("tradehub_user");
      }
    }
    setIsLoading(false);
  }, []);

  const persistUser = useCallback((u: MockUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("tradehub_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("tradehub_user");
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    persistUser({
      id: generateId(),
      email: "user@gmail.com",
      name: "Google User",
      avatar: null,
    });
    router.push("/");
    router.refresh();
  }, [persistUser, router]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!email || !password) return { error: "Email and password are required" };
    persistUser({
      id: generateId(),
      email,
      name: email.split("@")[0],
      avatar: null,
    });
    router.push("/");
    router.refresh();
    return { error: null };
  }, [persistUser, router]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    if (!email || !password) return { error: "Email and password are required" };
    persistUser({
      id: generateId(),
      email,
      name,
      avatar: null,
    });
    router.push("/");
    router.refresh();
    return { error: null };
  }, [persistUser, router]);

  const signOut = useCallback(async () => {
    persistUser(null);
    router.push("/auth");
    router.refresh();
  }, [persistUser, router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signInWithEmail, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
