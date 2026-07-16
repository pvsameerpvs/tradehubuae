import { Controller, Get, Put, Param, Query, Body, Logger } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { UpdateProfileDto } from "./dto/profile.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("customers")
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly customersService: CustomersService) {}

  @Get("profile")
  async getProfile(@CurrentUser("id") userId: string) {
    return { data: await this.customersService.getProfile(userId) };
  }

  @Put("profile")
  async updateProfile(@CurrentUser("id") userId: string, @Body() dto: UpdateProfileDto) {
    return this.customersService.updateProfile(userId, dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Get()
  async findAll(@Query() query: { page?: number; limit?: number; q?: string }) {
    return this.customersService.findAll(query);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.customersService.findById(id);
  }
}
