"use client";

import { useAuth } from "@/lib/supabase/provider";
import { Button } from "@tradehubuae/ui";
import { ChromeIcon } from "lucide-react";

export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={signInWithGoogle}
    >
      <ChromeIcon className="mr-2 size-4" />
      Sign in with Google
    </Button>
  );
}
