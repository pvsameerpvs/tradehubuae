"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  AlertCircle,
  Home,
  Trash2,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@tradehubuae/ui";
import { useAuth } from "@/lib/supabase/provider";
import { createClient } from "@/lib/supabase/client";
import { AddressCard } from "@/components/shared/AddressCard";
import { AddressForm } from "@/components/shared/AddressForm";

function toCamel(a: any) {
  return {
    id: a.id,
    firstName: a.first_name,
    lastName: a.last_name,
    phone: a.phone,
    addressLine1: a.address_line1,
    addressLine2: a.address_line2,
    city: a.city,
    emirate: a.emirate,
    country: a.country,
    zipCode: a.zip_code,
    isDefault: a.is_default,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  };
}

function toSnake(d: any) {
  return {
    first_name: d.firstName,
    last_name: d.lastName,
    phone: d.phone,
    address_line1: d.addressLine1,
    address_line2: d.addressLine2 || null,
    city: d.city,
    emirate: d.emirate,
    country: d.country || "UAE",
    zip_code: d.zipCode || null,
    is_default: d.isDefault || false,
  };
}

export default function AccountAddresses() {
  const { user } = useAuth();
  const sb = createClient();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await sb
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    else setAddresses((data || []).map(toCamel));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSave = useCallback(
    async (data: any) => {
      if (!user) return;
      if (editingAddress) {
        const { error: err } = await sb
          .from("addresses")
          .update(toSnake(data))
          .eq("id", editingAddress.id);
        if (err) {
          setError(err.message);
          return;
        }
      } else {
        const { data: inserted, error: err } = await sb
          .from("addresses")
          .insert({ ...toSnake(data), user_id: user.id })
          .select()
          .single();
        if (err) {
          setError(err.message);
          return;
        }
        if (inserted) setAddresses((prev) => [...prev, toCamel(inserted)]);
      }
      setEditingAddress(null);
      fetchAddresses();
    },
    [editingAddress, user],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: err } = await sb
      .from("addresses")
      .delete()
      .eq("id", deleteTarget.id);
    if (err) setError(err.message);
    else {
      setDeleteTarget(null);
      fetchAddresses();
    }
    setDeleting(false);
  }, [deleteTarget]);

  const handleSetDefault = useCallback(
    async (id: string) => {
      await sb
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user?.id);
      const { error: err } = await sb
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id);
      if (err) setError(err.message);
      else fetchAddresses();
    },
    [user],
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
            <Home className="h-4 w-4 text-brand" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink sm:text-base">
              Saved Addresses
            </h2>
            <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">
              {addresses.length} address(es) on file
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="h-10 gap-1.5 rounded-xl text-xs shadow-sm sm:h-10 sm:text-sm"
          onClick={() => {
            setEditingAddress(null);
            setAddressFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add New
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          <span className="flex-1">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 rounded-lg text-xs text-red-600 hover:bg-red-100"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-line/60 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-bg2" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded-lg bg-bg2" />
                    <div className="h-3 w-36 rounded-lg bg-bg2" />
                  </div>
                </div>
                <div className="h-5 w-14 rounded-lg bg-bg2" />
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="h-3 w-full rounded bg-bg2" />
                <div className="h-3 w-3/4 rounded bg-bg2" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-8 w-16 rounded-lg bg-bg2" />
                <div className="h-8 w-16 rounded-lg bg-bg2" />
              </div>
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-line/60 bg-white px-6 py-14 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg2">
            <MapPin className="h-8 w-8 text-ink-3" strokeWidth={1} />
          </div>
          <div>
            <p className="text-sm font-medium text-ink sm:text-base">
              No addresses saved
            </p>
            <p className="mt-1 text-xs text-ink-2 sm:text-sm">
              Add a delivery address for faster checkout
            </p>
          </div>
          <Button
            className="gap-1.5 rounded-xl"
            onClick={() => {
              setEditingAddress(null);
              setAddressFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Address
          </Button>
        </div>
      ) : (
        /* Address Grid */
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={(a) => {
                setEditingAddress(a);
                setAddressFormOpen(true);
              }}
              onDelete={(id) => {
                const a = addresses.find((x) => x.id === id);
                if (a) setDeleteTarget(a);
              }}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {/* Address Form Dialog */}
      <AddressForm
        open={addressFormOpen}
        onOpenChange={(open) => {
          setAddressFormOpen(open);
          if (!open) setEditingAddress(null);
        }}
        address={editingAddress}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="flex items-start gap-3 rounded-xl border border-line/60 bg-bg2/50 px-4 py-3 text-sm text-ink-2">
              <Trash2 className="mt-0.5 h-4 w-4 shrink-0 text-red-400" strokeWidth={1.5} />
              <span>
                {deleteTarget.firstName} {deleteTarget.lastName} &mdash;{" "}
                {deleteTarget.addressLine1}, {deleteTarget.city}
              </span>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
