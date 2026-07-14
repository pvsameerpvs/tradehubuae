"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@tradehubuae/ui";
import { api, type PaginatedResponse } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import { Sparkles } from "lucide-react";

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
  condition: string;
  price: number;
  compareAtPrice: number | null;
  brandId: string | null;
  badge: string | null;
  isActive: boolean;
  isFeatured: boolean;
  totalStock: number;
  specProcessor: string | null;
  specRam: string | null;
  specStorage: string | null;
  specDisplay: string | null;
  specGpu: string | null;
  specBattery: string | null;
  specWeight: string | null;
  specWarranty: string | null;
  images: ProductImage[];
  categories: ProductCategory[];
}

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(500),
  description: z.string().optional(),
  condition: z.enum(["New", "Like_New", "Excellent", "Good", "Fair"]),
  price: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number({ required_error: "Price is required" }).min(0, "Must be non-negative"),
  ),
  compareAtPrice: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
    z.number().min(0).optional(),
  ),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  badge: z.string().optional(),
  specProcessor: z.string().optional(),
  specRam: z.string().optional(),
  specStorage: z.string().optional(),
  specDisplay: z.string().optional(),
  specGpu: z.string().optional(),
  specBattery: z.string().optional(),
  specWeight: z.string().optional(),
  specWarranty: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  condition: "New",
  price: undefined as unknown as number,
  compareAtPrice: undefined,
  categoryId: "",
  brandId: "",
  badge: "",
  specProcessor: "",
  specRam: "",
  specStorage: "",
  specDisplay: "",
  specGpu: "",
  specBattery: "",
  specWeight: "",
  specWarranty: "",
  isActive: true,
  isFeatured: false,
};

