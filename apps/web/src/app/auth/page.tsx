"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button, Input, cn } from "@tradehubuae/ui";
import { useAuth } from "@/lib/supabase/provider";

type Mode = "login" | "register";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthPage() {
  const { signInWithGoogle, signInWithEmail, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (mode === "login") {
      const { error: err } = await signInWithEmail(email, password);
      if (err) {
        setError(err);
        setIsLoading(false);
      }
    } else {
      const name = form.get("name") as string;
      const { error: err } = await signUp(email, password, name);
      if (err) {
        setError(err);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-6rem)]">
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2B44] via-[#134A7C] to-[#1A5A8C]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2B44]/60 via-transparent to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="text-lg font-semibold text-white">TradeHub UAE</span>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-white">
              {mode === "login" ? "Welcome Back" : "Join Us"}
            </h2>
            <p className="max-w-md text-lg text-white/70">
              {mode === "login"
                ? "Sign in to access your account, orders, and personalized experience."
                : "Create an account to enjoy seamless shopping, track orders, and more."}
            </p>
            <div className="flex items-center gap-4 text-white/50">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#134A7C] bg-white/10 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    {["A", "M", "K"][i - 1]}
                  </div>
                ))}
              </div>
              <span className="text-sm">Join 10,000+ happy customers</span>
            </div>
          </div>
          <div className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} TradeHub UAE. All rights reserved.
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-ink">
              {mode === "login" ? "Sign in" : "Create account"}
            </h1>
            <p className="mt-1 text-ink-2">
              {mode === "login"
                ? "Enter your credentials to access your account"
                : "Fill in the details to get started"}
            </p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition-all",
              "hover:border-ink/20 hover:bg-bg2 hover:shadow-sm",
              "active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <GoogleIcon className="h-5 w-5 flex-shrink-0" />
            {isLoading ? "Signing in..." : `${mode === "login" ? "Sign in" : "Sign up"} with Google`}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs font-medium uppercase tracking-[0.06em] text-ink-3">
                Or continue with email
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.5} />
                <Input name="name" placeholder="Full name" className="pl-10" required />
              </div>
            )}

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.5} />
              <Input name="email" type="email" placeholder="Email address" className="pl-10" required />
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.5} />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pl-10 pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink-2"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
              </button>
            </div>

            {mode === "register" && (
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.5} />
                <Input name="confirmPassword" type="password" placeholder="Confirm password" className="pl-10" required />
              </div>
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-medium text-brand transition-colors hover:text-brand-dark">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              <span className="flex items-center gap-2">
                {isLoading ? "Please wait..." : (mode === "login" ? "Sign In" : "Create Account")}
                {!isLoading && <ArrowRight className="h-4 w-4" strokeWidth={2} />}
              </span>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-2">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
              className="font-semibold text-brand transition-colors hover:text-brand-dark"
              type="button"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
