"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  Switch,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@tradehubuae/ui";
import { api, type PaginatedResponse } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";
import { Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Category[];
}

interface CategoryOption {
  id: string;
  name: string;
  depth: number;
}

function flattenTree(nodes: Category[], depth = 0): CategoryOption[] {
  const result: CategoryOption[] = [];
  for (const n of nodes) {
    result.push({ id: n.id, name: n.name, depth });
    if (n.children) result.push(...flattenTree(n.children, depth + 1));
  }
  return result;
}

interface Brand {
  id: string;
  name: string;
}

interface UseItem {
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

interface ProductSpec {
  label: string;
  value: string;
}

interface ExistingProduct {
  name: string;
  description: string | null;
  condition: string;
  price: number;
  compareAtPrice: number | null;
  brandId: string | null;
  useId: string | null;
  stock: number | null;
  isActive: boolean;
  isFeatured: boolean;
  specs: ProductSpec[];
  images: ProductImage[];
  categories: ProductCategory[];
}

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(500),
  description: z.string().optional(),
  condition: z.enum(["New", "Like New", "Excellent", "Good", "Fair"]),
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
  useId: z.string().optional(),
  stock: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0).optional(),
  ),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const NONE_VALUE = "__none__";

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  condition: "New",
  price: "" as unknown as number,
  compareAtPrice: "" as unknown as number,
  categoryId: "",
  brandId: "",
  useId: "",
  stock: "" as unknown as number,
  isActive: true,
  isFeatured: false,
};

const specLabels = [
  { label: "Processor", placeholder: "e.g. Apple M2" },
  { label: "RAM", placeholder: "e.g. 16GB DDR5" },
  { label: "Storage", placeholder: "e.g. 512GB SSD" },
  { label: "Display", placeholder: 'e.g. 15.6" FHD+' },
  { label: "GPU", placeholder: "e.g. NVIDIA RTX 4060" },
  { label: "Battery", placeholder: "e.g. Up to 10 hours" },
  { label: "Weight", placeholder: "e.g. 1.8 kg" },
  { label: "Warranty", placeholder: "e.g. 2 Years" },
];

