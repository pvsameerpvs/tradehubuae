import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdminShell from "@/components/AdminShell";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    template: "%s | TradeHub Admin",
    default: "TradeHub Admin Dashboard",
  },
  description: "TradeHub UAE Administration Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
