"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@tradehubuae/ui";

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  auth_callback_error: {
    title: "Sign In Failed",
    description: "Could not complete the sign-in process. Please try again.",
  },
  access_denied: {
    title: "Access Denied",
    description: "You don't have permission to sign in.",
  },
  session_expired: {
    title: "Session Expired",
    description: "Your session has expired. Please sign in again.",
  },
  Default: {
    title: "Authentication Error",
    description: "Something went wrong. Please try signing in again.",
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorKey = searchParams.get("error") ?? "Default";
  const { title, description } = (ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.Default)!;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-500" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-ink">{title}</h1>
        <p className="mb-8 text-ink-2">{description}</p>
        <Button variant="outline" asChild>
          <Link href="/auth">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
}