export function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [uses, setUses] = useState<UseItem[]>([]);
  const [fetching, setFetching] = useState(!!id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    Promise.all([
      api.get<Category[]>("/categories/tree"),
      api.get<PaginatedResponse<Brand>>("/brands", { limit: 200, sort: "name", order: "asc" }),
      api.get<PaginatedResponse<UseItem>>("/uses", { limit: 200, sort: "name", order: "asc" }),
    ])
      .then(([tree, brs, us]) => {
        setCategories(tree);
        setBrands(brs.data);
        setUses(us.data);
      })
      .catch(() => {
        toast.error("Failed to load categories, brands, or uses");
      });
  }, []);

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api
      .get<ExistingProduct>(`/products/${id}`)
      .then((p) => {
        const parsedSpecs = p.specs ?? [];
        setSpecs(parsedSpecs);
        reset({
          name: p.name,
          description: p.description ?? "",
          condition: p.condition as ProductFormValues["condition"],
          price: Number(p.price),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : ("" as unknown as number),
          categoryId: p.categories?.find((c) => c.isPrimary)?.categoryId ?? p.categories?.[0]?.categoryId ?? "",
          brandId: p.brandId ?? "",
          useId: p.useId ?? "",
          stock: p.stock ? Number(p.stock) : ("" as unknown as number),
          isActive: p.isActive,
          isFeatured: p.isFeatured,
        });
        setImages(p.images?.filter((img) => img?.url).map((img) => img.url) ?? []);
      })
      .catch(() => {
        toast.error("Failed to load product data");
      })
      .finally(() => setFetching(false));
  }, [id, reset]);

  const handleAiGenerate = async () => {
    setGenerating(true);
    setGenerationError(null);

    setTimeout(() => {
      setGenerationError("AI generation endpoint not available");
      setGenerating(false);
    }, 500);
  };

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitError(null);
    try {
      const payload: Record<string, unknown> = {
        name: data.name,
        description: data.description || undefined,
        condition: data.condition,
        price: data.price,
        compareAtPrice: data.compareAtPrice || undefined,
        categoryId: data.categoryId || undefined,
        brandId: data.brandId || undefined,
        useId: data.useId || undefined,
        specs: specs.filter((s) => s.value.trim()).map(({ label, value }) => ({ label, value })),
        images: images.filter(Boolean),
        stock: data.stock ?? 0,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      };

      if (id) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", payload);
        toast.success("Product created successfully");
      }
      router.push("/products");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save product";
      setSubmitError(msg);
      toast.error(msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-4 w-24 animate-pulse rounded bg-bg2" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-bg2" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 animate-pulse rounded-lg bg-bg2" />
          <div className="h-10 animate-pulse rounded-lg bg-bg2" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {submitError && (
          <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
            {submitError}
          </div>
        )}

        {/* AI Auto-fill */}
        <div className="flex flex-col items-start gap-3 rounded-xl border border-brand/20 bg-brand/[0.03] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Auto-fill with AI</p>
            <p className="mt-0.5 text-xs text-ink-2">
              Upload images or type any details, then click generate to auto-fill all fields
            </p>
          </div>
          <Button type="button" onClick={handleAiGenerate} disabled={generating}>
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
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (AED) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare At</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(
                          val === NONE_VALUE ? "" : val,
                        )
                      }
                      value={field.value || NONE_VALUE}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE}>
                          None
                        </SelectItem>
                        {flattenTree(categories).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {"\u00A0".repeat(cat.depth * 4)}
                            {cat.depth > 0 ? "─ " : ""}
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(
                          val === NONE_VALUE ? "" : val,
                        )
                      }
                      value={field.value || NONE_VALUE}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE}>
                          None
                        </SelectItem>
                        {brands.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="useId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Use</FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(
                          val === NONE_VALUE ? "" : val,
                        )
                      }
                      value={field.value || NONE_VALUE}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select use..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE}>
                          None
                        </SelectItem>
                        {uses.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Like New">
                          Like New
                        </SelectItem>
                        <SelectItem value="Excellent">
                          Excellent
                        </SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {specLabels.map((spec) => {
                const existing = specs.find((s) => s.label === spec.label);
                return (
                  <div key={spec.label}>
                    <label
                      htmlFor={`spec-${spec.label}`}
                      className="mb-1 block text-sm font-medium text-ink"
                    >
                      {spec.label}
                    </label>
                    <Input
                      id={`spec-${spec.label}`}
                      placeholder={spec.placeholder}
                      value={existing?.value ?? ""}
                      onChange={(e) => {
                        setSpecs((prev) => {
                          const next = prev.filter(
                            (s) => s.label !== spec.label,
                          );
                          if (e.target.value.trim()) {
                            next.push({
                              label: spec.label,
                              value: e.target.value,
                            });
                          }
                          return next;
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-start gap-4">
              {images.filter(Boolean).map((url, idx) => (
                <div
                  key={idx}
                  className="group relative h-24 w-24 overflow-hidden rounded-lg border border-line bg-bg2 sm:h-28 sm:w-28"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-chip">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== idx))
                    }
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {images.filter(Boolean).length < 5 && (
                <ImageUpload
                  key={images.filter(Boolean).length}
                  value=""
                  onChange={(url) => {
                    if (url) setImages((prev) => [...prev, url]);
                  }}
                  label="Add Image"
                  folder="products"
                />
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-ink-3">
              <span>{images.filter(Boolean).length}/5 images</span>
              {images.filter(Boolean).length === 0 && (
                <span>Upload at least one image for the product gallery.</span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-6">
          <FormField
            control={control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="pb-0">Active</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="pb-0">Featured</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Saving..." : id ? "Update Product" : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/products")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>

        {id && (
          <div className="border-t border-line pt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" disabled={deleting} className="w-full text-sale border-sale/30 hover:bg-sale/5 sm:w-auto">
                  <Trash2 className="mr-1.5 h-4 w-4" strokeWidth={1.75} />
                  {deleting ? "Deleting..." : "Delete Product"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Product</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this product? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" disabled={deleting} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-sale/30 bg-sale text-white hover:bg-sale-dark sm:w-auto"
                    disabled={deleting}
                    onClick={async () => {
                      setDeleting(true);
                      try {
                        await api.delete(`/products/${id}`);
                        toast.success("Product deleted");
                        router.push("/products");
                        router.refresh();
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Failed to delete product");
                        setDeleting(false);
                      }
                    }}
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </form>
    </Form>
  );
}
