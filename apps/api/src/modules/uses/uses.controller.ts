import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { UsesService } from "./uses.service";
import { CreateUseDto } from "./dto/create-use.dto";
import { UpdateUseDto } from "./dto/update-use.dto";
import { QueryUseDto } from "./dto/query-use.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("uses")
export class UsesController {
  constructor(private readonly usesService: UsesService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryUseDto) {
    return this.usesService.findAll(query);
  }

  @Public()
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.usesService.findById(id);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Post()
  async create(@Body() dto: CreateUseDto) {
    return this.usesService.create(dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateUseDto) {
    return this.usesService.update(id, dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    return this.usesService.remove(id);
  }
}
