import { Test, TestingModule } from "@nestjs/testing";
import { OrdersService } from "./orders.service";
import { DrizzleService } from "../../database/drizzle.service";
import { NotFoundException } from "@nestjs/common";

describe("OrdersService", () => {
  let service: OrdersService;
  let drizzle: DrizzleService;

  const mockDb = {
    query: {
      orders: {
        findMany: jest.fn(),
      },
    },
    insert: jest.fn(),
    update: jest.fn(),
    select: jest.fn(),
    from: jest.fn(),
  };

  const mockDrizzleService = {
    db: mockDb,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: DrizzleService, useValue: mockDrizzleService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    drizzle = module.get<DrizzleService>(DrizzleService);
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("returns paginated orders without filters", async () => {
      const mockOrders = [
        { id: "1", orderNumber: "TH-001", status: "PENDING", items: [], user: null, shippingAddress: null, createdAt: new Date() },
      ];

      mockDb.query.orders.findMany.mockResolvedValue(mockOrders);
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ total: 1 }]),
        }),
      });

      const result = await service.findAll({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it("filters by status when provided", async () => {
      mockDb.query.orders.findMany.mockResolvedValue([]);
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ total: 0 }]),
        }),
      });

      await service.findAll({ status: "SHIPPED" });

      expect(mockDb.query.orders.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(),
        }),
      );
    });

    it("filters by userId when provided", async () => {
      mockDb.query.orders.findMany.mockResolvedValue([]);
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ total: 0 }]),
        }),
      });

      await service.findAll({ userId: "user-1" });

      expect(mockDb.query.orders.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(),
        }),
      );
    });
  });

  describe("findById", () => {
    it("returns order when found", async () => {
      const mockOrder = {
        id: "order-1",
        orderNumber: "TH-001",
        status: "PENDING",
        items: [],
        user: null,
        payment: null,
        shippingAddress: null,
        billingAddress: null,
      };

      mockDb.query.orders.findMany.mockResolvedValue([mockOrder]);

      const result = await service.findById("order-1");

      expect(result.id).toBe("order-1");
    });

    it("throws NotFoundException when order not found", async () => {
      mockDb.query.orders.findMany.mockResolvedValue([]);

      await expect(service.findById("invalid-id")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findByOrderNumber", () => {
    it("returns order by order number", async () => {
      const mockOrder = {
        id: "order-1",
        orderNumber: "TH-001",
        status: "DELIVERED",
        items: [],
        user: null,
        shippingAddress: null,
      };

      mockDb.query.orders.findMany.mockResolvedValue([mockOrder]);

      const result = await service.findByOrderNumber("TH-001");

      expect(result.orderNumber).toBe("TH-001");
    });

    it("throws NotFoundException when order number not found", async () => {
      mockDb.query.orders.findMany.mockResolvedValue([]);

      await expect(service.findByOrderNumber("INVALID")).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("creates order with PENDING status", async () => {
      const dto = {
        contactName: "John Doe",
        contactPhone: "+971 50 123 4567",
        paymentMethod: "card",
        shippingMethod: "standard",
        subtotal: 100,
        shippingCost: 10,
        taxAmount: 5,
        discountAmount: 0,
        total: 115,
        items: [{ name: "Test", sku: "TST", quantity: 1, unitPrice: 100 }],
      };

      const createdOrder = {
        id: "new-order",
        orderNumber: "TH-NEW-001",
        status: "PENDING",
        items: [],
        user: null,
        payment: null,
        shippingAddress: null,
        billingAddress: null,
      };

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdOrder]),
        }),
      });
      mockDb.query.orders.findMany
        .mockResolvedValueOnce([{ total: 0 }]) // for findById->findMany in findById mock
        .mockResolvedValueOnce([createdOrder]);

      mockDb.query.orders.findMany.mockResolvedValue([createdOrder]);

      // For the findById called inside create
      mockDb.query.orders.findMany.mockReset();
      mockDb.query.orders.findMany.mockResolvedValue([createdOrder]);

      const result = await service.create(dto);

      expect(result.status).toBe("PENDING");
    });

    it("generates a unique order number", async () => {
      const dto = {
        contactName: "John",
        contactPhone: "+971",
        paymentMethod: "card",
        shippingMethod: "standard",
        subtotal: 100,
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 100,
        items: [],
      };

      const createdOrder = {
        id: "new-order",
        orderNumber: "TH-UNIQUE-001",
        status: "PENDING",
        items: [],
        user: null,
        payment: null,
        shippingAddress: null,
        billingAddress: null,
      };

      mockDb.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([createdOrder]),
        }),
      });
      mockDb.query.orders.findMany.mockResolvedValue([createdOrder]);

      const result = await service.create(dto);

      expect(result.orderNumber).toBeDefined();
      expect(typeof result.orderNumber).toBe("string");
    });
  });

  describe("updateStatus", () => {
    const baseOrder = {
      id: "order-1",
      orderNumber: "TH-001",
      status: "PENDING",
      items: [],
      user: null,
      payment: null,
      shippingAddress: null,
      billingAddress: null,
    };

    beforeEach(() => {
      mockDb.query.orders.findMany.mockResolvedValue([baseOrder]);
    });

    it("updates status from PENDING to CONFIRMED", async () => {
      const updatedOrder = { ...baseOrder, status: "CONFIRMED" };
      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedOrder]),
          }),
        }),
      });

      const result = await service.updateStatus("order-1", "CONFIRMED");

      expect(result.status).toBe("CONFIRMED");
    });

    it("sets shippedAt when status changes to SHIPPED", async () => {
      const updatedOrder = { ...baseOrder, status: "SHIPPED", shippedAt: new Date() };
      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedOrder]),
          }),
        }),
      });

      const result = await service.updateStatus("order-1", "SHIPPED");

      expect(result.status).toBe("SHIPPED");
    });

    it("sets deliveredAt when status changes to DELIVERED", async () => {
      const updatedOrder = { ...baseOrder, status: "DELIVERED", deliveredAt: new Date() };
      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedOrder]),
          }),
        }),
      });

      const result = await service.updateStatus("order-1", "DELIVERED");

      expect(result.status).toBe("DELIVERED");
    });

    it("cancels the order", async () => {
      const updatedOrder = { ...baseOrder, status: "CANCELLED" };
      mockDb.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([updatedOrder]),
          }),
        }),
      });

      const result = await service.updateStatus("order-1", "CANCELLED");

      expect(result.status).toBe("CANCELLED");
    });

    it("throws NotFoundException when order does not exist", async () => {
      mockDb.query.orders.findMany.mockResolvedValue([]);

      await expect(service.updateStatus("invalid-id", "CONFIRMED")).rejects.toThrow(NotFoundException);
    });
  });
});
