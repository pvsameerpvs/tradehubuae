import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { CouponsService } from "./coupons.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { QueryCouponDto } from "./dto/query-coupon.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("coupons")
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Get()
  async findAll(@Query() query: QueryCouponDto) {
    return this.couponsService.findAll(query);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.couponsService.findById(id);
  }

  @Public()
  @Get("validate/:code")
  async validate(@Param("code") code: string, @Query("orderTotal") orderTotal?: string) {
    return this.couponsService.validateCode(code, orderTotal ? Number(orderTotal) : undefined);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Post()
  async create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    return this.couponsService.remove(id);
  }
}
