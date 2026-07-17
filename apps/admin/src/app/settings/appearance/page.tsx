"use client";

import { useState } from "react";
import { ArrowLeft, Palette, Save } from "lucide-react";
import { Card, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";

export default function AppearanceSettingsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    logo: "",
    favicon: "",
    primaryColor: "#134A7C",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-bg3 transition-colors">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Appearance</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Logo, favicon, and theme customization</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-5 space-y-4">
          <ImageUpload
            value={form.logo}
            onChange={(url) => setForm({ ...form, logo: url })}
            label="Store Logo"
            folder="branding"
          />
          <ImageUpload
            value={form.favicon}
            onChange={(url) => setForm({ ...form, favicon: url })}
            label="Favicon"
            folder="branding"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="h-10 w-10 rounded-lg border border-line bg-white p-0.5"
              />
              <input
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-mono"
              />
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={handleSave}>
              <Save className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
