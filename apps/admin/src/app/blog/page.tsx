"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type PaginatedResponse } from "@/lib/api";
import { FileText, Plus, Eye } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  author: { name: string } | null;
  createdAt: string;
}

export default function BlogPage() {
  const [data, setData] = useState<PaginatedResponse<BlogPost> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<PaginatedResponse<BlogPost>>("/blog", { limit: 50, sort: "createdAt", order: "desc" })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load posts"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Blog</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">Manage blog posts and articles</p>
        </div>
        <Link href="/blog/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:h-10 sm:px-6">
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">New Post</span>
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {loading ? (
          <div className="p-6 text-sm text-ink-3">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-sale">{error}</div>
        ) : !data?.data?.length ? (
          <div className="p-6 text-center">
            <FileText className="mx-auto h-8 w-8 text-ink-3" strokeWidth={1.5} />
            <p className="mt-2 text-sm font-medium text-ink-2">No blog posts yet</p>
            <p className="mt-0.5 text-xs text-ink-3">Create your first blog post to get started.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line sm:hidden">
              {data.data.map((post) => (
                <div key={post.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{post.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${post.published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-3">{post.author?.name ?? "—"}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-3">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <Link href={`/blog/${post.id}`} className="font-semibold text-brand">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="border-b text-left text-xs text-ink-3 uppercase tracking-wider">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Author</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((post) => (
                  <tr key={post.id} className="border-b last:border-0 transition-colors hover:bg-bg2">
                    <td className="p-4">
                      <p className="text-sm font-medium text-ink">{post.title}</p>
                      <p className="text-xs text-ink-3">/{post.slug}</p>
                    </td>
                    <td className="p-4 text-sm text-ink-2">{post.author?.name ?? "—"}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${post.published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ink-2">
                      {new Date(post.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="p-4">
                      <Link href={`/blog/${post.id}`} className="text-sm font-semibold text-brand hover:underline">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
