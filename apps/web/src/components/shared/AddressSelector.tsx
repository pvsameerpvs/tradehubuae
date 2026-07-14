"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@tradehubuae/ui";
import { AddressCard } from "@/components/shared/AddressCard";
import { AddressForm } from "@/components/shared/AddressForm";
import type { AddressData, CreateAddressInput, UpdateAddressInput } from "@/lib/actions/addresses";

interface AddressSelectorProps {
  addresses: AddressData[];
  selectedId?: string;
  onSelect: (address: AddressData) => void;
  onSave: (data: CreateAddressInput | UpdateAddressInput) => Promise<void>;
}

export function AddressSelector({ addresses, selectedId, onSelect, onSave }: AddressSelectorProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      {addresses.length > 0 && (
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Saved Addresses</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                selectable
                selected={selectedId === addr.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setShowForm(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        {addresses.length > 0 ? "Deliver to a Different Address" : "Add a Delivery Address"}
      </Button>

      <AddressForm
        open={showForm}
        onOpenChange={setShowForm}
        onSave={async (data) => {
          await onSave(data);
          setShowForm(false);
        }}
      />
    </div>
  );
}
