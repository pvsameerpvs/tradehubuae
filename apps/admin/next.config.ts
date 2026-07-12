import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@tradehubuae/ui",
    "@tradehubuae/auth",
    "@tradehubuae/config",
    "@tradehubuae/types",
    "@tradehubuae/seo",
    "@tradehubuae/utils",
    "@tradehubuae/validation",
    "@tradehubuae/logger",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.cloudflarestorage.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
