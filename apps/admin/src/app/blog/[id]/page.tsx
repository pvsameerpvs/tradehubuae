"use client";

import { useParams } from "next/navigation";
import BlogForm from "@/app/blog/blog-form";

export default function EditBlogPage() {
  const params = useParams();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Edit Blog Post</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Update your blog article</p>
      </div>
      <BlogForm id={params.id as string} />
    </div>
  );
}
