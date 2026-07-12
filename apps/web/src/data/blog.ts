export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

export const blogPosts: BlogPost[] = [
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
