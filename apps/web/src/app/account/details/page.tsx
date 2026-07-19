"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, AlertCircle, User } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@tradehubuae/ui";
import { useAuth } from "@/lib/supabase/provider";
import { createClient } from "@/lib/supabase/client";
import { emailSchema, phoneSchema } from "@tradehubuae/validation";

const profileSchema = z.object({ name: z.string().min(1, "Name is required").max(255), email: emailSchema, phone: phoneSchema.or(z.literal("")) });
type ProfileInput = z.infer<typeof profileSchema>;

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "");
  if (d.startsWith("971") && d.length >= 11) return `+971 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 12)}`;
  if (d.startsWith("05") && d.length === 11) return `+971 ${d.slice(2, 4)} ${d.slice(4, 7)} ${d.slice(7, 11)}`;
  if (d.startsWith("5") && d.length === 9) return `+971 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 9)}`;
  return value;
}

export default function AccountDetails() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema), defaultValues: { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    if (!user) return;
    createClient().from("users").select("name, email, phone").eq("id", user.id).single().then(({ data, error: err }: any) => {
      if (data && !err) reset({ name: data.name ?? "", email: data.email ?? "", phone: data.phone ? formatPhone(data.phone) : "" });
      else reset({ name: user.name ?? "", email: user.email ?? "", phone: "" });
    }).then(() => setLoading(false));
  }, [user, reset]);

  useEffect(() => { if (!success) return; const t = setTimeout(() => setSuccess(false), 3000); return () => clearTimeout(t); }, [success]);

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null); setSuccess(false);
    const { error: err } = await createClient().from("users").update({ name: data.name, email: data.email, phone: data.phone || null }).eq("id", user?.id);
    if (err) setServerError("Failed to save profile"); else setSuccess(true);
  });

  const handlePhone = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value.replace(/\D/g, ""); if (d.length >= 12) return; setValue("phone", formatPhone(e.target.value), { shouldValidate: true });
  }, [setValue]);

  if (loading) return <div className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6"><div className="mb-6"><div className="h-5 w-32 animate-pulse rounded bg-bg2" /><div className="mt-2 h-4 w-48 animate-pulse rounded bg-bg2" /></div><div className="grid gap-5 sm:grid-cols-2">{[1, 2, 3].map((i) => <div key={i}><div className="h-3 w-20 animate-pulse rounded bg-bg2" /><div className="mt-2 h-11 animate-pulse rounded-lg bg-bg2 sm:h-12" /></div>)}</div></div>;

  return <div className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-6"><h2 className="text-sm font-semibold text-ink sm:text-base">Account Details</h2><p className="mt-1 text-sm text-ink-2">Update your personal information</p></div>
    <form className="space-y-5" onSubmit={onSubmit}>
      {serverError && <div className="flex items-center gap-2 rounded-lg border border-sale/30 bg-sale/5 px-4 py-3 text-sm text-sale"><AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />{serverError}</div>}
      {success && <div className="flex items-center gap-2 rounded-lg border border-green/30 bg-green/5 px-4 py-3 text-sm text-green"><CheckCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />Profile updated successfully</div>}
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Full Name</label><Input {...register("name")} placeholder="Your full name" className="mt-1.5" />{errors.name && <p className="mt-1 text-xs text-sale">{errors.name.message}</p>}</div>
        <div><label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Email</label><Input {...register("email")} type="email" placeholder="email@example.com" className="mt-1.5" />{errors.email && <p className="mt-1 text-xs text-sale">{errors.email.message}</p>}</div>
        <div><label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Phone</label><Input {...register("phone", { onChange: handlePhone })} type="tel" placeholder="+971 50 XXX XXXX" className="mt-1.5" />{errors.phone && <p className="mt-1 text-xs text-sale">{errors.phone.message}</p>}</div>
        <div className="flex items-end"><div className="flex h-11 w-full items-center gap-3 rounded-lg border border-dashed border-line bg-bg2/50 px-4 text-sm text-ink-3 sm:h-12"><User className="h-4 w-4" strokeWidth={1.5} />Avatar upload coming soon</div></div>
      </div>
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:pt-2">
        <Button type="submit" disabled={isSubmitting} className="h-11 text-sm sm:h-12 sm:text-base">{isSubmitting ? "Saving..." : "Save Changes"}</Button>
        {success && <span className="flex items-center gap-1.5 text-sm text-green"><CheckCircle className="h-4 w-4" strokeWidth={1.5} />Saved</span>}
      </div>
    </form>
  </div>;
}
