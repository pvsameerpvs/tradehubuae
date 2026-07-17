"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  Banknote,
  ChevronRight,
  ChevronLeft,
  Truck,
  ShoppingCart,
  Lock,
  Tag,
  X,
  Percent,
  Gift,
  Package,
  MapPin,
  Plus,
} from "lucide-react";
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

type PaymentMethod = "cod" | "card";
const STEPS = ["address", "payment", "confirm"] as const;
const CHECKOUT_KEY = "th_checkout";

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items, subtotal, shipping, activePromo, promoError,
    totalSavings, grandTotal, savingsBreakdown,
    clearCart, applyPromoCode, removePromoCode,
  } = useCart();
  const [step, setStep] = useState<(typeof STEPS)[number]>("address");
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<AddressData[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const restoredRef = useRef(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(CHECKOUT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step && STEPS.includes(parsed.step)) setStep(parsed.step);
        if (parsed.payment) setPayment(parsed.payment);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.cardNumber) setCardNumber(parsed.cardNumber);
        if (parsed.cardExpiry) setCardExpiry(parsed.cardExpiry);
        if (parsed.cardCvv) setCardCvv(parsed.cardCvv);
        if (parsed.selectedAddressId) setSelectedAddressId(parsed.selectedAddressId);
        restoredRef.current = true;
      }
    } catch {/* ignore parse errors */}

    if (!restoredRef.current && user) {
      if (user.name) setName(user.name);
    }

    getAddresses()
      .then((data) => {
        setSavedAddresses(data);
        if (!restoredRef.current) {
          const defaultAddr = data.find((a) => a.isDefault) || data[0];
          if (defaultAddr) selectAddress(defaultAddr);
        }
      })
      .catch(() => {/* ignore */})
      .finally(() => setAddressesLoading(false));
  }, [user]);

  useEffect(() => {
    const state = { step, payment, name, phone, address, cardNumber, cardExpiry, cardCvv, selectedAddressId };
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(state));
  }, [step, payment, name, phone, address, cardNumber, cardExpiry, cardCvv, selectedAddressId]);

  function selectAddress(addr: AddressData) {
    setSelectedAddressId(addr.id);
    setName(`${addr.firstName} ${addr.lastName}`);
    setPhone(addr.phone);
    const lines = [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", ");
    const cityLine = [addr.city, addr.emirate, addr.zipCode].filter(Boolean).join(", ");
    setAddress(`${lines}, ${cityLine}, ${addr.country}`);
  }

  function clearAddressSelection() {
    setSelectedAddressId(null);
    setName("");
    setPhone("");
    setAddress("");
  }

  const handlePlaceOrder = async () => {
    if (!payment || !name || !phone || !address || !agreed || items.length === 0) return;
    if (payment === "card" && (!cardNumber || !cardExpiry || !cardCvv)) return;

    const selectedAddr = selectedAddressId
      ? savedAddresses.find((a) => a.id === selectedAddressId)
      : null;

    try {
      const result = await createOrder({
        contactName: name,
        contactPhone: phone,
        paymentMethod: payment,
        shippingMethod: "standard",
        subtotal,
        shippingCost: shipping,
        taxAmount: 0,
        discountAmount: totalSavings,
        total: grandTotal,
        shippingAddressId: selectedAddr?.id ?? undefined,
        shippingAddress: selectedAddr
          ? {
              firstName: selectedAddr.firstName,
              lastName: selectedAddr.lastName,
              phone: selectedAddr.phone,
              addressLine1: selectedAddr.addressLine1,
              addressLine2: selectedAddr.addressLine2 ?? null,
              city: selectedAddr.city,
              emirate: selectedAddr.emirate,
              country: selectedAddr.country,
              zipCode: selectedAddr.zipCode ?? null,
            }
          : {
              firstName: name,
              lastName: "",
              phone,
              addressLine1: address,
              addressLine2: null,
              city: "",
              emirate: "",
              country: "UAE",
              zipCode: null,
            },
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          sku: item.slug,
          quantity: item.quantity,
          unitPrice: item.price,
          image: item.image,
        })),
      });
      setOrderNumber(result.orderNumber);
      sessionStorage.removeItem(CHECKOUT_KEY);
      setPlaced(true);
      clearCart();
    } catch {
      alert("Failed to place order. Please try again.");
      return;
    }
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="animate-scale-in">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
            <CheckCircle2 className="h-10 w-10 text-brand" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="animate-fade-in text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em", animationDelay: "0.1s", animationFillMode: "both" }}>
          Order Placed!
        </h1>
        <p className="animate-fade-in mt-2 text-sm text-ink-2" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>Your order is confirmed.</p>
        <p className="animate-fade-in mt-1 text-[22px] font-semibold text-ink" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>#{orderNumber}</p>
        <p className="animate-fade-in mt-6 text-sm text-ink-2" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
          {payment === "cod" ? "Pay when you receive your order." : "Payment successful."}
          {" We'll notify you once it ships."}
        </p>
        <div className="animate-fade-in mx-auto mt-10 max-w-xs space-y-3" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
          <button
            type="button"
            onClick={() => router.push("/account/orders")}
            className="btn-brand flex h-12 w-full items-center justify-center rounded-lg text-base font-semibold text-white"
          >
            View Orders
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-12 w-full items-center justify-center rounded-lg border border-ink bg-white text-base font-semibold text-ink transition-colors hover:bg-bg3"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-ink-3" strokeWidth={1} />
        <h2 className="mb-2 text-xl font-semibold text-ink">Your cart is empty</h2>
        <p className="mb-6 text-sm text-ink-2">Add some items before checking out.</p>
        <Link href="/" className="btn-brand mx-auto flex h-12 w-48 items-center justify-center rounded-lg text-base font-semibold text-white">Browse Products</Link>
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(step);
  const addressSectionComplete = name && phone && address;

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-8 pb-24 md:px-6 md:pb-8">
      <div className="mb-12">
        <div className="mx-auto flex max-w-md items-center justify-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-2.5">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                    i === currentIdx
                      ? "bg-ink text-white ring-4 ring-ink/10"
                      : i < currentIdx
                        ? "bg-brand text-white"
                        : "bg-bg2 text-ink-3"
                  }`}
                >
                  {i < currentIdx ? (
                    <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                    i === currentIdx
                      ? "text-ink"
                      : i < currentIdx
                        ? "text-brand"
                        : "text-ink-3"
                  }`}
                >
                  {s === "address"
                    ? "Delivery"
                    : s === "payment"
                      ? "Payment"
                      : "Confirm"}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-12 sm:w-20 ${
                    i < currentIdx ? "bg-brand" : "bg-line"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Address Step */}
          {step === "address" && (
            <div className="animate-fade-in">
              <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
                Delivery address
              </h2>
              <p className="mt-1 mb-6 text-sm text-ink-2">Where should we deliver your order?</p>

              {/* Saved Addresses */}
              {addressesLoading ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-28 animate-pulse rounded-xl bg-bg3" />
                  ))}
                </div>
              ) : savedAddresses.length > 0 && (
                <div className="mb-6">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Saved Addresses</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {savedAddresses.map((addr) => (
                      <AddressCard
                        key={addr.id}
                        address={addr}
                        selectable
                        selected={selectedAddressId === addr.id}
                        onSelect={selectAddress}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={clearAddressSelection}
                      className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line p-4 text-sm text-ink-2 transition-colors hover:border-ink/30 hover:text-ink"
                    >
                      <MapPin className="h-6 w-6" strokeWidth={1.5} />
                      Enter a new address
                    </button>
                  </div>
                </div>
              )}

              {/* Manual Address Form */}
              <div className="space-y-5">
                <div className={savedAddresses.length > 0 ? "border-t border-line pt-6" : ""}>
                  {savedAddresses.length > 0 && (
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">
                      {selectedAddressId ? "Delivery Contact" : "Enter Your Address"}
                    </p>
                  )}
                  <div className="space-y-5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Full Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)}
                        className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                        placeholder="Ahmed Al Maktoum" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Phone Number</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                        placeholder="+971 50 XXX XXXX" type="tel" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Delivery Address</label>
                      <input value={address} onChange={(e) => setAddress(e.target.value)}
                        className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                        placeholder="Street, building, apartment, city" />
                    </div>
                    {/* Save address option */}
                    {!selectedAddressId && (
                      <button
                        type="button"
                        onClick={() => setAddressFormOpen(true)}
                        className="flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-dark"
                      >
                        <Plus className="h-4 w-4" strokeWidth={2} />
                        Save this address for later
                      </button>
                    )}
                  </div>
                </div>
                <div className="hidden justify-end pt-2 md:flex">
                  <button
                    type="button"
                    onClick={() => setStep("payment")}
                    disabled={!addressSectionComplete}
                    className="btn-brand flex h-12 items-center justify-center gap-1.5 rounded-lg px-8 text-base font-semibold text-white transition-opacity disabled:opacity-40"
                  >
                    Continue <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div className="animate-fade-in">
              <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>Payment method</h2>
              <p className="mt-1 mb-8 text-sm text-ink-2">How would you like to pay?</p>
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <button type="button" onClick={() => setPayment("card")}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all ${
                      payment === "card" ? "border-brand bg-brand/5" : "border-line hover:border-ink/30"
                    }`}>
                    <CreditCard className="h-8 w-8 text-ink" strokeWidth={1.5} />
                    <div>
                      <p className="text-base font-semibold text-ink">Credit / Debit Card</p>
                      <p className="mt-0.5 text-sm text-ink-2">Pay securely with your card</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => setPayment("cod")}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all ${
                      payment === "cod" ? "border-brand bg-brand/5" : "border-line hover:border-ink/30"
                    }`}>
                    <Banknote className="h-8 w-8 text-ink" strokeWidth={1.5} />
                    <div>
                      <p className="text-base font-semibold text-ink">Cash on Delivery</p>
                      <p className="mt-0.5 text-sm text-ink-2">Pay when you receive your order</p>
                    </div>
                  </button>
                </div>
                {payment === "card" && (
                  <div className="rounded-xl border border-line p-5 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-ink">
                      <Lock className="h-4 w-4 text-brand" strokeWidth={1.75} /> Secure payment
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Card Number</label>
                      <input value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                        placeholder="1234 5678 9012 3456" inputMode="numeric" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Expiry</label>
                        <input value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                          placeholder="MM/YY" inputMode="numeric" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">CVV</label>
                        <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className="mt-1.5 flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                          placeholder="123" inputMode="numeric" type="password" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="hidden gap-3 pt-1 md:flex">
                  <button type="button" onClick={() => setStep("address")}
                    className="flex h-12 items-center gap-1.5 rounded-lg border border-ink bg-white px-6 text-base font-semibold text-ink transition-colors hover:bg-bg3">
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.75} /> Back
                  </button>
                  <button type="button" onClick={() => setStep("confirm")}
                    disabled={!payment || (payment === "card" && (!cardNumber || !cardExpiry || !cardCvv))}
                    className="btn-brand flex h-12 flex-1 items-center justify-center gap-1.5 rounded-lg text-base font-semibold text-white transition-opacity disabled:opacity-40">
                    Continue <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Step */}
          {step === "confirm" && (
            <div className="animate-fade-in">
              <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>Review your order</h2>
              <p className="mt-1 mb-8 text-sm text-ink-2">Please confirm everything looks right.</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-line p-4">
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-ink" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-ink">{name}</p>
                    <p className="text-sm text-ink-2">{phone}</p>
                    <p className="break-words text-sm text-ink-2">{address}</p>
                  </div>
                </div>
                {payment === "cod" ? (
                  <div className="flex items-center gap-3 rounded-xl border border-line p-4">
                    <Banknote className="h-5 w-5 flex-shrink-0 text-ink" strokeWidth={1.75} />
                    <span className="text-base font-semibold text-ink">Cash on Delivery</span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-line p-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 flex-shrink-0 text-ink" strokeWidth={1.75} />
                      <span className="text-base font-semibold text-ink">Credit / Debit Card</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-ink-2">
                      <Lock className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
                      Card ending in {cardNumber.replace(/\D/g, "").slice(-4) || "****"}
                    </div>
                  </div>
                )}
              </div>
              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-line text-ink focus-visible:outline-2 focus-visible:outline-ink/40" />
                <span className="text-sm text-ink-2">
                  I agree to the{" "}
                  <Link href="#" className="font-medium text-ink underline underline-offset-2">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="#" className="font-medium text-ink underline underline-offset-2">Privacy Policy</Link>
                </span>
              </label>
              <div className="mt-6 hidden gap-3 md:flex">
                <button type="button" onClick={() => setStep("payment")}
                  className="flex h-12 items-center gap-1.5 rounded-lg border border-ink bg-white px-6 text-base font-semibold text-ink transition-colors hover:bg-bg3">
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} /> Back
                </button>
                <button type="button" onClick={handlePlaceOrder} disabled={!agreed}
                  className="btn-brand flex h-12 flex-1 items-center justify-center gap-1.5 rounded-lg text-base font-semibold text-white transition-opacity disabled:opacity-40">
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-xl border border-line bg-white shadow-panel">
            <h2 className="px-5 pt-5 pb-0 text-lg font-semibold text-ink">Order Summary</h2>
            <div className="space-y-3 border-b border-line px-5 pb-4 pt-5">
              {items.map((item) => (
                <div key={item.slug} className="flex justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate text-ink-2">{item.name} &times; {item.quantity}</span>
                  <span className="shrink-0 font-medium text-ink">AED {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 px-5 pb-5 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-2">Subtotal</span>
                <span className="shrink-0 text-ink">AED {subtotal.toLocaleString()}</span>
              </div>
              {savingsBreakdown.map((s) => (
                <div key={s.label} className="flex justify-between gap-2 text-brand">
                  <span className="flex min-w-0 items-center gap-1.5">
                    {s.label === "Bulk discount" && <Package className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />}
                    {s.label.startsWith("Promo") && <Tag className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />}
                    {s.label === "Combo savings" && <Gift className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />}
                    <span className="truncate">{s.label}</span>
                  </span>
                  <span className="shrink-0">-AED {s.amount.toLocaleString()}</span>
                </div>
              ))}
              {totalSavings > 0 && (
                <div className="flex justify-between border-t border-line pt-2 text-xs text-ink-3">
                  <span>You save</span>
                  <span className="shrink-0 font-medium text-brand">AED {totalSavings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink-2">Shipping</span>
                <span className={shipping === 0 ? "shrink-0 font-medium text-brand" : "shrink-0 text-ink"}>
                  {shipping === 0 ? "Free" : `AED ${shipping}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
                <span className="text-ink">Total</span>
                <span className="shrink-0 text-ink">AED {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="border-t border-line px-5 pb-5 pt-5">
              <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Promo Code</label>
              {activePromo ? (
                <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-4 py-2.5">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <Percent className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
                    <span className="shrink-0 text-sm font-semibold text-brand">{activePromo.code}</span>
                    <span className="truncate text-xs text-ink-2">{activePromo.description}</span>
                  </div>
                  <button onClick={removePromoCode} className="shrink-0 text-ink-3 hover:text-sale transition-colors" aria-label="Remove promo code">
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <div className="mt-1.5 flex gap-2">
                  <input value={promoInput} onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => { if (e.key === "Enter" && promoInput.trim()) applyPromoCode(promoInput.trim()); }}
                    className="flex h-10 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2"
                    placeholder="Enter code" />
                  <button type="button" onClick={() => { if (promoInput.trim()) applyPromoCode(promoInput.trim()); }}
                    disabled={!promoInput.trim()}
                    className="flex h-10 shrink-0 items-center rounded-lg border border-ink bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-bg3 disabled:opacity-40">
                    Apply
                  </button>
                </div>
              )}
              {promoError && <p className="mt-1.5 text-xs text-sale">{promoError}</p>}
              {!activePromo && <p className="mt-2 text-xs text-ink-3">Try: SAVE10, WELCOME20, SAVE50, FLASHSALE, BULK5</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar — step buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
        <div className="flex gap-3">
          {step !== "address" && (
            <button
              type="button"
              onClick={() => setStep(STEPS[currentIdx - 1]!)}
              className="flex h-12 items-center gap-1.5 rounded-lg border border-ink bg-white px-6 text-base font-semibold text-ink transition-colors hover:bg-bg3"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} /> Back
            </button>
          )}
          {step === "address" && (
            <button
              type="button"
              onClick={() => setStep("payment")}
              disabled={!addressSectionComplete}
              className="btn-brand flex h-12 flex-1 items-center justify-center gap-1.5 rounded-lg text-base font-semibold text-white transition-opacity disabled:opacity-40"
            >
              Continue <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
          {step === "payment" && (
            <button
              type="button"
              onClick={() => setStep("confirm")}
              disabled={!payment || (payment === "card" && (!cardNumber || !cardExpiry || !cardCvv))}
              className="btn-brand flex h-12 flex-1 items-center justify-center gap-1.5 rounded-lg text-base font-semibold text-white transition-opacity disabled:opacity-40"
            >
              Continue <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
          {step === "confirm" && (
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!agreed}
              className="btn-brand flex h-12 flex-1 items-center justify-center gap-1.5 rounded-lg text-base font-semibold text-white transition-opacity disabled:opacity-40"
            >
              Place Order
            </button>
          )}
        </div>
      </div>

      {/* Address Form Dialog for saving new address */}
      <AddressForm
        open={addressFormOpen}
        onOpenChange={setAddressFormOpen}
        onSave={async (data) => {
          const created = await createAddress(data as CreateAddressInput);
          setSavedAddresses((prev) => [...prev, created]);
          selectAddress(created);
          setAddressFormOpen(false);
        }}
      />
    </div>
  );
}
