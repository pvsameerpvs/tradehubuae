import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOrder, getMyOrders, trackOrder, getOrderById, getAllOrders, updateOrderStatus } from "../orders";
import type { OrderData, PaginatedResponse } from "../orders";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  api: mockApi,
  ApiError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ApiError";
    }
  },
}));

function createMockOrder(overrides: Partial<OrderData> = {}): OrderData {
  return {
    id: "order-1",
    orderNumber: "TH-TEST-1234",
    status: "PENDING",
    contactName: "John Doe",
    contactPhone: "+971 50 123 4567",
    subtotal: 100,
    shippingCost: 10,
    taxAmount: 5,
    discountAmount: 0,
    total: 115,
    currency: "AED",
    paymentMethod: "card",
    shippingMethod: "standard",
    trackingNumber: null,
    estimatedDeliveryDate: "2026-07-20",
    shippedAt: null,
    deliveredAt: null,
    notes: null,
    createdAt: "2026-07-15T10:00:00Z",
    updatedAt: "2026-07-15T10:00:00Z",
    items: [
      { id: "item-1", name: "Test Product", sku: "TST-001", quantity: 2, unitPrice: "50", totalPrice: "100", image: null },
    ],
    user: null,
    shippingAddress: null,
    ...overrides,
  };
}

describe("createOrder", () => {
  const orderInput = {
    contactName: "John Doe",
    contactPhone: "+971 50 123 4567",
    paymentMethod: "card",
    shippingMethod: "standard",
    subtotal: 100,
    shippingCost: 10,
    taxAmount: 5,
    discountAmount: 0,
    total: 115,
    items: [{ name: "Test Product", sku: "TST-001", quantity: 2, unitPrice: 50 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends POST request to /orders with correct data", async () => {
    const mockResponse = createMockOrder();
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await createOrder(orderInput);

    expect(mockApi.post).toHaveBeenCalledWith("/orders", orderInput);
    expect(result).toEqual(mockResponse);
  });

  it("throws ApiError when API call fails", async () => {
    const error = new Error("Failed to create order");
    mockApi.post.mockRejectedValue(error);

    await expect(createOrder(orderInput)).rejects.toThrow("Failed to create order");
  });
});

describe("getMyOrders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches user orders from /orders/my-orders", async () => {
    const mockResponse: PaginatedResponse<OrderData> = {
      data: [createMockOrder()],
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
    };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await getMyOrders();

    expect(mockApi.get).toHaveBeenCalledWith("/orders/my-orders");
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it("returns empty data when user has no orders", async () => {
    const mockResponse: PaginatedResponse<OrderData> = {
      data: [],
      meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await getMyOrders();

    expect(result.data).toHaveLength(0);
  });
});

describe("trackOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches order by order number from /orders/track/:number", async () => {
    const mockOrder = createMockOrder({ orderNumber: "TH-TEST-5678" });
    mockApi.get.mockResolvedValue(mockOrder);

    const result = await trackOrder("TH-TEST-5678");

    expect(mockApi.get).toHaveBeenCalledWith("/orders/track/TH-TEST-5678");
    expect(result.orderNumber).toBe("TH-TEST-5678");
  });

  it("encodes the order number in the URL", async () => {
    const mockOrder = createMockOrder();
    mockApi.get.mockResolvedValue(mockOrder);

    await trackOrder("TH-123/ABC");

    expect(mockApi.get).toHaveBeenCalledWith("/orders/track/TH-123%2FABC");
  });

  it("throws when order is not found", async () => {
    const error = new Error("Order not found");
    mockApi.get.mockRejectedValue(error);

    await expect(trackOrder("INVALID")).rejects.toThrow("Order not found");
  });
});

describe("getOrderById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches single order by ID", async () => {
    const mockOrder = createMockOrder({ id: "order-42" });
    mockApi.get.mockResolvedValue(mockOrder);

    const result = await getOrderById("order-42");

    expect(mockApi.get).toHaveBeenCalledWith("/orders/order-42");
    expect(result.id).toBe("order-42");
  });
});

describe("getAllOrders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches all orders with default pagination", async () => {
    const mockResponse: PaginatedResponse<OrderData> = {
      data: [createMockOrder()],
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
    };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await getAllOrders();

    expect(mockApi.get).toHaveBeenCalledWith("/orders");
    expect(result.data).toHaveLength(1);
  });

  it("passes query params for pagination", async () => {
    mockApi.get.mockResolvedValue({ data: [], meta: { total: 0, page: 2, limit: 10, totalPages: 0 } });

    await getAllOrders({ page: 2, limit: 10 });

    expect(mockApi.get).toHaveBeenCalledWith("/orders?page=2&limit=10");
  });

  it("passes status filter", async () => {
    mockApi.get.mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    await getAllOrders({ status: "SHIPPED" });

    expect(mockApi.get).toHaveBeenCalledWith("/orders?status=SHIPPED");
  });

  it("passes search query", async () => {
    mockApi.get.mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } });

    await getAllOrders({ search: "John" });

    expect(mockApi.get).toHaveBeenCalledWith("/orders?search=John");
  });

  it("combines multiple filters", async () => {
    mockApi.get.mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });

    await getAllOrders({ page: 1, limit: 10, status: "PENDING", search: "test" });

    expect(mockApi.get).toHaveBeenCalledWith("/orders?page=1&limit=10&status=PENDING&search=test");
  });
});

describe("updateOrderStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends PUT request to /orders/:id/status with new status", async () => {
    const mockUpdated = createMockOrder({ status: "CONFIRMED" });
    mockApi.put.mockResolvedValue(mockUpdated);

    const result = await updateOrderStatus("order-1", "CONFIRMED");

    expect(mockApi.put).toHaveBeenCalledWith("/orders/order-1/status", { status: "CONFIRMED" });
    expect(result.status).toBe("CONFIRMED");
  });

  it("transitions through all valid statuses successfully", async () => {
    const transitions = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

    for (const status of transitions) {
      const mockOrder = createMockOrder({ id: `order-${status}`, status });
      mockApi.put.mockResolvedValue(mockOrder);

      const result = await updateOrderStatus(`order-${status}`, status);
      expect(result.status).toBe(status);
    }
  });

  it("allows cancellation at any stage", async () => {
    const stages = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"];

    for (const currentStatus of stages) {
      const mockOrder = createMockOrder({ id: `order-${currentStatus}`, status: "CANCELLED" });
      mockApi.put.mockResolvedValue(mockOrder);

      const result = await updateOrderStatus(`order-${currentStatus}`, "CANCELLED");
      expect(result.status).toBe("CANCELLED");
    }
  });

  it("throws when status update fails", async () => {
    const error = new Error("Order not found");
    mockApi.put.mockRejectedValue(error);

    await expect(updateOrderStatus("invalid-id", "CONFIRMED")).rejects.toThrow("Order not found");
  });
});
