export interface Use {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const uses: Use[] = [
  { id: "1", name: "Gaming", slug: "gaming", image: "" },
  { id: "2", name: "Office", slug: "office", image: "" },
  { id: "3", name: "Student", slug: "student", image: "" },
  { id: "4", name: "Content Creation", slug: "content-creation", image: "" },
  { id: "5", name: "Business", slug: "business", image: "" },
];

export function getUse(id: string): Use | undefined {
  return uses.find((u) => u.id === id);
}

export function getUseBySlug(slug: string): Use | undefined {
  return uses.find((u) => u.slug === slug);
}
