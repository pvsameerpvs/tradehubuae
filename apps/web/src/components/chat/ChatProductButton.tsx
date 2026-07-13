"use client";

import { MessageSquareMore } from "lucide-react";
import { setProductContext, type ProductContext } from "@/lib/chat-store";

interface ChatProductButtonProps {
  product: {
    name: string;
    slug: string;
    price: number;
  };
  variant?: "ghost" | "secondary" | "icon";
}

export function ChatProductButton({ product, variant = "ghost" }: ChatProductButtonProps) {
  const handleClick = () => {
    const ctx: ProductContext = {
      name: product.name,
      slug: product.slug,
      price: product.price,
    };
    setProductContext(ctx);
    window.dispatchEvent(
      new CustomEvent("open-chat-with-product", { detail: ctx }),
    );
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Ask about ${product.name}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-bg3"
      >
        <MessageSquareMore className="h-4 w-4" strokeWidth={1.75} />
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-ink bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-bg3"
      >
        <MessageSquareMore className="h-4 w-4" strokeWidth={1.75} />
        Ask about this item
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4 decoration-ink/30 transition-colors hover:decoration-ink"
    >
      <MessageSquareMore className="h-4 w-4" strokeWidth={1.75} />
      Ask a question
    </button>
  );
}
