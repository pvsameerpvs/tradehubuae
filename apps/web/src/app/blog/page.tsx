import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@tradehubuae/ui";
import { FileText } from "@/components/icons";
import { blogPosts } from "@/data";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">TradeHub UAE Blog</h1>
        <p className="text-lg text-ink-2">Tech guides, buying tips, and industry insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border bg-white shadow-panel transition hover:shadow-panel"
          >
            <div className="flex aspect-video items-center justify-center bg-bg2">
              <FileText className="h-12 w-12 text-ink-2/50" strokeWidth={1} />
            </div>
            <div className="p-5">
              <Badge variant="secondary" className="mb-3">{post.category}</Badge>
              <h2 className="font-semibold group-hover:text-brand">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-ink-2">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-ink-2">
                <span>{post.date}</span>
                <span>&middot;</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
