import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in or create an account at TradeHub UAE — access your orders, wishlist, and personalized shopping experience.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
