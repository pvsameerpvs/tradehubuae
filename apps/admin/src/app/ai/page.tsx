"use client";

import { useState } from "react";
import { Sparkles, FileText, Globe, Image, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { Button } from "@tradehubuae/ui";

const tools = [
  {
    title: "Product Generator",
    desc: "Upload images and specs to auto-generate product listings",
    icon: Sparkles,
    color: "text-brand",
    bg: "bg-brand/5",
    content: "Upload images or enter product details and let AI generate a complete listing with title, description, and SEO metadata.",
  },
  {
    title: "SEO Content Generator",
    desc: "Generate SEO-optimized titles, descriptions, and meta data",
    icon: Globe,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    content: "Enter a product name or keyword and AI will generate SEO-friendly content including meta titles, descriptions, and keywords.",
  },
  {
    title: "Image Alt Text",
    desc: "Auto-generate alt text and captions for product images",
    icon: Image,
    color: "text-violet-600",
    bg: "bg-violet-50",
    content: "Upload product images and AI will generate descriptive alt text for accessibility and SEO.",
  },
  {
    title: "Description Writer",
    desc: "Write compelling product descriptions that convert",
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-50",
    content: "Describe your product in a few words and AI will craft an engaging product description.",
  },
];

export default function AIPage() {
  const [input, setInput] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>AI Assistant</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">AI-powered tools for content generation and optimization</p>
      </div>

      <Card>
        <CardHeader className="px-5 py-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles className="h-4 w-4 text-brand" strokeWidth={1.75} />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-line bg-white p-3 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            rows={4}
            placeholder="Describe what you want to create or ask a question..."
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="flex items-center gap-1 text-xs text-ink-3">
              <Info className="h-3 w-3" strokeWidth={1.75} />
              AI responses are generated and may need review
            </p>
            <Button className="h-9 sm:h-10" size="sm">Generate</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.title}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tool.bg}`}>
                    <Icon className={`h-5 w-5 ${tool.color}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{tool.title}</p>
                    <p className="mt-0.5 text-xs text-ink-2">{tool.desc}</p>
                    <p className="mt-2 text-xs text-ink-2">{tool.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
