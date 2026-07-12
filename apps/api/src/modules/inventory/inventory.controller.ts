import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("inventory")
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "INVENTORY_MANAGER")
  @Get()
  async getAllStock(@Query() query: { warehouseId?: string; lowStock?: boolean }) {
    return this.inventoryService.getAllStock(query);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "INVENTORY_MANAGER")
  @Get("low-stock")
  async getLowStock(@Query("threshold") threshold?: number) {
    return this.inventoryService.getLowStockAlerts(threshold);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "INVENTORY_MANAGER")
  @Get("product/:productId")
  async getProductStock(@Param("productId") productId: string) {
    return this.inventoryService.getStock(productId);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "INVENTORY_MANAGER")
  @Post("adjust/:id")
  async adjustStock(@Param("id") id: string, @Body() body: { quantity: number; type: string; note?: string }) {
    return this.inventoryService.adjustStock(id, body.quantity, body.type, body.note);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Post("transfer")
  async transferStock(@Body() dto: { fromWarehouseId: string; toWarehouseId: string; items: { variantId: string; quantity: number }[] }) {
    return this.inventoryService.transferStock(dto);
  }
}
