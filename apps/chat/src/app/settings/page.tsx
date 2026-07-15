"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, User, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@tradehubuae/ui";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const router = useRouter();
  const [active, setActive] = useState("profile");

  function handleSignOut() {
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "auth_username=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <div className="hidden w-[240px] flex-shrink-0 flex-col border-r border-line md:flex">
        <div className="flex items-center gap-3 border-b border-line px-4 py-4">
          <button onClick={() => router.push("/chats")} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2 md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold text-ink">Settings</h1>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active === s.id ? "bg-bg2 font-medium text-ink" : "text-ink-2 hover:bg-bg2"
                }`}
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3 md:hidden">
          <button onClick={() => router.push("/chats")} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-bg2">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-ink">Settings</h1>
        </div>

        <div className="flex border-b border-line md:hidden">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${
                  active === s.id ? "border-brand text-brand font-medium" : "border-transparent text-ink-2"
                }`}
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 md:p-6">
          {active === "profile" && (
            <div className="mx-auto max-w-lg space-y-6">
              <h2 className="hidden text-lg font-semibold text-ink md:block">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink">Name</label>
                  <input type="text" defaultValue="Admin" className="mt-1 block w-full rounded-xl border border-line bg-bg2 px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Email</label>
                  <input type="email" defaultValue="admin@tradehubuae.com" className="mt-1 block w-full rounded-xl border border-line bg-bg2 px-4 py-3 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/10" />
                </div>
                <Button className="btn-brand rounded-xl">Save Changes</Button>
              </div>
            </div>
          )}

          {active === "notifications" && (
            <div className="mx-auto max-w-lg space-y-6">
              <h2 className="hidden text-lg font-semibold text-ink md:block">Notifications</h2>
              <div className="space-y-3">
                {[
                  { title: "Push Notifications", desc: "Receive notifications when offline" },
                  { title: "Sound", desc: "Play sound on new messages" },
                  { title: "Message Preview", desc: "Show message content in notifications" },
                ].map((item) => (
                  <label key={item.title} className="flex items-center justify-between rounded-xl border border-line px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-ink">{item.title}</p>
                      <p className="text-xs text-ink-3">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-line text-brand focus:ring-brand" />
                  </label>
                ))}
              </div>
            </div>
          )}


        </div>

        <div className="border-t border-line p-4 md:hidden">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
