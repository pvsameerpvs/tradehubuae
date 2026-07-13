import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { comboOffers, comboOfferItems, products, productImages } from "@tradehubuae/database";
import { eq, and, like, or, count, isNull, asc, desc, sql } from "drizzle-orm";
import type { CreateComboOfferDto } from "./dto/create-combo-offer.dto";
import type { UpdateComboOfferDto } from "./dto/update-combo-offer.dto";
import type { QueryComboOfferDto } from "./dto/query-combo-offer.dto";
import slugify from "slugify";

const comboOfferSortColumns: Record<string, any> = {
  createdAt: comboOffers.createdAt,
  name: comboOffers.name,
  updatedAt: comboOffers.updatedAt,
};

@Injectable()
export class ComboOffersService {
  private readonly logger = new Logger(ComboOffersService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: QueryComboOfferDto) {
    const { page = 1, limit = 20, sort = "createdAt", order = "desc", q, isActive } = query;

    const conditions: (typeof sql.arguments[number] | undefined)[] = [];
    if (q) {
      conditions.push(
        or(
          like(comboOffers.name, `%${q}%`),
          like(comboOffers.description, `%${q}%`),
        ),
      );
    }
    if (isActive !== undefined) conditions.push(eq(comboOffers.isActive, isActive));

    const where = conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined;

    const data = await this.drizzle.db.query.comboOffers.findMany({
      where,
      with: {
        items: {
          with: {
            product: {
              columns: { id: true, name: true, slug: true, price: true, availableStock: true },
              with: { images: { where: eq(productImages.isPrimary, true), limit: 1 } },
            },
          },
        },
      },
      orderBy: order === "desc" ? desc(comboOfferSortColumns[sort] ?? comboOffers.createdAt) : asc(comboOfferSortColumns[sort] ?? comboOffers.createdAt),
      offset: (page - 1) * limit,
      limit,
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(comboOffers)
      .where(where);

    const total = Number(totalResult?.total ?? 0);

    const enriched = data.map((offer) => {
      const allOutOfStock = offer.items.every((item) => (item.product?.availableStock ?? 0) < item.quantity);
      return { ...offer, allOutOfStock, _count: { items: offer.items.length } };
    });

    return {
      data: enriched,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total, hasPreviousPage: page > 1 },
    };
  }

  async findActive() {
    const offers = await this.drizzle.db.query.comboOffers.findMany({
      where: and(
        eq(comboOffers.isActive, true),
        or(
          isNull(comboOffers.expiresAt),
          sql`${comboOffers.expiresAt} >= NOW()`,
        ),
      ),
      with: {
        items: {
          with: {
            product: {
              columns: { id: true, name: true, slug: true, price: true, availableStock: true, compareAtPrice: true },
              with: { images: { where: eq(productImages.isPrimary, true), limit: 1 } },
            },
          },
        },
      },
      orderBy: [desc(comboOffers.createdAt)],
    });

    return offers.filter((offer) =>
      offer.items.every((item) => (item.product?.availableStock ?? 0) >= item.quantity),
    );
  }

  async findById(id: string) {
    const [offer] = await this.drizzle.db.query.comboOffers.findMany({
      where: eq(comboOffers.id, id),
      with: {
        items: {
          with: {
            product: {
              columns: { id: true, name: true, slug: true, price: true, availableStock: true, compareAtPrice: true },
              with: { images: { where: eq(productImages.isPrimary, true), limit: 1 } },
            },
          },
        },
      },
    });

    if (!offer) throw new NotFoundException("Combo offer not found");

    const allOutOfStock = offer.items.every((item) => (item.product?.availableStock ?? 0) < item.quantity);
    return { ...offer, allOutOfStock };
  }

  async create(dto: CreateComboOfferDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });

    const [existing] = await this.drizzle.db
      .select()
      .from(comboOffers)
      .where(eq(comboOffers.slug, slug))
      .limit(1);

    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    const [offer] = await this.drizzle.db
      .insert(comboOffers)
      .values({
        name: dto.name,
        slug: finalSlug,
        description: dto.description,
        discountType: dto.discountType,
        discountValue: dto.discountValue.toString(),
        image: dto.image,
        isActive: dto.isActive ?? true,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      })
      .returning();

    if (dto.items && dto.items.length > 0) {
      await this.drizzle.db.insert(comboOfferItems).values(
        dto.items.map((item) => ({
          offerId: offer!.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      );
    }

    this.logger.log(`Combo offer created: ${offer!.name}`);
    return this.findById(offer!.id);
  }

  async update(id: string, dto: UpdateComboOfferDto) {
    await this.findById(id);

    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.discountType !== undefined) updateData.discountType = dto.discountType;
    if (dto.discountValue !== undefined) updateData.discountValue = dto.discountValue.toString();
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.startsAt !== undefined) updateData.startsAt = new Date(dto.startsAt);
    if (dto.expiresAt !== undefined) updateData.expiresAt = new Date(dto.expiresAt);

    if (dto.name) {
      updateData.slug = slugify(dto.name, { lower: true, strict: true });
    }

    if (dto.items) {
      await this.drizzle.db
        .delete(comboOfferItems)
        .where(eq(comboOfferItems.offerId, id));

      await this.drizzle.db.insert(comboOfferItems).values(
        dto.items.map((item) => ({
          offerId: id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      );
    }

    await this.drizzle.db
      .update(comboOffers)
      .set(updateData)
      .where(eq(comboOffers.id, id));

    this.logger.log(`Combo offer updated: ${id}`);
    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);
    await this.drizzle.db
      .delete(comboOffers)
      .where(eq(comboOffers.id, id));
    this.logger.log(`Combo offer deleted: ${id}`);
  }
}
