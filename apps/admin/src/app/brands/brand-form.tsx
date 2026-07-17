"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
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
  Switch,
} from "@tradehubuae/ui";

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  isActive: boolean;
  sortOrder: number;
}

const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export function BrandForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      logo: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  const { reset, control, watch } = form;

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api
      .get<Brand>(`/brands/${id}`)
      .then((brand) =>
        reset({
          name: brand.name,
          logo: brand.logo ?? "",
          sortOrder: brand.sortOrder,
          isActive: brand.isActive,
        }),
      )
      .catch((err) => setSubmitError(err instanceof Error ? err.message : "Failed to load data"))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const onSubmit = async (data: BrandFormValues) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const payload = {
        ...data,
        logo: data.logo || undefined,
      };
      if (id) {
        await api.put(`/brands/${id}`, payload);
      } else {
        await api.post("/brands", payload);
      }
      router.push("/brands");
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
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Logo</FormLabel>
              <ImageUpload
                value={field.value ?? ""}
                onChange={field.onChange}
                label="Brand Logo"
                folder="brands"
              />
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
            onClick={() => router.push("/brands")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
