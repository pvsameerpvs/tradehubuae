"use client";

import { useState, type FormEvent } from "react";
import { Tag, X } from "lucide-react";

interface PromoCodeInputProps {
  activePromo: { code: string } | null;
  promoError: string;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export function PromoCodeInput({ activePromo, promoError, onApply, onRemove }: PromoCodeInputProps) {
  const [code, setCode] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    onApply(trimmed);
    setCode("");
  };

  if (activePromo) {
    return (
      <div className="mt-4 flex items-center justify-between rounded-lg border border-brand/30 bg-brand/5 px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Tag className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
          <span className="text-sm font-semibold text-brand">{activePromo.code}</span>
        </div>
        <button
          onClick={onRemove}
          className="flex items-center gap-1 text-sm text-ink-3 hover:text-sale transition-colors shrink-0"
          aria-label="Remove promo code"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="text-xs">Remove</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={1.75} />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo code"
            className="h-11 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink/30 focus:ring-2 focus:ring-ink/10"
          />
        </div>
        <button
          type="submit"
          disabled={!code.trim()}
          className="flex h-11 shrink-0 items-center rounded-lg border border-ink px-4 text-sm font-semibold text-ink transition-colors hover:bg-bg3 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply
        </button>
      </form>
      {promoError && (
        <p className="mt-1.5 text-xs text-sale">{promoError}</p>
      )}
    </div>
  );
}
