import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { QueryProductDto } from "./dto/query-product.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get("search")
  async search(@Query("q") q: string, @Query("limit") limit?: number) {
    return this.productsService.searchFullText(q, limit);
  }

  @Public()
  @Get(":slug")
  async findBySlug(@Param("slug") slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
