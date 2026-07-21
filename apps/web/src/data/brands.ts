import { getBrands, getBrandById } from "@/lib/actions/brands";
import type { BrandData } from "@/lib/actions/brands";

export type Brand = {
  name: string;
  slug: string;
  description: string;
  image?: string;
};

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const brands = await getBrands();
    return brands.map((b) => ({
      name: b.name,
      slug: b.slug,
      description: b.description ?? "",
      image: b.logo,
    }));
  } catch (e) {
    console.error("[fetchBrands] Failed:", e);
    return [];
  }
}

export { getBrandById };
export type { BrandData };
