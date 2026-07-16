import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from "@nestjs/common";
import { AddressesService } from "./addresses.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("addresses")
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findAll(@CurrentUser("id") userId: string) {
    const data = await this.addressesService.findAll(userId);
    return { data };
  }

  @Get(":id")
  async findById(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.addressesService.findById(id, userId);
  }

  @Post()
  async create(@Body() dto: CreateAddressDto, @CurrentUser("id") userId: string) {
    return this.addressesService.create(dto, userId);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateAddressDto, @CurrentUser("id") userId: string) {
    return this.addressesService.update(id, dto, userId);
  }

  @Put(":id/default")
  async setDefault(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.addressesService.setDefault(id, userId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    await this.addressesService.remove(id, userId);
  }
}
