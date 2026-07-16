import { getCategories, getCategoryTree, getCategoryById } from "@/lib/actions/categories";
import type { CategoryData } from "@/lib/actions/categories";

export type { CategoryData };

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId: string | null;
  productCount?: number;
  children: CategoryTree[];
}

export type Category = {
  id: string;
  name: string;
  slug: string;
  desc: string;
  count: string;
  image?: string;
  parentId: string | null;
};

function toCategory(c: CategoryData | CategoryTree): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    desc: c.description ?? "",
    count: c.productCount ? `${c.productCount}+ products` : "",
    image: c.image,
    parentId: c.parentId ?? null,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const cats = await getCategories();
    return cats.map(toCategory);
  } catch {
    return [];
  }
}

export async function fetchCategoryTree(): Promise<CategoryTree[]> {
  try {
    const tree = await getCategoryTree();
    return tree.map(transformTreeNode);
  } catch {
    return [];
  }
}

function transformTreeNode(node: CategoryData): CategoryTree {
  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    description: node.description,
    image: node.image,
    parentId: node.parentId ?? null,
    productCount: node.productCount,
    children: (node.children ?? []).map(transformTreeNode),
  };
}

export { getCategoryById };
