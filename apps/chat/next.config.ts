import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  transpilePackages: [
    "@tradehubuae/ui",
    "@tradehubuae/auth",
    "@tradehubuae/chat",
  ],
};

export default nextConfig;
