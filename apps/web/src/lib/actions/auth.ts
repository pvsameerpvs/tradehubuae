"use server";

import { api, ApiError } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role?: string;
}

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string } | { error: string }> {
  try {
    const data = await api.post<{ user: AuthUser; token: string }>("/auth/login", { email, password });
    return data;
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Login failed" };
  }
}

export async function register(name: string, email: string, password: string): Promise<{ user: AuthUser; token: string } | { error: string }> {
  try {
    const data = await api.post<{ user: AuthUser; token: string }>("/auth/register", { name, email, password });
    return data;
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Registration failed" };
  }
}

export async function getMe(token: string): Promise<AuthUser | null> {
  try {
    return await api.get<AuthUser>("/auth/me", undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
}
