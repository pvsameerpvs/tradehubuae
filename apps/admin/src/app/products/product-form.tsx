"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { api, type PaginatedResponse } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductCategory {
  categoryId: string;
  isPrimary: boolean;
}

interface ExistingProduct {
  name: string;
  description: string | null;
  shortDescription: string | null;
  condition: string;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  brandId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  totalStock: number;
  seoTitle: string | null;
  seoDescription: string | null;
  metaKeywords: string | null;
  images: ProductImage[];
  categories: ProductCategory[];
}

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(500),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  condition: z.enum(["New", "Like_New", "Excellent", "Good", "Fair"]),
  price: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number({ required_error: "Price is required" }).min(0, "Must be non-negative"),
  ),
  compareAtPrice: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
    z.number().min(0).optional(),
  ),
  costPrice: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
    z.number().min(0).optional(),
  ),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  seoTitle: z.string().max(70, "Max 70 characters").optional(),
  seoDescription: z.string().max(160, "Max 160 characters").optional(),
  metaKeywords: z.string().max(255).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  shortDescription: "",
  condition: "New",
  price: undefined as unknown as number,
  compareAtPrice: undefined,
  costPrice: undefined,
  categoryId: "",
  brandId: "",
  isActive: true,
  isFeatured: false,
  seoTitle: "",
  seoDescription: "",
  metaKeywords: "",
};

export default function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [fetching, setFetching] = useState(!!id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
    Promise.all([
      api.get<PaginatedResponse<Category>>("/categories", { limit: 200, sort: "name", order: "asc" }),
      api.get<PaginatedResponse<Brand>>("/brands", { limit: 200, sort: "name", order: "asc" }),
    ])
      .then(([cats, brs]) => {
        setCategories(cats.data);
        setBrands(brs.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api.get<ExistingProduct>(`/products/${id}`)
      .then((p) => {
        reset({
          name: p.name,
          description: p.description ?? "",
          shortDescription: p.shortDescription ?? "",
          condition: p.condition as ProductFormValues["condition"],
          price: Number(p.price),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
          costPrice: p.costPrice ? Number(p.costPrice) : undefined,
          categoryId: (p.categories?.find((c) => c.isPrimary)?.categoryId ?? p.categories?.[0]?.categoryId) ?? "",
          brandId: p.brandId ?? "",
          isActive: p.isActive,
          isFeatured: p.isFeatured,
          seoTitle: p.seoTitle ?? "",
          seoDescription: p.seoDescription ?? "",
          metaKeywords: p.metaKeywords ?? "",
        });
        setImages(p.images?.filter((img) => img?.url).map((img) => img.url) ?? []);
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [id, reset]);

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitError(null);
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        shortDescription: data.shortDescription || undefined,
        condition: data.condition,
        price: data.price,
        compareAtPrice: data.compareAtPrice || undefined,
        costPrice: data.costPrice || undefined,
        categoryId: data.categoryId || undefined,
        brandId: data.brandId || undefined,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        seoTitle: data.seoTitle || undefined,
        seoDescription: data.seoDescription || undefined,
        metaKeywords: data.metaKeywords || undefined,
      };

      if (id) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      router.push("/products");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  if (fetching) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-ink-2">Loading product...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {submitError && (
        <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {submitError}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={5}
                {...register("description")}
                className="flex w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <textarea
                id="shortDescription"
                rows={2}
                {...register("shortDescription")}
                className="flex w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (AED) *</Label>
              <Input id="price" type="number" min={0} step="0.01" {...register("price")} />
              {errors.price && <FieldError>{errors.price.message}</FieldError>}
            </div>
            <div>
              <Label htmlFor="compareAtPrice">Compare At</Label>
              <Input id="compareAtPrice" type="number" min={0} step="0.01" {...register("compareAtPrice")} />
            </div>
            <div>
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input id="costPrice" type="number" min={0} step="0.01" {...register("costPrice")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                {...register("categoryId")}
                className="flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="brandId">Brand</Label>
              <select
                id="brandId"
                {...register("brandId")}
                className="flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
              >
                <option value="">Select brand...</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                {...register("condition")}
                className="flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
              >
                <option value="New">New</option>
                <option value="Like_New">Like New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {images.map((url, idx) => (
              <div key={idx} className="group relative h-28 w-28 overflow-hidden rounded-lg border border-line bg-bg2">
                <img src={url} alt="" className="h-full w-full object-cover" />
                {idx === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-chip">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <ImageUpload
                value=""
                onChange={(url) => setImages([...images, url])}
                label="Add Image"
                folder="products"
              />
            )}
          </div>
          {images.length === 0 && (
            <p className="mt-2 text-xs text-ink-3">Upload at least one image for the product gallery.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input id="seoTitle" {...register("seoTitle")} />
              {errors.seoTitle && <FieldError>{errors.seoTitle.message}</FieldError>}
            </div>
            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <textarea
                id="seoDescription"
                rows={2}
                {...register("seoDescription")}
                className="flex w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
              />
              {errors.seoDescription && <FieldError>{errors.seoDescription.message}</FieldError>}
            </div>
            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input id="metaKeywords" {...register("metaKeywords")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 rounded border-line text-brand focus:outline-2 focus:outline-offset-2 focus:outline-ink/40"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            {...register("isFeatured")}
            className="h-4 w-4 rounded border-line text-brand focus:outline-2 focus:outline-offset-2 focus:outline-ink/40"
          />
          Featured
        </label>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : id ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-ink">
      {children}
    </label>
  );
}

function FieldError({ children }: { children?: React.ReactNode }) {
  return <p className="mt-1 text-xs text-sale">{children}</p>;
}
