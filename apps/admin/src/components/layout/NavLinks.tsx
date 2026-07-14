"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@tradehubuae/ui";
import type { NavSection } from "../../lib/navigation";

interface NavLinksProps {
  sections: NavSection[];
  onNavClick?: () => void;
}

export function NavLinks({ sections, onNavClick }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {sections.map((section) => (
        <div key={section.title}>
          <div className="mb-1 flex items-center gap-2 px-3 py-1">
            <div className="h-px flex-1 bg-line" />
            <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-ink-3">
              {section.title}
            </span>
            <div className="h-px flex-1 bg-line" />
          </div>
          {section.items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-ink-2 hover:bg-bg3 hover:text-ink",
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-brand" />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                    isActive && "scale-110",
                  )}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-brand" strokeWidth={2.5} />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}
