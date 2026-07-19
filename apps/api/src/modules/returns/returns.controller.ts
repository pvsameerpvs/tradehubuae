import { Controller, Get, Post, Put, Body, Param, Query } from "@nestjs/common";
import { ReturnsService } from "./returns.service";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateReturnDto } from "./dto/create-return.dto";

@Controller("returns")
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Get()
  async findAll(@Query() query: { page?: number; limit?: number; status?: string; search?: string }) {
    return this.returnsService.findAll(query);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.returnsService.findById(id);
  }

  @Public()
  @Post(":orderId")
  async create(@Param("orderId") orderId: string, @Body() dto: CreateReturnDto, @CurrentUser("id") userId?: string) {
    return this.returnsService.create(orderId, dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Put(":id/status")
  async updateStatus(@Param("id") id: string, @Body() body: { status?: string; refundAmount?: number; notes?: string }) {
    return this.returnsService.updateStatus(id, body);
  }
}
