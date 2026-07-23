"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api, type PaginatedResponse } from "@/lib/api";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
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
  Textarea,
  Switch,
} from "@tradehubuae/ui";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  condition: string;
}

interface ComboOfferItem {
  productId: string;
  quantity: number;
  product?: Product;
}

interface ComboOffer {
  id: string;
  name: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  image: string | null;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  items: ComboOfferItem[];
}

const comboSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  discountType: z.string(),
  discountValue: z.coerce
    .number()
    .min(0, "Must be non-negative")
    .default(0),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

type ComboFormValues = z.infer<typeof comboSchema>;

export function ComboOfferForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<ComboOfferItem[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ComboFormValues>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      name: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      image: "",
      isActive: true,
      startsAt: "",
      expiresAt: "",
    },
  });

  const { reset, control } = form;

  useEffect(() => {
    api
      .get<PaginatedResponse<Product>>("/products", {
        limit: 200,
        sort: "name",
        order: "asc",
      })
      .then((res) => setProducts(res.data))
      .catch((err) => setSubmitError(err instanceof Error ? err.message : "Failed to load data"));
  }, []);

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api
      .get<ComboOffer>(`/combo-offers/${id}`)
      .then((offer) => {
        reset({
          name: offer.name,
          description: offer.description ?? "",
          discountType: offer.discountType,
          discountValue: Number(offer.discountValue),
          image: offer.image ?? "",
          isActive: offer.isActive,
          startsAt: offer.startsAt
            ? new Date(offer.startsAt).toISOString().slice(0, 16)
            : "",
          expiresAt: offer.expiresAt
            ? new Date(offer.expiresAt).toISOString().slice(0, 16)
            : "",
        });
        setItems(
          offer.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            product: i.product,
          })),
        );
      })
      .catch((err) => setSubmitError(err instanceof Error ? err.message : "Failed to load data"))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (
    idx: number,
    field: keyof ComboOfferItem,
    value: string | number,
  ) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value } as ComboOfferItem;
    setItems(updated);
  };

  const onSubmit = async (data: ComboFormValues) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const validItems = items.filter((i) => i.productId);
      const payload = {
        ...data,
        image: data.image || undefined,
        startsAt: data.startsAt
          ? new Date(data.startsAt).toISOString()
          : undefined,
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toISOString()
          : undefined,
        items:
          validItems.length > 0
            ? validItems.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
              }))
            : undefined,
      };
      if (id) {
        await api.put(`/combo-offers/${id}`, payload);
        toast.success("Combo offer updated");
      } else {
        await api.post("/combo-offers", payload);
        toast.success("Combo offer created");
      }
      router.push("/combo-offers");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="max-w-2xl space-y-5">
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-4 w-20 animate-pulse rounded bg-bg2" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-bg2" />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <div className="h-10 w-24 animate-pulse rounded-lg bg-bg2" />
        <div className="h-10 w-24 animate-pulse rounded-lg bg-bg2" />
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-5"
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

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Image</FormLabel>
              <ImageUpload
                value={field.value ?? ""}
                onChange={field.onChange}
                label="Offer Image"
                folder="offers"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
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
                    <SelectItem value="PERCENTAGE">
                      Percentage (%)
                    </SelectItem>
                    <SelectItem value="FIXED">Fixed (AED)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? 0
                          : parseFloat(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="startsAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-ink">
              Products in Offer
            </label>
            <button
              type="button"
              onClick={addItem}
              className="text-sm font-semibold text-brand hover:underline"
            >
              + Add Product
            </button>
          </div>

          {items.length > 0 && (
            <div className="mb-3 rounded-lg border border-line bg-bg2 p-3">
              <p className="mb-2 text-xs font-medium text-ink-2">
                Select multiple products at once:
              </p>
              <div className="max-h-40 space-y-1 overflow-y-auto">
                {products
                  .filter(
                    (p) => !items.some((i) => i.productId === p.id),
                  )
                  .map((p) => (
                    <label
                      key={p.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        value={p.id}
                        className="rounded border-line"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setItems([
                              ...items,
                              {
                                productId: p.id,
                                quantity: 1,
                                product: p,
                              },
                            ]);
                          } else {
                            setItems(
                              items.filter(
                                (i) => i.productId !== p.id,
                              ),
                            );
                          }
                        }}
                      />
                      {p.name}
                    </label>
                  ))}
              </div>
            </div>
          )}

          {items.map((item, idx) => {
            const prod = products.find(
              (p) => p.id === item.productId,
            );
            return (
              <div
                key={item.productId || idx}
                className="mb-2 flex items-center gap-3"
              >
                <span className="flex-1 truncate text-sm text-ink">
                  {prod ? prod.name : "Unknown product"}
                </span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      "quantity",
                      parseInt(e.target.value) || 1,
                    )
                  }
                  className="w-20 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-sm font-semibold text-sale hover:underline"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/combo-offers")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
