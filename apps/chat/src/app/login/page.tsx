"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@tradehubuae/ui";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    if (username !== "admin" || password !== "12345") {
      setError("Invalid username or password");
      return;
    }

    document.cookie = `auth_token=demo-jwt-token; path=/; max-age=86400`;
    document.cookie = `auth_username=${encodeURIComponent(username)}; path=/; max-age=86400`;
    router.push("/chats");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <img src="/icons/logo-web.png" alt="TradeHub" className="mx-auto mb-6 h-16 w-auto" />
          <h1 className="text-xl font-semibold text-ink">Sign in to TradeHub Chat</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-xl border border-line bg-bg2 px-4 py-3.5 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/10"
              placeholder="Username"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-line bg-bg2 px-4 py-3.5 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/10"
              placeholder="Password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" className="btn-brand w-full rounded-xl py-3.5 text-sm font-semibold">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
