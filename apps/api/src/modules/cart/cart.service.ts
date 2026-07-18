import { Injectable, NotFoundException } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { cartItems, products, productImages } from "@tradehubuae/database";
import { eq, and, isNull } from "drizzle-orm";

@Injectable()
export class CartService {
  constructor(private drizzle: DrizzleService) {}

  async findCart(userId: string) {
    const rows = await this.drizzle.db.query.cartItems.findMany({
      where: eq(cartItems.userId, userId),
      with: {
        product: {
          with: {
            images: { where: eq(productImages.isPrimary, true), limit: 1 },
          },
        },
      },
      orderBy: (cart, { asc }) => [asc(cart.createdAt)],
    });

    return rows.map((row) => ({
      id: row.product.id,
      name: row.product.name,
      slug: row.product.slug,
      price: Number(row.product.price),
      stock: row.product.stock,
      image: row.product.images?.[0]?.url ?? null,
      quantity: row.quantity,
    }));
  }

  async addItem(userId: string, slug: string, quantity: number) {
    const [product] = await this.drizzle.db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!product) throw new NotFoundException("Product not found");

    const existing = await this.drizzle.db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, product.id),
        isNull(cartItems.variantId),
      ),
    });

    if (existing) {
      await this.drizzle.db
        .update(cartItems)
        .set({ quantity: existing.quantity + quantity, updatedAt: new Date() })
        .where(eq(cartItems.id, existing.id));
    } else {
      await this.drizzle.db.insert(cartItems).values({
        userId,
        productId: product.id,
        quantity,
      });
    }

    return { slug, quantity };
  }

  async updateQuantity(userId: string, slug: string, quantity: number) {
    const [product] = await this.drizzle.db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!product) throw new NotFoundException("Product not found");

    const existing = await this.drizzle.db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, product.id),
        isNull(cartItems.variantId),
      ),
    });

    if (!existing) throw new NotFoundException("Cart item not found");

    await this.drizzle.db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, existing.id));

    return { slug, quantity };
  }

  async removeItem(userId: string, slug: string) {
    const [product] = await this.drizzle.db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!product) throw new NotFoundException("Product not found");

    await this.drizzle.db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, product.id),
          isNull(cartItems.variantId),
        ),
      );
  }

  async clearCart(userId: string) {
    await this.drizzle.db
      .delete(cartItems)
      .where(eq(cartItems.userId, userId));
  }
}
