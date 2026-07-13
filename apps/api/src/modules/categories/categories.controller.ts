import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { QueryCategoryDto } from "./dto/query-category.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @Public()
  @Get("tree")
  async getTree() {
    return this.categoriesService.getTree();
  }

  @Public()
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.categoriesService.findById(id);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
