"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api, type PaginatedResponse } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
} from "@tradehubuae/ui";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  parent: { id: string; name: string } | null;
}

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoryForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
      parentId: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  const { reset, control, watch } = form;

  useEffect(() => {
    api
      .get<PaginatedResponse<Category>>("/categories", {
        limit: 200,
        sort: "name",
        order: "asc",
      })
      .then((res) => setCategories(res.data))
      .catch((err) => setSubmitError(err instanceof Error ? err.message : "Failed to load data"));
  }, []);

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api
      .get<Category>(`/categories/${id}`)
      .then((cat) =>
        reset({
          name: cat.name,
          image: cat.image ?? "",
          parentId: cat.parent?.id ?? "",
          sortOrder: cat.sortOrder ?? 0,
          isActive: cat.isActive ?? true,
        }),
      )
      .catch((err) => setSubmitError(err instanceof Error ? err.message : "Failed to load data"))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const payload = {
        ...data,
        parentId: data.parentId || undefined,
        image: data.image || undefined,
      };
      if (id) {
        await api.put(`/categories/${id}`, payload);
      } else {
        await api.post("/categories", payload);
      }
      router.push("/categories");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="text-sm text-ink-2">Loading...</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-lg space-y-5"
        noValidate
      >
        {submitError && (
          <div className="rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale">
            {submitError}
          </div>
        )}

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

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Slug
          </label>
          <Input
            value={watch("name")
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")}
            disabled
            className="bg-bg2 text-ink-2"
          />
        </div>

        <FormField
          control={control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Image</FormLabel>
              <ImageUpload
                value={field.value ?? ""}
                onChange={field.onChange}
                folder="categories"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                onValueChange={(val) =>
                  field.onChange(
                    val === "__none__" ? "" : val,
                  )
                }
                value={field.value || "__none__"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="None (Root)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="__none__">
                    None (Root)
                  </SelectItem>
                  {categories
                    .filter((c) => c.id !== id)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? 0
                          : parseInt(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex h-full items-end gap-2 pb-2">
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
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Saving..." : id ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/categories")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
