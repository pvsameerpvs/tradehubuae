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
} from "@tradehubuae/ui";

interface UseItem {
  id: string;
  name: string;
  image: string | null;
}

const useSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
});

type UseFormValues = z.infer<typeof useSchema>;

export function UseForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<UseFormValues>({
    resolver: zodResolver(useSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const { reset, control, watch } = form;

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api
      .get<UseItem>(`/uses/${id}`)
      .then((item) =>
        reset({
          name: item.name,
          image: item.image ?? "",
        }),
      )
      .catch((err) => setSubmitError(err instanceof Error ? err.message : "Failed to load data"))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const onSubmit = async (data: UseFormValues) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const payload = {
        ...data,
        image: data.image || undefined,
      };
      if (id) {
        await api.put(`/uses/${id}`, payload);
      } else {
        await api.post("/uses", payload);
      }
      router.push("/uses");
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
              <FormLabel>Image</FormLabel>
              <ImageUpload
                value={field.value ?? ""}
                onChange={field.onChange}
                label="Image"
                folder="uses"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/uses")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
