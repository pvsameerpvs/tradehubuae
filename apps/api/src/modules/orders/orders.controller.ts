import { Controller, Get, Post, Put, Body, Param, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Get()
  async findAll(@Query() query: { page?: number; limit?: number; status?: string }) {
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

  @Post()
  async create(@Body() dto: any, @CurrentUser("id") userId?: string) {
    return this.ordersService.create(dto, userId);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Put(":id/status")
  async updateStatus(@Param("id") id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
