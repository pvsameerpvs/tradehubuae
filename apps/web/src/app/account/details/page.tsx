"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Save,
  RefreshCw,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@tradehubuae/ui";
import { useAuth } from "@/lib/supabase/provider";
import { createClient } from "@/lib/supabase/client";
import { emailSchema, phoneSchema } from "@tradehubuae/validation";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: emailSchema,
  phone: phoneSchema.or(z.literal("")),
});
type ProfileInput = z.infer<typeof profileSchema>;

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "");
  if (d.startsWith("971") && d.length >= 11)
    return `+971 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 12)}`;
  if (d.startsWith("05") && d.length === 11)
    return `+971 ${d.slice(2, 4)} ${d.slice(4, 7)} ${d.slice(7, 11)}`;
  if (d.startsWith("5") && d.length === 9)
    return `+971 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 9)}`;
  return value;
}

export default function AccountDetails() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    if (!user) return;
    createClient()
      .from("users")
      .select("name, email, phone")
      .eq("id", user.id)
      .single()
      .then(({ data, error: err }: any) => {
        if (data && !err)
          reset({
            name: data.name ?? "",
            email: data.email ?? "",
            phone: data.phone ? formatPhone(data.phone) : "",
          });
        else
          reset({
            name: user.name ?? "",
            email: user.email ?? "",
            phone: "",
          });
      })
      .then(() => setLoading(false));
  }, [user, reset]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    setSuccess(false);
    const { error: err } = await createClient()
      .from("users")
      .update({ name: data.name, email: data.email, phone: data.phone || null })
      .eq("id", user?.id);
    if (err) setServerError("Failed to save profile");
    else setSuccess(true);
  });

  const handlePhone = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const d = e.target.value.replace(/\D/g, "");
      if (d.length >= 12) return;
      setValue("phone", formatPhone(e.target.value), { shouldValidate: true });
    },
    [setValue],
  );

  if (loading)
    return (
      <div className="rounded-2xl border border-line/60 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6">
          <div className="h-5 w-36 animate-pulse rounded-lg bg-gradient-to-r from-bg2 to-bg3" />
          <div className="mt-2 h-4 w-52 animate-pulse rounded-lg bg-gradient-to-r from-bg2 to-bg3" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-20 animate-pulse rounded bg-bg2" />
              <div className="mt-2 h-11 animate-pulse rounded-xl bg-bg2 sm:h-12" />
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="rounded-2xl border border-line/60 bg-white p-5 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
            <User className="h-4 w-4 text-brand" strokeWidth={1.5} />
          </div>
          <h2 className="text-sm font-semibold text-ink sm:text-base">
            Account Details
          </h2>
        </div>
        <p className="mt-2 text-sm text-ink-2">
          Update your personal information
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        {serverError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {serverError}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            Profile updated successfully
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
              <User className="h-3 w-3" strokeWidth={1.5} />
              Full Name
            </label>
            <Input
              {...register("name")}
              placeholder="Your full name"
              className="h-11 rounded-xl border-line/60 bg-white shadow-none transition-all focus-within:border-brand/30 sm:h-12"
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
              <Mail className="h-3 w-3" strokeWidth={1.5} />
              Email
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
              className="h-11 rounded-xl border-line/60 bg-white shadow-none transition-all focus-within:border-brand/30 sm:h-12"
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
              <Phone className="h-3 w-3" strokeWidth={1.5} />
              Phone
            </label>
            <Input
              {...register("phone", { onChange: handlePhone })}
              type="tel"
              placeholder="+971 50 XXX XXXX"
              className="h-11 rounded-xl border-line/60 bg-white shadow-none transition-all focus-within:border-brand/30 sm:h-12"
            />
            {errors.phone && (
              <p className="text-xs font-medium text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Avatar - Placeholder */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
              Avatar
            </label>
            <div className="flex h-11 w-full items-center gap-3 rounded-xl border border-dashed border-line bg-bg2/50 px-4 text-sm text-ink-3 sm:h-12">
              <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
              Avatar upload coming soon
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 gap-2 rounded-xl text-sm shadow-sm sm:h-12 sm:text-base"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={2} />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" strokeWidth={1.5} />
                Save Changes
              </>
            )}
          </Button>
          {success && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <CheckCircle className="h-4 w-4" strokeWidth={1.5} />
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
