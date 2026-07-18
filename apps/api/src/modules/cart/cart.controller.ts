import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { OptionalJwtAuthGuard } from "../../common/guards/optional-jwt.guard";

@UseGuards(OptionalJwtAuthGuard)
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async findCart(@CurrentUser("id") userId: string | null) {
    if (!userId) return { items: [] };
    const items = await this.cartService.findCart(userId);
    return { items };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addItem(
    @CurrentUser("id") userId: string | null,
    @Body() body: { slug: string; quantity: number },
  ) {
    if (!userId) return;
    return this.cartService.addItem(userId, body.slug, body.quantity ?? 1);
  }

  @Put(":slug")
  async updateQuantity(
    @CurrentUser("id") userId: string | null,
    @Param("slug") slug: string,
    @Body() body: { quantity: number },
  ) {
    if (!userId) return;
    return this.cartService.updateQuantity(userId, slug, body.quantity);
  }

  @Delete(":slug")
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(
    @CurrentUser("id") userId: string | null,
    @Param("slug") slug: string,
  ) {
    if (!userId) return;
    await this.cartService.removeItem(userId, slug);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@CurrentUser("id") userId: string | null) {
    if (!userId) return;
    await this.cartService.clearCart(userId);
  }
}
