"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from "@tradehubuae/ui";
import { UAE_EMIRATES } from "@tradehubuae/config";
import type { AddressData, CreateAddressInput, UpdateAddressInput } from "@/lib/actions/addresses";

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: AddressData | null;
  onSave: (data: CreateAddressInput | UpdateAddressInput) => Promise<void>;
}

export function AddressForm({ open, onOpenChange, address, onSave }: AddressFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [emirate, setEmirate] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (address) {
      setFirstName(address.firstName);
      setLastName(address.lastName);
      setPhone(address.phone);
      setAddressLine1(address.addressLine1);
      setAddressLine2(address.addressLine2 ?? "");
      setCity(address.city);
      setEmirate(address.emirate);
      setZipCode(address.zipCode ?? "");
      setIsDefault(address.isDefault);
    } else {
      setFirstName("");
      setLastName("");
      setPhone("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setEmirate("");
      setZipCode("");
      setIsDefault(false);
    }
  }, [address, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !addressLine1 || !city || !emirate) return;
    setSaving(true);
    try {
      await onSave({
        firstName,
        lastName,
        phone,
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        emirate,
        zipCode: zipCode || undefined,
        isDefault,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {address ? "Update your delivery address details." : "Enter your delivery address details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">First Name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ahmed" required className="mt-1.5" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Last Name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Al Maktoum" required className="mt-1.5" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Phone Number</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 50 XXX XXXX" type="tel" required className="mt-1.5" />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Address Line 1</label>
            <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Street, building, apartment" required className="mt-1.5" />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Address Line 2 (Optional)</label>
            <Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Landmark, additional info" className="mt-1.5" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dubai" required className="mt-1.5" />
            </div>
            <div className="sm:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Emirate</label>
              <select
                value={emirate}
                onChange={(e) => setEmirate(e.target.value)}
                required
                className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
              >
                <option value="">Select emirate</option>
                {UAE_EMIRATES.map((em) => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Zip Code (Optional)</label>
              <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="00000" className="mt-1.5" />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-5 w-5 rounded border-line text-ink focus-visible:outline-2 focus-visible:outline-ink/40"
            />
            <span className="text-sm text-ink-2">Set as default address</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : address ? "Update Address" : "Add Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
