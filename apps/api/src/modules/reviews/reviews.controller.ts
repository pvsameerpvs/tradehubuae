import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto, UpdateReviewDto, ReviewQueryDto } from "./dto/create-review.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Get()
  async findAll(@Query() query: ReviewQueryDto) {
    return this.reviewsService.findAll(query);
  }

  @Public()
  @Get("product/:productId")
  async findByProduct(@Param("productId") productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.reviewsService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateReviewDto, @CurrentUser("id") userId: string) {
    return this.reviewsService.create(dto, userId);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    return this.reviewsService.remove(id);
  }
}
