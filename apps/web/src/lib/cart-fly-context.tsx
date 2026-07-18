"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface FlyState {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  dx: number;
  dy: number;
  image: string | undefined;
}

interface CartFlyContextType {
  flyToCart: (element: HTMLElement, image?: string) => void;
}

const CartFlyContext = createContext<CartFlyContextType>({ flyToCart: () => {} });

export const useCartFly = () => useContext(CartFlyContext);

let nextId = 0;

function getCartPosition() {
  const el = document.querySelector('[aria-label="Shopping cart"]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export function CartFlyProvider({ children }: { children: ReactNode }) {
  const [flies, setFlies] = useState<FlyState[]>([]);

  const flyToCart = useCallback((element: HTMLElement, image?: string) => {
    const rect = element.getBoundingClientRect();
    const cart = getCartPosition();
    if (!cart) return;

    const id = nextId++;
    const x = rect.left;
    const y = rect.top;
    const w = rect.width;
    const h = rect.height;
    const dx = cart.x - (x + w / 2);
    const dy = cart.y - (y + h / 2);

    setFlies((prev) => [...prev, { id, x, y, w, h, dx, dy, image }]);
    setTimeout(() => {
      setFlies((prev) => prev.filter((f) => f.id !== id));
    }, 900);
  }, []);

  const overlay =
    flies.length > 0
      ? createPortal(
          <div className="pointer-events-none fixed inset-0 z-[9999]">
            {flies.map((fly) => (
              <div
                key={fly.id}
                className="absolute overflow-hidden rounded-xl bg-bg2 shadow-xl"
                style={{
                  left: fly.x,
                  top: fly.y,
                  width: fly.w,
                  height: fly.h,
                  animation: "flyToCart 850ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
                  ["--dx" as string]: `${fly.dx}px`,
                  ["--dy" as string]: `${fly.dy}px`,
                }}
              >
                {fly.image ? (
                  <img src={fly.image} alt="" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-bg2" />
                )}
              </div>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <CartFlyContext.Provider value={{ flyToCart }}>
      {children}
      {overlay}
    </CartFlyContext.Provider>
  );
}
