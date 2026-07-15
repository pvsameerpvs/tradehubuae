import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@tradehubuae/ui",
    "@tradehubuae/auth",
    "@tradehubuae/chat",
  ],
};

export default nextConfig;
