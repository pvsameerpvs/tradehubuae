import { ORDER_STATUS } from "@tradehubuae/config";

export interface OrderItem {
  name: string;
  qty: number;
  price?: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  contactName: string | null;
  contactPhone: string | null;
  total: number;
  subtotal: number;
  shippingCost: number;
  items: OrderItem[];
  paymentMethod: string | null;
  shippingMethod: string | null;
  estimatedDeliveryDate: string | null;
  trackingNumber: string | null;
  createdAt: string;
}

const BACKEND_STATUS_MAP: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
  REFUNDED: "Refunded",
};

export function formatStatus(status: string): string {
  return BACKEND_STATUS_MAP[status] || status;
}

export const orderStatusColor: Record<string, "success" | "default" | "warning" | "destructive" | "secondary"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "warning",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
  RETURNED: "destructive",
  REFUNDED: "secondary",
  Delivered: "success",
  Shipped: "default",
  Processing: "warning",
  Pending: "warning",
  Confirmed: "default",
  Cancelled: "destructive",
};

export const ORDER_STATUS_FLOW = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
] as const;

export const ORDER_TERMINAL_STATUSES = [
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.RETURNED,
  ORDER_STATUS.REFUNDED,
] as const;

export const orders: Order[] = [
  {
    id: "1",
    orderNumber: "TH-KX3A1-4B9F",
    date: "2026-07-10",
    status: "DELIVERED",
    contactName: "Ahmed Al Maktoum",
    contactPhone: "+971 50 123 4567",
    total: 5499,
    subtotal: 5499,
    shippingCost: 0,
    items: [{ name: "Dell XPS 15", qty: 1, price: 5499 }],
    paymentMethod: "card",
    shippingMethod: "standard",
    estimatedDeliveryDate: "2026-07-15",
    trackingNumber: "TRK-001",
    createdAt: "2026-07-10T10:00:00Z",
  },
  {
    id: "2",
    orderNumber: "TH-KX3A2-5C8D",
    date: "2026-07-05",
    status: "SHIPPED",
    contactName: "Ahmed Al Maktoum",
    contactPhone: "+971 50 123 4567",
    total: 698,
    subtotal: 698,
    shippingCost: 0,
    items: [{ name: "Logitech MX Master 3S", qty: 2, price: 349 }],
    paymentMethod: "cod",
    shippingMethod: "express",
    estimatedDeliveryDate: "2026-07-07",
    trackingNumber: "TRK-002",
    createdAt: "2026-07-05T14:30:00Z",
  },
  {
    id: "3",
    orderNumber: "TH-KX3A3-7D2E",
    date: "2026-06-28",
    status: "PROCESSING",
    contactName: "Ahmed Al Maktoum",
    contactPhone: "+971 50 123 4567",
    total: 1299,
    subtotal: 1299,
    shippingCost: 25,
    items: [{ name: 'Samsung 27" Monitor', qty: 1, price: 1299 }],
    paymentMethod: "card",
    shippingMethod: "standard",
    estimatedDeliveryDate: "2026-07-03",
    trackingNumber: null,
    createdAt: "2026-06-28T09:15:00Z",
  },
  {
    id: "4",
    orderNumber: "TH-KX3A4-9E1F",
    date: "2026-06-15",
    status: "CANCELLED",
    contactName: "Ahmed Al Maktoum",
    contactPhone: "+971 50 123 4567",
    total: 3299,
    subtotal: 3299,
    shippingCost: 0,
    items: [{ name: "HP Pavilion Desktop", qty: 1, price: 3299 }],
    paymentMethod: "card",
    shippingMethod: "standard",
    estimatedDeliveryDate: null,
    trackingNumber: null,
    createdAt: "2026-06-15T11:00:00Z",
  },
  {
    id: "5",
    orderNumber: "TH-KX3A5-0F2G",
    date: "2026-06-10",
    status: "DELIVERED",
    contactName: "Ahmed Al Maktoum",
    contactPhone: "+971 50 123 4567",
    total: 8498,
    subtotal: 8498,
    shippingCost: 0,
    items: [
      { name: "MacBook Pro 16", qty: 1, price: 7999 },
      { name: "USB-C Hub", qty: 1, price: 499 },
    ],
    paymentMethod: "card",
    shippingMethod: "express",
    estimatedDeliveryDate: "2026-06-12",
    trackingNumber: "TRK-003",
    createdAt: "2026-06-10T08:00:00Z",
  },
];
