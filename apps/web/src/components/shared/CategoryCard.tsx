import Link from "next/link";
import { Card, CardContent } from "@tradehubuae/ui";
import type { Category } from "@/data";
import {
  Laptop,
  Monitor,
  Gamepad2,
  Cpu,
  Keyboard,
  Wifi,
  HardDrive,
  Code2,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  Laptops: Laptop,
  "Desktop PCs": Monitor,
  "Gaming PCs": Gamepad2,
  Components: Cpu,
  Accessories: Keyboard,
  Networking: Wifi,
  Storage: HardDrive,
  Software: Code2,
};

export function CategoryCard({ category, href }: { category: Category; href?: string }) {
  const Icon = categoryIcons[category.name];

  return (
    <Link href={href ?? `/categories/${category.slug}`} className="flex-1 min-w-0">
      <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-none transition-shadow duration-200 hover:shadow-card">
        <div className="flex aspect-[1/1] items-center justify-center bg-bg2">
          {Icon && <Icon className="h-6 w-6 text-ink" strokeWidth={1.75} />}
        </div>
        <CardContent className="px-1 pb-1.5 pt-1 text-center">
          <h3 className="text-[11px] font-semibold leading-[14px] text-ink">
            {category.name}
          </h3>
          <p className="mt-0.5 text-[10px] leading-[12px] text-ink-2">
            {category.count}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
