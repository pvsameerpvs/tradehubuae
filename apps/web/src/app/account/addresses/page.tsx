"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@tradehubuae/ui";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressData,
  type CreateAddressInput,
  type UpdateAddressInput,
} from "@/lib/actions/addresses";
import { AddressCard } from "@/components/shared/AddressCard";
import { AddressForm } from "@/components/shared/AddressForm";

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);

  useEffect(() => {
    getAddresses()
      .then(setAddresses)
      .catch(() => {/* ignore */})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveAddress = useCallback(async (data: CreateAddressInput | UpdateAddressInput) => {
    if (editingAddress) {
      const updated = await updateAddress(editingAddress.id, data);
      setAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? updated : a)));
    } else {
      const created = await createAddress(data as CreateAddressInput);
      setAddresses((prev) => [...prev, created]);
    }
    setEditingAddress(null);
  }, [editingAddress]);

  const handleDeleteAddress = useCallback(async (id: string) => {
    await deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleSetDefault = useCallback(async (id: string) => {
    await setDefaultAddress(id);
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const openEditAddress = useCallback((addr: AddressData) => {
    setEditingAddress(addr);
    setAddressFormOpen(true);
  }, []);

  const openAddAddress = useCallback(() => {
    setEditingAddress(null);
    setAddressFormOpen(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink sm:text-base">Saved Addresses</h2>
          <p className="mt-0.5 text-sm text-ink-2">{addresses.length} address(es) on file</p>
        </div>
        <Button size="sm" className="h-9 text-xs sm:h-10 sm:text-sm" onClick={openAddAddress}>
          <Plus className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add New
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-bg3 sm:h-32" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-white px-6 py-14 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2">
            <MapPin className="h-7 w-7 text-ink-3" strokeWidth={1} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink sm:text-base">No addresses saved</p>
            <p className="mt-1 text-xs text-ink-2 sm:text-sm">Add an address for faster checkout</p>
          </div>
          <Button onClick={openAddAddress}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={openEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <AddressForm
        open={addressFormOpen}
        onOpenChange={(open) => {
          setAddressFormOpen(open);
          if (!open) setEditingAddress(null);
        }}
        address={editingAddress}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
