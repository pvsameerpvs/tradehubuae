"use server";

import { api, ApiError } from "@/lib/api";

export interface OrderItemData {
  name: string;
  qty: number;
  price: number;
  image?: string;
  sku?: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  contactName: string | null;
  contactPhone: string | null;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  paymentMethod: string | null;
  shippingMethod: string | null;
  trackingNumber: string | null;
  estimatedDeliveryDate: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    image: string | null;
  }>;
  user?: {
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  shippingAddress?: {
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    emirate: string | null;
    country: string | null;
  } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function createOrder(data: {
  contactName: string;
  contactPhone: string;
  paymentMethod: string;
  shippingMethod: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  items: Array<{
    productId?: string;
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    image?: string;
  }>;
}) {
  return api.post<OrderData>("/orders", data);
}

export async function getMyOrders(): Promise<PaginatedResponse<OrderData>> {
  return api.get<PaginatedResponse<OrderData>>("/orders/my-orders");
}

export async function trackOrder(orderNumber: string): Promise<OrderData> {
  return api.get<OrderData>(`/orders/track/${encodeURIComponent(orderNumber)}`);
}

export async function getOrderById(id: string): Promise<OrderData> {
  return api.get<OrderData>(`/orders/${id}`);
}

export async function getAllOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<PaginatedResponse<OrderData>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.status) searchParams.set("status", params.status);
  if (params?.search) searchParams.set("search", params.search);
  const qs = searchParams.toString();
  return api.get<PaginatedResponse<OrderData>>(`/orders${qs ? `?${qs}` : ""}`);
}

export async function updateOrderStatus(id: string, status: string): Promise<OrderData> {
  return api.put<OrderData>(`/orders/${id}/status`, { status });
}

export { ApiError };
