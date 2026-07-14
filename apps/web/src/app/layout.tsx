import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { organizationSchema } from "@tradehubuae/seo";
import { cn } from "@tradehubuae/ui";
import { CartProvider } from "@/lib/cart-context";
import { CartFlyProvider } from "@/lib/cart-fly-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | TradeHub UAE",
    default: "TradeHub UAE - Premium IT Equipment & Electronics in UAE",
  },
  description: "UAE's Premier Destination for IT Equipment. New & Refurbished Laptops, Desktop PCs, Gaming PCs, Components, Accessories & Networking Products. Best Prices in Dubai, Abu Dhabi & UAE.",
  keywords: ["IT equipment UAE", "laptops Dubai", "gaming PCs UAE", "computer parts Dubai", "refurbished laptops UAE"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tradehubuae.com"),
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: "TradeHub UAE",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </head>
      <body className={cn("min-h-screen flex flex-col bg-white antialiased", inter.variable)}>
        <CartProvider>
          <CartFlyProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartFlyProvider>
        </CartProvider>
      </body>
    </html>
  );
}
