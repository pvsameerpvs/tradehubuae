"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Gamepad2,
  Monitor,
  Keyboard,
  Laptop,
  Wifi,
  ShoppingBag,
  Percent,
  Gift,
  type LucideIcon,
} from "lucide-react";
import { fetchOffers, type Offer } from "@/data/offers";

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  gamepad: Gamepad2,
  monitor: Monitor,
  keyboard: Keyboard,
  laptop: Laptop,
  wifi: Wifi,
};

const typeIcons: Record<string, LucideIcon> = {
  bundle: ShoppingBag,
  percentage: Percent,
  bogo: Gift,
};

function OfferCard({ offer }: { offer: Offer }) {
  const Icon = iconMap[offer.coverIcon] ?? ShoppingBag;

  return (
    <Link
      href={offer.href}
      className={`group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br ${offer.coverGradient} transition-shadow duration-200 hover:shadow-card`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <div className="absolute right-4 top-4 flex items-center gap-2">
        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink shadow-chip backdrop-blur-sm">
          {offer.badge}
        </span>
      </div>

      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 opacity-30 transition-transform duration-200 group-hover:scale-110">
        <Icon className="h-20 w-20 text-white" strokeWidth={1} />
      </div>

      <div className="relative z-10 space-y-3 p-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <TypeIcon type={offer.type} />
        </span>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-tight text-white">
            {offer.title}
          </h3>
          <p className="text-sm leading-snug text-white/80">
            {offer.description}
          </p>
        </div>

        <p className="text-xs font-medium text-white/70">{offer.details}</p>

        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30">
          {offer.cta}
        </span>
      </div>
    </Link>
  );
}

function TypeIcon({ type }: { type: Offer["type"] }) {
  const TypeIconComponent = typeIcons[type] ?? ShoppingBag;
  return <TypeIconComponent className="h-4 w-4 text-white" strokeWidth={2} />;
}

export function OfferSection() {
  const [offerList, setOfferList] = useState<Offer[]>([]);

  useEffect(() => {
    fetchOffers().then(setOfferList);
  }, []);

  if (offerList.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          Special offers
        </h2>
        <Link
          href="/combo-offers"
          className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-2"
        >
          View all offers
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offerList.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
