import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your order at TradeHub UAE",
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
