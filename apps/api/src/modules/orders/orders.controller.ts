import { Controller, Get, Post, Put, Body, Param, Query, Logger } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";

@Controller("orders")
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Get()
  async findAll(@Query() query: { page?: number; limit?: number; status?: string; search?: string; startDate?: string; endDate?: string }) {
    return this.ordersService.findAll(query);
  }

  @Get("my-orders")
  async getMyOrders(@CurrentUser("id") userId: string) {
    return this.ordersService.findAll({ userId });
  }

  @Public()
  @Get("track/:orderNumber")
  async trackOrder(@Param("orderNumber") orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.ordersService.findById(id);
  }

  @Public()
  @Post()
  async create(@Body() dto: {
    subtotal: number;
    total: number;
    paymentMethod: string;
    shippingMethod: string;
    contactName: string;
    contactPhone: string;
    shippingCost?: number;
    taxAmount?: number;
    discountAmount?: number;
    couponCode?: string;
    userId?: string;
    notes?: string;
    shippingAddressId?: string;
    shippingAddress?: Record<string, unknown>;
    items?: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      unitPrice: number;
      name: string;
      sku: string;
      image?: string;
    }>;
  }, @CurrentUser("id") userId?: string) {
    this.logger.log(`Create order body: ${JSON.stringify(dto)}`);
    try {
      return await this.ordersService.create(dto, userId);
    } catch (error) {
      this.logger.error(`Create order failed: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Put(":id/status")
  async updateStatus(@Param("id") id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