export default function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [fetching, setFetching] = useState(!!id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
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
      .catch((err) => console.error("Failed to fetch categories/brands", err));
  }, []);

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api.get<ExistingProduct>(`/products/${id}`)
      .then((p) => {
        reset({
          name: p.name,
          description: p.description ?? "",
          condition: p.condition as ProductFormValues["condition"],
          price: Number(p.price),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
          categoryId: (p.categories?.find((c) => c.isPrimary)?.categoryId ?? p.categories?.[0]?.categoryId) ?? "",
          brandId: p.brandId ?? "",
          badge: p.badge ?? "",
          specProcessor: p.specProcessor ?? "",
          specRam: p.specRam ?? "",
          specStorage: p.specStorage ?? "",
          specDisplay: p.specDisplay ?? "",
          specGpu: p.specGpu ?? "",
          specBattery: p.specBattery ?? "",
          specWeight: p.specWeight ?? "",
          specWarranty: p.specWarranty ?? "",
          isActive: p.isActive,
          isFeatured: p.isFeatured,
        });
        setImages(p.images?.filter((img) => img?.url).map((img) => img.url) ?? []);
      })
      .catch((err) => console.error("Failed to fetch product", err))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const handleAiGenerate = async () => {
    setGenerating(true);
    setGenerationError(null);

    try {
      const formData = getValues();
      const categoryName = categories.find((c) => c.id === formData.categoryId)?.name;
      const brandName = brands.find((b) => b.id === formData.brandId)?.name;

      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
      const res = await fetch(`${API_BASE}/ai/auto-fill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images,
          name: formData.name || undefined,
          description: formData.description || undefined,
          category: categoryName,
          brand: brandName,
          condition: formData.condition,
          specProcessor: formData.specProcessor || undefined,
          specRam: formData.specRam || undefined,
          specStorage: formData.specStorage || undefined,
          specDisplay: formData.specDisplay || undefined,
          specGpu: formData.specGpu || undefined,
          specBattery: formData.specBattery || undefined,
          specWeight: formData.specWeight || undefined,
          specWarranty: formData.specWarranty || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "AI generation failed" }));
        throw new Error(err.message);
      }

      const data = await res.json();

      if (data.name) setValue("name", data.name);
      if (data.description) setValue("description", data.description);
      if (data.condition) setValue("condition", data.condition);
      if (data.price) setValue("price", Number(data.price));
      if (data.categoryId) setValue("categoryId", data.categoryId);
      if (data.brandId) setValue("brandId", data.brandId);
      if (data.badge) setValue("badge", data.badge);
      if (data.specProcessor) setValue("specProcessor", data.specProcessor);
      if (data.specRam) setValue("specRam", data.specRam);
      if (data.specStorage) setValue("specStorage", data.specStorage);
      if (data.specDisplay) setValue("specDisplay", data.specDisplay);
      if (data.specGpu) setValue("specGpu", data.specGpu);
      if (data.specBattery) setValue("specBattery", data.specBattery);
      if (data.specWeight) setValue("specWeight", data.specWeight);
      if (data.specWarranty) setValue("specWarranty", data.specWarranty);
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitError(null);
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        condition: data.condition,
        price: data.price,
        compareAtPrice: data.compareAtPrice || undefined,
        categoryId: data.categoryId || undefined,
        brandId: data.brandId || undefined,
        badge: data.badge || undefined,
        specProcessor: data.specProcessor || undefined,
        specRam: data.specRam || undefined,
        specStorage: data.specStorage || undefined,
        specDisplay: data.specDisplay || undefined,
        specGpu: data.specGpu || undefined,
        specBattery: data.specBattery || undefined,
        specWeight: data.specWeight || undefined,
        specWarranty: data.specWarranty || undefined,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
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

      {/* AI Auto-fill */}
      <div className="flex items-center justify-between rounded-xl border border-brand/20 bg-brand/[0.03] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-ink">Auto-fill with AI</p>
          <p className="mt-0.5 text-xs text-ink-2">
            Upload images or type any details, then click generate to auto-fill all fields
          </p>
        </div>
        <Button
          type="button"
          onClick={handleAiGenerate}
          disabled={generating}
        >
          <Sparkles className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
          {generating ? "Generating..." : "Generate"}
        </Button>
      </div>
      {generationError && (
        <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
          {generationError}
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (AED) *</Label>
              <Input id="price" type="number" min={0} step="0.01" {...register("price")} />
              {errors.price && <FieldError>{errors.price.message}</FieldError>}
            </div>
            <div>
              <Label htmlFor="compareAtPrice">Compare At</Label>
              <Input id="compareAtPrice" type="number" min={0} step="0.01" {...register("compareAtPrice")} />
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
            <div>
              <Label htmlFor="badge">Badge</Label>
              <select
                id="badge"
                {...register("badge")}
                className="flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
              >
                <option value="">None</option>
                <option value="Certified">Certified</option>
                <option value="Best Seller">Best Seller</option>
                <option value="New">New</option>
                <option value="Great deal">Great deal</option>
                <option value="Staff pick">Staff pick</option>
                <option value="Like new">Like new</option>
                <option value="Low stock">Low stock</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specProcessor">Processor</Label>
              <Input id="specProcessor" placeholder="e.g. Apple M2" {...register("specProcessor")} />
            </div>
            <div>
              <Label htmlFor="specRam">RAM</Label>
              <Input id="specRam" placeholder="e.g. 16GB DDR5" {...register("specRam")} />
            </div>
            <div>
              <Label htmlFor="specStorage">Storage</Label>
              <Input id="specStorage" placeholder="e.g. 512GB SSD" {...register("specStorage")} />
            </div>
            <div>
              <Label htmlFor="specDisplay">Display</Label>
              <Input id="specDisplay" placeholder='e.g. 15.6" FHD+' {...register("specDisplay")} />
            </div>
            <div>
              <Label htmlFor="specGpu">GPU</Label>
              <Input id="specGpu" placeholder="e.g. NVIDIA RTX 4060" {...register("specGpu")} />
            </div>
            <div>
              <Label htmlFor="specBattery">Battery</Label>
              <Input id="specBattery" placeholder="e.g. Up to 10 hours" {...register("specBattery")} />
            </div>
            <div>
              <Label htmlFor="specWeight">Weight</Label>
              <Input id="specWeight" placeholder="e.g. 1.8 kg" {...register("specWeight")} />
            </div>
            <div>
              <Label htmlFor="specWarranty">Warranty</Label>
              <Input id="specWarranty" placeholder="e.g. 2 Years" {...register("specWarranty")} />
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
            {images.length < 6 && (
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
