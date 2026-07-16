import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Building,
  Warehouse,
  ShoppingCart,
  Users,
  Building2,
  Tags,
  FileText,
  Image,
  Search,
  BarChart3,
  Settings,
  Shield,
  Grid3X3,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Products", href: "/products", icon: Package },
      { label: "Orders", href: "/orders", icon: ShoppingCart },
      { label: "Categories", href: "/categories", icon: FolderTree },
      { label: "Brands", href: "/brands", icon: Building },
      { label: "Customers", href: "/customers", icon: Users },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Inventory", href: "/inventory", icon: Warehouse },
      { label: "Combo Offers", href: "/combo-offers", icon: Tags },
      { label: "Bulk Sales", href: "/bulk-sales", icon: Building2 },
      { label: "Media", href: "/media", icon: Image },
      { label: "Blog", href: "/blog", icon: FileText },
      { label: "Uses", href: "/uses", icon: Grid3X3 },
      { label: "SEO", href: "/seo", icon: Search },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Users", href: "/users", icon: Shield },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
