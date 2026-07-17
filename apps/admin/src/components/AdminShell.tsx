"use client";

import { useState } from "react";
import { cn } from "@tradehubuae/ui";
import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg2">
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area — scrolls independently */}
      <div className={cn("flex flex-1 flex-col min-w-0", "lg:ml-64")}>
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
