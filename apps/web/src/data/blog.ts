import { getBlogPosts } from "@/lib/actions/blog";
import type { BlogPostData } from "@/lib/actions/blog";

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await getBlogPosts();
    return posts.map((p) => ({
      title: p.title,
      excerpt: p.excerpt,
      date: new Date(p.publishedAt).toLocaleDateString("en-AE", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      readTime: p.readTime ?? "5 min read",
      category: p.category,
      slug: p.slug,
    }));
  } catch {
    return [];
  }
}
