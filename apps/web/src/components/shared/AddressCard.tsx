"use client";

import { Pencil, Trash2, Star } from "lucide-react";
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
      className={`group relative rounded-xl border p-4 text-left transition-all ${
        selectable && selected
          ? "border-brand bg-brand/5 ring-1 ring-brand"
          : selectable
            ? "border-line cursor-pointer hover:border-ink/30 hover:shadow-sm"
            : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-ink">{fullName}</p>
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                <Star className="h-2.5 w-2.5" strokeWidth={2.5} />
                Default
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-2">{addressLines}</p>
          <p className="text-sm text-ink-2">{cityLine}</p>
          <p className="mt-1 text-sm text-ink-2">{address.country}</p>
          <p className="mt-1 text-sm text-ink-2">{address.phone}</p>
        </div>

        {selectable && selected && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand">
            <div className="h-2.5 w-2.5 rounded-full bg-white" />
          </div>
        )}
      </div>

      {!selectable && (onEdit || onDelete || onSetDefault) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          {!address.isDefault && onSetDefault && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(address.id);
              }}
              className="text-xs text-ink-2 hover:text-ink"
            >
              Set as Default
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
              className="text-xs"
            >
              <Pencil className="mr-1 h-3.5 w-3.5" />
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
              className="text-xs text-sale hover:text-sale"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
