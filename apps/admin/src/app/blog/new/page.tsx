"use client";

import BlogForm from "@/app/blog/blog-form";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>New Blog Post</h1>
        <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Create a new blog article</p>
      </div>
      <BlogForm />
    </div>
  );
}
