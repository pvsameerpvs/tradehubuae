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

export const orders: Order[] = [];
