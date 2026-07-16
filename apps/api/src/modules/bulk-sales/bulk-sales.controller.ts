import { Controller, Get, Post, Put, Body, Param, Query } from "@nestjs/common";
import { BulkSalesService } from "./bulk-sales.service";
import { CreateBulkSaleDto } from "./dto/create-bulk-sale.dto";
import { UpdateBulkSaleStatusDto } from "./dto/update-status.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("bulk-sales")
export class BulkSalesController {
  constructor(private readonly bulkSalesService: BulkSalesService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Get()
  async findAll(@Query() query: { page?: number; limit?: number; status?: string }) {
    return this.bulkSalesService.findAll(query);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.bulkSalesService.findById(id);
  }

  @Public()
  @Post()
  async create(@Body() dto: CreateBulkSaleDto) {
    return this.bulkSalesService.create(dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Put(":id/status")
  async updateStatus(@Param("id") id: string, @Body() dto: UpdateBulkSaleStatusDto) {
    return this.bulkSalesService.updateStatus(id, dto);
  }
}
