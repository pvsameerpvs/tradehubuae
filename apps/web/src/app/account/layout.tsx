import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account at TradeHub UAE",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
