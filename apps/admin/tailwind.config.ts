import type { Config } from "tailwindcss";
import { tailwindConfig } from "@tradehubuae/config/tailwind";

const config: Config = {
  ...tailwindConfig,
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  plugins: [require("tailwindcss-animate")],
};

export default config;
