"use client";

import { useEffect, useCallback } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from "@tradehubuae/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@tradehubuae/validation";
import { UAE_EMIRATES } from "@tradehubuae/config";
import type { AddressData } from "@/lib/actions/addresses";

const formSchema = addressSchema.extend({
  isDefault: z.boolean().optional(),
});

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: AddressData | null;
  onSave: (data: AddressInput & { isDefault?: boolean }) => Promise<void>;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("971") && digits.length >= 11) {
    return `+971 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 12)}`;
  }
  if (digits.startsWith("05") && digits.length === 11) {
    return `+971 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  }
  if (digits.startsWith("5") && digits.length === 9) {
    return `+971 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
  }
  return value;
}

export function AddressForm({ open, onOpenChange, address, onSave }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput & { isDefault: boolean }>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      emirate: "" as any,
      country: "UAE",
      zipCode: "",
      isDefault: false,
    },
  });

  const emirateValue = watch("emirate");

  useEffect(() => {
    if (address) {
      reset({
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 ?? "",
        city: address.city,
        emirate: address.emirate as any,
        country: address.country,
        zipCode: address.zipCode ?? "",
        isDefault: address.isDefault,
      });
    } else {
      reset({ country: "UAE", isDefault: false });
    }
  }, [address, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    await onSave(data);
  });

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, "");
      if (digits.length >= 12) return;
      setValue("phone", formatPhone(raw), { shouldValidate: true });
    },
    [setValue],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {address ? "Update your delivery address details." : "Enter your delivery address details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">First Name</label>
              <Input {...register("firstName")} placeholder="Ahmed" className="mt-1.5" />
              {errors.firstName && <p className="mt-1 text-xs text-sale">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Last Name</label>
              <Input {...register("lastName")} placeholder="Al Maktoum" className="mt-1.5" />
              {errors.lastName && <p className="mt-1 text-xs text-sale">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Phone Number</label>
            <Input
              {...register("phone", { onChange: handlePhoneChange })}
              placeholder="+971 50 XXX XXXX"
              type="tel"
              className="mt-1.5"
            />
            {errors.phone && <p className="mt-1 text-xs text-sale">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Address Line 1</label>
            <Input {...register("addressLine1")} placeholder="Street, building, apartment" className="mt-1.5" />
            {errors.addressLine1 && <p className="mt-1 text-xs text-sale">{errors.addressLine1.message}</p>}
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Address Line 2 (Optional)</label>
            <Input {...register("addressLine2")} placeholder="Apartment, suite, landmark" className="mt-1.5" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">City</label>
              <Input {...register("city")} placeholder="Dubai" className="mt-1.5" />
              {errors.city && <p className="mt-1 text-xs text-sale">{errors.city.message}</p>}
            </div>
            <div className="sm:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Emirate</label>
              <select
                {...register("emirate")}
                value={emirateValue}
                className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
              >
                <option value="">Select emirate</option>
                {UAE_EMIRATES.map((em) => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </select>
              {errors.emirate && <p className="mt-1 text-xs text-sale">{errors.emirate.message}</p>}
            </div>
            <div className="sm:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Zip Code (Optional)</label>
              <Input {...register("zipCode")} placeholder="00000" className="mt-1.5" />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              {...register("isDefault")}
              className="h-5 w-5 rounded border-line text-ink focus-visible:outline-2 focus-visible:outline-ink/40"
            />
            <span className="text-sm text-ink-2">Set as default address</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : address ? "Update Address" : "Add Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
