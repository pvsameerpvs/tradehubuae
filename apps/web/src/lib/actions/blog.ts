"use server";

export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image?: string;
  category: string;
  author?: string;
  readTime?: string;
  publishedAt: string;
  createdAt: string;
}

export async function getBlogPosts(params?: {
  limit?: number;
  category?: string;
}): Promise<BlogPostData[]> {
  try {
    const { api } = await import("@/lib/api");
    const res = await api.get<{ data: BlogPostData[] }>("/blog", params as Record<string, string | number | boolean | undefined>);
    return res.data ?? [];
  } catch (e) {
    console.error("[getBlogPosts] Failed:", e);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostData | null> {
  try {
    const { api } = await import("@/lib/api");
    return await api.get<BlogPostData>(`/blog/${encodeURIComponent(slug)}`);
  } catch (e) {
    console.error(`[getBlogPostBySlug] Failed for ${slug}:`, e);
    return null;
  }
}
