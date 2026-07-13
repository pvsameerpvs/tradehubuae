import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ComboOffersService } from "./combo-offers.service";
import { CreateComboOfferDto } from "./dto/create-combo-offer.dto";
import { UpdateComboOfferDto } from "./dto/update-combo-offer.dto";
import { QueryComboOfferDto } from "./dto/query-combo-offer.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("combo-offers")
export class ComboOffersController {
  constructor(private readonly comboOffersService: ComboOffersService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryComboOfferDto) {
    return this.comboOffersService.findAll(query);
  }

  @Public()
  @Get("active")
  async findActive() {
    return this.comboOffersService.findActive();
  }

  @Public()
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.comboOffersService.findById(id);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Post()
  async create(@Body() dto: CreateComboOfferDto) {
    return this.comboOffersService.create(dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SALES_MANAGER")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateComboOfferDto) {
    return this.comboOffersService.update(id, dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    return this.comboOffersService.remove(id);
  }
}
