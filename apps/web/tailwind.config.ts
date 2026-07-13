import type { Config } from "tailwindcss";
import { tailwindConfig } from "@tradehubuae/config/tailwind";
import animate from "tailwindcss-animate";

const config: Config = {
  ...tailwindConfig,
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  plugins: [animate],
};

export default config;
