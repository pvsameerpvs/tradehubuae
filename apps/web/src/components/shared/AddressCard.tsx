"use client";

import { Pencil, Trash2, Star, MapPin, Phone } from "lucide-react";
import { Button } from "@tradehubuae/ui";
import type { AddressData } from "@/lib/actions/addresses";

interface AddressCardProps {
  address: AddressData;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (address: AddressData) => void;
  onEdit?: (address: AddressData) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

export function AddressCard({
  address,
  selected,
  selectable,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const fullName = `${address.firstName} ${address.lastName}`;
  const addressLines = [address.addressLine1, address.addressLine2].filter(Boolean).join(", ");
  const cityLine = [address.city, address.emirate, address.zipCode].filter(Boolean).join(", ");

  const handleClick = () => {
    if (selectable && onSelect) onSelect(address);
  };

  return (
    <div
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (selectable && onSelect && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(address);
        }
      }}
      className={`group relative overflow-hidden rounded-xl border bg-white p-5 text-left transition-all ${
        selectable && selected
          ? "border-brand/40 bg-brand/[0.03] ring-1 ring-brand/20"
          : selectable
            ? "border-line cursor-pointer hover:border-ink/20 hover:shadow-sm"
            : "border-line hover:shadow-sm"
      }`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-brand/[0.02]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                <MapPin className="h-4 w-4 text-brand" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{fullName}</p>
                {address.isDefault && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                    <Star className="h-2.5 w-2.5" strokeWidth={2.5} />
                    Default
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-ink-2">{addressLines}</p>
              <p className="text-sm text-ink-2">{cityLine}</p>
              <p className="text-sm text-ink-2">{address.country}</p>
              <div className="flex items-center gap-1.5 text-sm text-ink-2">
                <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                {address.phone}
              </div>
            </div>
          </div>

          {selectable && selected && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand shadow-sm">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          )}
        </div>

        {!selectable && (onEdit || onDelete || onSetDefault) && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
            {!address.isDefault && onSetDefault && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetDefault(address.id);
                }}
                className="h-8 rounded-lg px-3 text-xs font-medium text-ink-2 hover:bg-brand/5 hover:text-brand"
              >
                <Star className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
                Set Default
              </Button>
            )}
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(address);
                }}
                className="h-8 rounded-lg px-3 text-xs font-medium text-ink-2 hover:bg-brand/5 hover:text-brand"
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(address.id);
                }}
                className="h-8 rounded-lg px-3 text-xs font-medium text-ink-2 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
