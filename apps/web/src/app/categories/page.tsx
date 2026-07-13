import type { Metadata } from "next";
import { categories } from "@/data";
import { CategoryCard } from "@/components/shared/CategoryCard";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse IT equipment by category - Laptops, PCs, Gaming, Components and more in UAE",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
      <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
        Product Categories
      </h1>
      <p className="mt-2 text-[14px] leading-[18px] text-ink-2">
        {categories.length} categories — from laptops to networking equipment
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>
    </div>
  );
}
