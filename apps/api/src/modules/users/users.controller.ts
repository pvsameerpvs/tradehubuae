import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles("ADMIN", "SUPER_ADMIN")
  @Get()
  async findAll(@Query() query: { page?: number; limit?: number; sort?: string; order?: string; role?: string; q?: string }) {
    return this.usersService.findAll(query);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.usersService.remove(id);
  }
}
