export interface OrderItem {
  name: string;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
  total: number;
  items: OrderItem[];
}

export const orders: Order[] = [
  { id: "ORD-001", date: "2026-07-10", status: "Delivered", total: 5499, items: [{ name: "Dell XPS 15", qty: 1 }] },
  { id: "ORD-002", date: "2026-07-05", status: "Shipped", total: 698, items: [{ name: "Logitech MX Master 3S", qty: 2 }] },
  { id: "ORD-003", date: "2026-06-28", status: "Processing", total: 1299, items: [{ name: 'Samsung 27" Monitor', qty: 1 }] },
  { id: "ORD-004", date: "2026-06-15", status: "Cancelled", total: 3299, items: [{ name: "HP Pavilion Desktop", qty: 1 }] },
  { id: "ORD-005", date: "2026-06-10", status: "Delivered", total: 8498, items: [{ name: "MacBook Pro 16", qty: 1 }, { name: "USB-C Hub", qty: 1 }] },
];

export const orderStatusColor: Record<Order["status"], "success" | "default" | "warning" | "destructive"> = {
  Delivered: "success",
  Shipped: "default",
  Processing: "warning",
  Cancelled: "destructive",
};
