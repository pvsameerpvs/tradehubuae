import { categories } from "@/data";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function CategoryGrid() {
  const displayCategories = categories.slice(0, 6);
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Shop by Category"
          description="Find exactly what you need"
          action={{ label: "View All Categories", href: "/categories" }}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayCategories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
