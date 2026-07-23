"use client";

import { Share2, Link, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useState, useRef, useEffect } from "react";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setOpen(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      void 0;
    }
  };

  const handleWhatsApp = () => {
    const text = `${title}\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Share"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-bg3"
      >
        <Share2 className="h-4 w-4" strokeWidth={1.75} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl border border-line bg-white shadow-lg">
          <button
            onClick={handleCopyLink}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink transition-colors hover:bg-bg2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" strokeWidth={2} />
            ) : (
              <Link className="h-4 w-4" strokeWidth={1.75} />
            )}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex w-full items-center gap-3 border-t border-line px-4 py-3 text-sm text-ink transition-colors hover:bg-bg2"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Share WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
