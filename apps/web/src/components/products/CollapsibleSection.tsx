"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsibleSection({ title, children, defaultOpen = false, className }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={className}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-[22px] font-semibold leading-[26px] text-ink transition-colors hover:text-ink/70"
        style={{ letterSpacing: "-0.01em" }}
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          className={`h-5 w-5 text-ink-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "mt-4 opacity-100" : "mt-0 h-0 opacity-0"}`}
      >
        {children}
      </div>
    </section>
  );
}
