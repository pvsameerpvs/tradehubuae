"use client";

import { useAuth } from "@/lib/supabase/provider";
import { Button } from "@tradehubuae/ui";
import { ChromeIcon } from "lucide-react";

interface GoogleSignInButtonProps {
  onSignIn?: () => void;
  onClose?: () => void;
  closeLabel?: string;
}

export function GoogleSignInButton({ onSignIn, onClose, closeLabel }: GoogleSignInButtonProps) {
  const { signInWithGoogle } = useAuth();

  const handleClick = async () => {
    await signInWithGoogle();
    onSignIn?.();
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="w-full" onClick={handleClick}>
        <ChromeIcon className="mr-2 size-4" />
        Sign in with Google
      </Button>
      {onClose && (
        <button
          onClick={onClose}
          className="text-xs text-ink-3 transition-colors hover:text-ink-2"
        >
          {closeLabel ?? "Cancel"}
        </button>
      )}
    </div>
  );
}
