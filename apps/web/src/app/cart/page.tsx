import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@tradehubuae/ui";
import { ShoppingCart, ImageIcon, Plus, Minus, Trash2 } from "@/components/icons";
import { cartItems as data, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/data";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and manage your shopping cart at TradeHub UAE",
};

function CartItemRow({ item }: { item: (typeof data)[number] }) {
  return (
    <div className="flex gap-4 border-b py-4 last:border-0">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-muted">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-muted-foreground" strokeWidth={1} />
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
            <button className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:bg-accent">
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex h-11 w-12 items-center justify-center text-sm font-medium">{item.quantity}</span>
            <button className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:bg-accent">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">AED {(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default function CartPage() {
  const subtotal = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" strokeWidth={1} />
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/categories">
            <Button size="lg">Browse Categories</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {data.map((item) => (
              <CartItemRow key={item.id} item={item} />
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
                  <p className="text-xs text-muted-foreground">Free shipping on orders over AED {FREE_SHIPPING_THRESHOLD}</p>
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
