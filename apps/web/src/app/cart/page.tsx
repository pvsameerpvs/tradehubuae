import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@tradehubuae/ui";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and manage your shopping cart at TradeHub UAE",
};

const cartItems = [
  {
    id: 1,
    name: "Dell XPS 15 Laptop",
    price: 5499,
    quantity: 1,
    image: null,
    slug: "dell-xps-15",
  },
  {
    id: 2,
    name: "Logitech MX Master 3S",
    price: 349,
    quantity: 2,
    image: null,
    slug: "logitech-mx-master-3s",
  },
];

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="mb-4 h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/categories">
            <Button size="lg">Browse Categories</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b py-4 last:border-0">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">AED {item.price.toFixed(2)}</p>
                  </div>
                    <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-md border">
                      <button className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:bg-accent">-</button>
                      <span className="flex h-11 w-12 items-center justify-center text-sm font-medium">{item.quantity}</span>
                      <button className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:bg-accent">+</button>
                    </div>
                    <button className="text-sm text-muted-foreground hover:text-destructive">Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">AED {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>AED {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `AED ${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">Free shipping on orders over AED 500</p>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>AED {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="mt-6 w-full" size="lg">Proceed to Checkout</Button>
              </Link>
              <Link href="/categories">
                <Button variant="ghost" className="mt-2 w-full">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
