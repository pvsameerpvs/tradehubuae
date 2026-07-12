import type { Metadata } from "next";
import { categories } from "@/data";
import { CategoryCard } from "@/components/shared/CategoryCard";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse IT equipment by category - Laptops, PCs, Gaming, Components and more in UAE",
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Product Categories</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>
    </div>
  );
}
