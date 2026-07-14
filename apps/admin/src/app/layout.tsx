import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AdminShell from "@/components/AdminShell";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-heading" });

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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
