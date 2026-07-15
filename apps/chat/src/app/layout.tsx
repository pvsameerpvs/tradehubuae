import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ChatShell } from "@/components/ChatShell";
import { AuthGuard } from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: {
    template: "%s | TradeHub Chat",
    default: "TradeHub Chat",
  },
  description: "Customer support chat for TradeHub UAE",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/chat-192.png" />
        <meta name="apple-mobile-web-app-title" content="TradeHub Chat" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <ChatShell>
          <AuthGuard>{children}</AuthGuard>
        </ChatShell>
      </body>
    </html>
  );
}
