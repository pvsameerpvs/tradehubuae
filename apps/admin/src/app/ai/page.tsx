import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant",
};

export default function AIPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">AI Assistant</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Product Generator</h2>
          <p className="text-sm text-muted-foreground">
            Upload images and specs to auto-generate product listings with AI
          </p>
          <div className="mt-4 rounded-lg border-2 border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">Drop images here or click to upload</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">SEO Content Generator</h2>
          <p className="text-sm text-muted-foreground">
            Generate SEO-optimized titles, descriptions, and meta data
          </p>
          <div className="mt-4">
            <textarea
              className="w-full rounded-md border p-3 text-sm"
              rows={4}
              placeholder="Enter product name or description to generate SEO content..."
            />
            <button className="mt-3 h-10 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
