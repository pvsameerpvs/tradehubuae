import { getUses, getUseBySlug as getUseBySlugApi } from "@/lib/actions/uses";

export interface Use {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export async function fetchUses(): Promise<Use[]> {
  const uses = await getUses();
  return uses.map((u) => ({
    id: u.id,
    name: u.name,
    slug: u.slug,
    image: u.image ?? "",
  }));
}

export async function getUse(id: string): Promise<Use | undefined> {
  const uses = await fetchUses();
  return uses.find((u) => u.id === id);
}

export async function getUseBySlug(slug: string): Promise<Use | undefined> {
  const data = await getUseBySlugApi(slug);
  if (!data) return undefined;
  return { id: data.id, name: data.name, slug: data.slug, image: data.image ?? "" };
}
