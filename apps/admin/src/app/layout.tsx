import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    template: "%s | TradeHub Admin",
    default: "TradeHub Admin Dashboard",
  },
  description: "TradeHub UAE Administration Panel",
  robots: { index: false, follow: false },
};

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Live Chat", href: "/dashboard/chats", icon: "MessageCircle" },
  { label: "Products", href: "/products", icon: "Package" },
  { label: "Inventory", href: "/inventory", icon: "Warehouse" },
  { label: "Orders", href: "/orders", icon: "ShoppingCart" },
  { label: "Customers", href: "/customers", icon: "Users" },
  { label: "Bulk Sales", href: "/bulk-sales", icon: "Building2" },
  { label: "Combo Offers", href: "/combo-offers", icon: "Tags" },
  { label: "Reviews", href: "/reviews", icon: "Star" },
  { label: "Blog", href: "/blog", icon: "FileText" },
  { label: "Media", href: "/media", icon: "Image" },
  { label: "SEO", href: "/seo", icon: "Search" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "AI Assistant", href: "/ai", icon: "Bot" },
  { label: "Settings", href: "/settings", icon: "Settings" },
  { label: "Users", href: "/users", icon: "Shield" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <div className="flex min-h-screen">
          <aside className="w-64 border-r bg-sidebar text-sidebar-foreground">
            <div className="flex h-16 items-center border-b border-sidebar-border px-6">
              <span className="text-xl font-bold text-sidebar-primary">TradeHub</span>
            </div>
            <nav className="p-4">
              {sidebarItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
          <main className="flex-1 overflow-auto">
            <header className="flex h-16 items-center justify-between border-b bg-background px-8">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <div className="flex items-center gap-4">
                <a href="/" className="text-sm text-muted-foreground hover:text-primary">View Site</a>
              </div>
            </header>
            <div className="p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
