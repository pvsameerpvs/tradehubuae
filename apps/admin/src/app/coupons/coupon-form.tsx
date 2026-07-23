"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
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
  Switch,
} from "@tradehubuae/ui";

interface CouponItem {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
}

const couponSchema = z.object({
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  type: z.string(),
  value: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number({ required_error: "Value is required" }).min(0, "Must be non-negative"),
  ),
  minOrderAmount: z.preprocess(
    (v) => {
      if (v === "" || v === undefined || v === null) return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    },
    z.number().min(0).optional(),
  ),
  maxDiscount: z.preprocess(
    (v) => {
      if (v === "" || v === undefined || v === null) return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    },
    z.number().min(0).optional(),
  ),
  usageLimit: z.preprocess(
    (v) => {
      if (v === "" || v === undefined || v === null) return undefined;
      const n = Number(v);
      return isNaN(n) ? undefined : n;
    },
    z.number().min(1).optional(),
  ),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export function CouponForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      type: "percentage",
      value: "" as unknown as number,
      minOrderAmount: undefined,
      maxDiscount: undefined,
      usageLimit: undefined,
      isActive: true,
      startsAt: "",
      expiresAt: "",
    },
  });

  const { reset, control } = form;

  useEffect(() => {
    if (!id) return;
    setFetching(true);
    api
      .get<CouponItem>(`/coupons/${id}`)
      .then((item) =>
        reset({
          code: item.code,
          description: item.description ?? "",
          type: item.type,
          value: item.value,
          minOrderAmount: item.minOrderAmount ?? undefined,
          maxDiscount: item.maxDiscount ?? undefined,
          usageLimit: item.usageLimit ?? undefined,
          isActive: item.isActive,
          startsAt: item.startsAt ? item.startsAt.slice(0, 16) : "",
          expiresAt: item.expiresAt ? item.expiresAt.slice(0, 16) : "",
        }),
      )
      .catch((err) => setSubmitError(err instanceof Error ? err.message : "Failed to load data"))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const onSubmit = async (data: CouponFormValues) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const payload: Record<string, unknown> = {
        code: data.code,
        description: data.description || undefined,
        type: data.type,
        value: Number(data.value),
        minOrderAmount: data.minOrderAmount ?? undefined,
        maxDiscount: data.maxDiscount ?? undefined,
        usageLimit: data.usageLimit ?? undefined,
        isActive: data.isActive,
        startsAt: data.startsAt
          ? new Date(data.startsAt).toISOString()
          : undefined,
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toISOString()
          : undefined,
      };
      if (id) {
        await api.put(`/coupons/${id}`, payload);
        toast.success("Coupon updated");
      } else {
        await api.post("/coupons", payload);
        toast.success("Coupon created");
      }
      router.push("/coupons");
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
    <div className="max-w-lg space-y-5">
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-4 w-20 animate-pulse rounded bg-bg2" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-bg2" />
          </div>
        ))}
      </div>
      <div className="h-10 w-24 animate-pulse rounded-lg bg-bg2" />
    </div>
  );

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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code *</FormLabel>
              <FormControl>
                <Input
                  placeholder="SAVE20"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase())
                  }
                />
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
                <Input placeholder="20% off on all items" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
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
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
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
            name="minOrderAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Order Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Optional"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="maxDiscount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Discount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Optional"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="usageLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usage Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Unlimited"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="startsAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} value={field.value ?? ""} />
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
                  <Input type="datetime-local" {...field} value={field.value ?? ""} />
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

        <div className="flex gap-4 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/coupons")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
