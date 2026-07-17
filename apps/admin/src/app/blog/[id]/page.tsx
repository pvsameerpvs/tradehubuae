"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/app/blog/blog-form";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back
      </button>
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Edit Blog Post</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Update your blog article</p>
      </div>
      <BlogForm id={params.id as string} />
    </div>
  );
}
