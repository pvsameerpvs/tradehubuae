export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  slug: string;
}

export const cartItems: CartItem[] = [
  { id: 1, name: "Dell XPS 15 Laptop", price: 5499, quantity: 1, image: null, slug: "dell-xps-15" },
  { id: 2, name: "Logitech MX Master 3S", price: 349, quantity: 2, image: null, slug: "logitech-mx-master-3s" },
];

export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_FEE = 25;
