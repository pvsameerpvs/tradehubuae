import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@tradehubuae/ui";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tech guides, buying tips, and industry insights from TradeHub UAE",
};

const posts = [
  {
    title: "How to Choose the Right Laptop for Your Business in 2026",
    excerpt: "A comprehensive guide to selecting the perfect laptop for your business needs, from budget considerations to performance requirements.",
    date: "Jul 8, 2026",
    readTime: "5 min read",
    category: "Buying Guide",
    slug: "choose-right-laptop-business",
  },
  {
    title: "Top 10 Gaming PC Builds Under AED 5,000 in UAE",
    excerpt: "Build your dream gaming rig without breaking the bank. Our curated list of the best gaming PC builds available in the UAE.",
    date: "Jul 5, 2026",
    readTime: "8 min read",
    category: "Gaming",
    slug: "gaming-pc-builds-under-5000",
  },
  {
    title: "The Ultimate Guide to Networking Equipment for UAE Offices",
    excerpt: "Everything you need to know about setting up a reliable office network, from routers to switches and access points.",
    date: "Jun 28, 2026",
    readTime: "6 min read",
    category: "Networking",
    slug: "networking-guide-uae-offices",
  },
  {
    title: "Refurbished vs New: Which IT Equipment Should You Buy?",
    excerpt: "We break down the pros and cons of refurbished versus new IT equipment to help you make an informed decision.",
    date: "Jun 20, 2026",
    readTime: "4 min read",
    category: "Buying Guide",
    slug: "refurbished-vs-new-it-equipment",
  },
  {
    title: "Dubai's Digital Transformation: IT Trends Shaping 2026",
    excerpt: "Explore the key technology trends driving Dubai's digital transformation and how businesses can stay ahead.",
    date: "Jun 15, 2026",
    readTime: "7 min read",
    category: "Industry Insights",
    slug: "dubai-digital-transformation-2026",
  },
  {
    title: "Essential UPS Battery Backup Guide for UAE Businesses",
    excerpt: "Protect your critical IT infrastructure with the right UPS system. A complete guide for UAE businesses.",
    date: "Jun 10, 2026",
    readTime: "5 min read",
    category: "Guides",
    slug: "ups-battery-backup-guide-uae",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">TradeHub UAE Blog</h1>
        <p className="text-lg text-muted-foreground">Tech guides, buying tips, and industry insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border bg-card shadow-sm transition hover:shadow-md"
          >
            <div className="flex aspect-video items-center justify-center bg-muted">
              <svg className="h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="p-5">
              <Badge variant="secondary" className="mb-3">{post.category}</Badge>
              <h2 className="font-semibold group-hover:text-primary">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
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
