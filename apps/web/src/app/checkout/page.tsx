"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShoppingCart, Banknote, Plus, AlertCircle } from "lucide-react";
import { UAE_EMIRATES } from "@tradehubuae/config";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/actions/orders";
import {
  getAddresses,
  createAddress,
  type AddressData,
  type CreateAddressInput,
} from "@/lib/actions/addresses";
import { useAuth } from "@/lib/supabase/provider";
import { AddressCard } from "@/components/shared/AddressCard";
import { AddressForm } from "@/components/shared/AddressForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, shipping, totalSavings, grandTotal, clearCart, activePromo } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [emirate, setEmirate] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [savedAddresses, setSavedAddresses] = useState<AddressData[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const restored = useRef(false);

  const valid = name && phone && street && city && emirate;

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("th_checkout");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.name) setName(p.name);
        if (p.phone) setPhone(p.phone);
        if (p.street) setStreet(p.street);
        if (p.apt) setApt(p.apt);
        if (p.city) setCity(p.city);
        if (p.emirate) setEmirate(p.emirate);
        if (p.saved) setSelectedAddressId(p.saved);
        restored.current = true;
      }
    } catch {}
    if (!restored.current && user?.name) setName(user.name);
    getAddresses()
      .then((data) => {
        setSavedAddresses(data);
        if (!restored.current) {
          const d = data.find((a) => a.isDefault) || data[0];
          if (d) selectAddress(d);
        }
      })
      .catch(() => {})
      .finally(() => setAddressesLoading(false));
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem("th_checkout", JSON.stringify({
      name, phone, street, apt, city, emirate, saved: selectedAddressId,
    }));
  });

  function selectAddress(addr: AddressData) {
    setSelectedAddressId(addr.id);
    setName(`${addr.firstName} ${addr.lastName}`);
    setPhone(addr.phone);
    setStreet(addr.addressLine1);
    setApt(addr.addressLine2 ?? "");
    setCity(addr.city);
    setEmirate(addr.emirate);
  }

  function clearAddress() {
    setSelectedAddressId(null);
    setName(user?.name ?? "");
    setPhone("");
    setStreet("");
    setApt("");
    setCity("");
    setEmirate("");
  }

  const placeOrder = async () => {
    if (!valid || !agreed || items.length === 0 || placing) return;
    setPlacing(true);
    setErrorMsg("");
    const sa = selectedAddressId ? savedAddresses.find((a) => a.id === selectedAddressId) : null;
    try {
      const r = await createOrder({
        contactName: name,
        contactPhone: phone,
        paymentMethod: "cod",
        shippingMethod: "standard",
        subtotal, shippingCost: shipping, taxAmount: 0,
        discountAmount: totalSavings, total: grandTotal,
        couponCode: activePromo?.code,
        shippingAddressId: sa?.id,
        shippingAddress: sa ? {
          firstName: sa.firstName, lastName: sa.lastName, phone: sa.phone,
          addressLine1: sa.addressLine1, addressLine2: sa.addressLine2 ?? null,
          city: sa.city, emirate: sa.emirate, country: sa.country, zipCode: sa.zipCode ?? null,
        } : {
          firstName: name, lastName: "", phone,
          addressLine1: street, addressLine2: apt || null,
          city, emirate, country: "UAE",
        },
        items: items.map((i) => ({
          productId: i.id, name: i.name, sku: i.slug,
          quantity: i.quantity, unitPrice: i.price, image: i.image,
        })),
      });
      setOrderNumber(r.orderNumber);
      sessionStorage.removeItem("th_checkout");
      setPlaced(true);
      clearCart();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to place order";
      setErrorMsg(msg);
    } finally { setPlacing(false); }
  };

  if (placed) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
          <ShoppingCart className="h-8 w-8 text-brand" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-semibold text-ink">Order Placed!</h1>
        <p className="mt-2 text-sm text-ink-2">Your order is confirmed.</p>
        <p className="mt-1 text-lg font-semibold text-ink">#{orderNumber}</p>
        <p className="mt-5 text-sm text-ink-2">Pay when you receive your order.</p>
        <div className="mt-8 w-full space-y-3">
          <button onClick={() => router.push("/account/orders")} className="flex h-12 w-full items-center justify-center rounded-lg bg-brand text-base font-semibold text-white hover:bg-brand-dark transition-colors">View Orders</button>
          <button onClick={() => router.push("/")} className="flex h-12 w-full items-center justify-center rounded-lg border border-ink text-base font-semibold text-ink hover:bg-bg3 transition-colors">Continue Shopping</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-6 py-16 text-center">
        <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-ink-3" strokeWidth={1} />
        <h2 className="mb-2 text-lg font-semibold text-ink">Cart empty</h2>
        <p className="mb-6 text-sm text-ink-2">Add items before checking out.</p>
        <Link href="/" className="flex h-12 w-48 items-center justify-center rounded-lg bg-brand text-base font-semibold text-white hover:bg-brand-dark transition-colors">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-[1120px] px-4 pb-36 pt-4 sm:px-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-2 hover:bg-bg3 transition-colors" aria-label="Back">
          <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <h1 className="text-lg font-semibold text-ink">Checkout</h1>
      </div>

      {/* Items summary (mobile only — above form) */}
      <div className="mb-5 rounded-xl border border-line bg-white lg:hidden">
        <div className="divide-y divide-line">
          {items.map((item) => (
            <div key={item.slug} className="flex items-center gap-3 px-4 py-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bg2">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-3">
                    <ShoppingCart className="h-5 w-5" strokeWidth={1} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink-2">Qty: {item.quantity} · AED {item.price.toFixed(2)} each</p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-ink tabular-nums">AED {(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-line px-4 py-3 space-y-1 text-sm">
          <div className="flex justify-between text-ink-2"><span>Subtotal</span><span className="tabular-nums">AED {subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-ink-2"><span>Shipping</span><span className={shipping === 0 ? "font-medium text-brand tabular-nums" : "tabular-nums"}>{shipping === 0 ? "Free" : `AED ${shipping.toFixed(2)}`}</span></div>
          {totalSavings > 0 && <div className="flex justify-between text-brand"><span>You save</span><span className="tabular-nums">-AED {totalSavings.toFixed(2)}</span></div>}
          <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-ink"><span>Total</span><span className="tabular-nums">AED {grandTotal.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — Delivery address */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-line bg-white px-4 py-5">
            <h2 className="text-base font-semibold text-ink">Delivery address</h2>
            <p className="mb-4 mt-0.5 text-sm text-ink-2">Where should we deliver your order?</p>

            {addressesLoading ? (
              <div className="h-16 animate-pulse rounded-xl bg-bg3" />
            ) : savedAddresses.length > 0 && (
              <div className="mb-4">
                <div className="space-y-2">
                  {savedAddresses.map((addr) => (
                    <AddressCard key={addr.id} address={addr} selectable selected={selectedAddressId === addr.id} onSelect={selectAddress} />
                  ))}
                </div>
                <button onClick={clearAddress} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line px-4 py-3 text-sm text-ink-2 hover:border-ink/30 hover:text-ink transition-colors">
                  <Plus className="h-5 w-5" strokeWidth={1.5} />
                  Enter new address
                </button>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink/30 focus:ring-2 focus:ring-ink/10" placeholder="Ahmed" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink/30 focus:ring-2 focus:ring-ink/10" placeholder="+971 50 XXX XXXX" type="tel" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Street Address</label>
                <input value={street} onChange={(e) => setStreet(e.target.value)} className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink/30 focus:ring-2 focus:ring-ink/10" placeholder="Building, street, area" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Apartment / Villa <span className="text-ink-3">(Optional)</span></label>
                <input value={apt} onChange={(e) => setApt(e.target.value)} className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink/30 focus:ring-2 focus:ring-ink/10" placeholder="Apartment, villa name" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-ink/30 focus:ring-2 focus:ring-ink/10" placeholder="Dubai" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Emirate</label>
                  <select value={emirate} onChange={(e) => setEmirate(e.target.value)} className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink outline-none transition-colors focus:border-ink/30 focus:ring-2 focus:ring-ink/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10">
                    <option value="">Select</option>
                    {UAE_EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              {!selectedAddressId && (
                <button onClick={() => setAddressFormOpen(true)} className="flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-dark transition-colors">
                  <Plus className="h-4 w-4" strokeWidth={2} />
                  Save address
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right — Items + Payment + Terms + CTA */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 lg:space-y-5">
            {/* Items (desktop only — shown on mobile above form) */}
            <div className="hidden rounded-xl border border-line bg-white lg:block">
              <div className="divide-y divide-line">
                {items.map((item) => (
                  <div key={item.slug} className="flex items-center gap-3 px-4 py-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-bg2">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink-3">
                          <ShoppingCart className="h-5 w-5" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                      <p className="text-xs text-ink-2">Qty: {item.quantity} · AED {item.price.toFixed(2)} each</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-ink tabular-nums">AED {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-line px-4 py-3 space-y-1 text-sm">
                <div className="flex justify-between text-ink-2"><span>Subtotal</span><span className="tabular-nums">AED {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-ink-2"><span>Shipping</span><span className={shipping === 0 ? "font-medium text-brand tabular-nums" : "tabular-nums"}>{shipping === 0 ? "Free" : `AED ${shipping.toFixed(2)}`}</span></div>
                {totalSavings > 0 && <div className="flex justify-between text-brand"><span>You save</span><span className="tabular-nums">-AED {totalSavings.toFixed(2)}</span></div>}
                <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-ink"><span>Total</span><span className="tabular-nums">AED {grandTotal.toFixed(2)}</span></div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-line bg-white px-4 py-4">
              <h3 className="mb-1 text-sm font-semibold text-ink">Payment</h3>
              <div className="flex items-center gap-3 rounded-lg bg-bg2 px-3.5 py-3">
                <Banknote className="h-5 w-5 shrink-0 text-ink" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-semibold text-ink">Cash on Delivery</p>
                  <p className="text-xs text-ink-2">Pay when you receive your order</p>
                </div>
              </div>
            </div>

            {/* Terms + CTA (desktop) */}
            <div className="hidden lg:block">
              <label className="mb-4 flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-ink outline-none focus:ring-2 focus:ring-ink/10" />
                <span className="text-sm text-ink-2 leading-relaxed">
                  I agree to the <Link href="#" className="font-medium text-ink underline underline-offset-2">Terms</Link> and <Link href="#" className="font-medium text-ink underline underline-offset-2">Privacy Policy</Link>
                </span>
              </label>
              {errorMsg && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span>{errorMsg}</span>
                </div>
              )}
              <button onClick={placeOrder} disabled={!valid || !agreed || placing} className="flex h-12 w-full items-center justify-center rounded-lg bg-brand text-base font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-40">
                {placing ? "Placing..." : `Place Order · AED ${grandTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms (mobile) */}
      <label className="mt-6 flex cursor-pointer items-start gap-3 lg:hidden">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-ink outline-none focus:ring-2 focus:ring-ink/10" />
        <span className="text-sm text-ink-2 leading-relaxed">
          I agree to the <Link href="#" className="font-medium text-ink underline underline-offset-2">Terms</Link> and <Link href="#" className="font-medium text-ink underline underline-offset-2">Privacy Policy</Link>
        </span>
      </label>

      {/* Fixed CTA (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] lg:hidden">
        {errorMsg && (
          <div className="mb-2 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span>{errorMsg}</span>
          </div>
        )}
        <button onClick={placeOrder} disabled={!valid || !agreed || placing} className="flex h-12 w-full items-center justify-center rounded-lg bg-brand text-base font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-40">
          {placing ? "Placing..." : `Place Order · AED ${grandTotal.toFixed(2)}`}
        </button>
      </div>

      <AddressForm open={addressFormOpen} onOpenChange={setAddressFormOpen} onSave={async (data) => {
        const c = await createAddress(data as CreateAddressInput);
        setSavedAddresses((prev) => [...prev, c]);
        selectAddress(c);
        setAddressFormOpen(false);
      }} />
    </div>
  );
}
