"use client";

import { useState } from "react";
import { Bell, Shield, User } from "lucide-react";
import { Button } from "@tradehubuae/ui";

const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <div className="flex w-[280px] flex-shrink-0 flex-col border-r border-line">
        <div className="border-b border-line px-4 py-4">
          <h1 className="text-lg font-bold text-ink">Settings</h1>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-bg2 font-medium text-ink"
                    : "text-ink-2 hover:bg-bg2"
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <Button variant="outline" className="w-full" size="sm">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-6">
        {activeSection === "profile" && (
          <div className="max-w-lg space-y-6">
            <h2 className="text-lg font-semibold text-ink">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  placeholder="agent@tradehubuae.com"
                />
              </div>
              <Button className="btn-brand">Save Changes</Button>
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="max-w-lg space-y-6">
            <h2 className="text-lg font-semibold text-ink">Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between rounded-lg border border-line p-4">
                <div>
                  <p className="text-sm font-medium text-ink">Push Notifications</p>
                  <p className="text-xs text-ink-3">Receive notifications when offline</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-line" />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-line p-4">
                <div>
                  <p className="text-sm font-medium text-ink">Sound</p>
                  <p className="text-xs text-ink-3">Play sound on new messages</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-line" />
              </label>
            </div>
          </div>
        )}

        {activeSection === "security" && (
          <div className="max-w-lg space-y-6">
            <h2 className="text-lg font-semibold text-ink">Security</h2>
            <p className="text-sm text-ink-2">Security settings coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
