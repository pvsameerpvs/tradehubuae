import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { products, productImages, brands, uses, productCategories, categories, productVariants, reviews, productSpecs, skuSequences } from "@tradehubuae/database";
import { eq, and, like, or, sql, asc, desc, count } from "drizzle-orm";
import type { CreateProductDto } from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";
import type { QueryProductDto } from "./dto/query-product.dto";
import slugify from "slugify";
import { generateSKU } from "@tradehubuae/utils";

const productSortColumns: Record<string, any> = {
  createdAt: products.createdAt,
  name: products.name,
  price: products.price,
  viewCount: products.viewCount,
  saleCount: products.saleCount,
  updatedAt: products.updatedAt,
};

const sortQueryToColumn: Record<string, string> = {
  price_asc: "price",
  price_desc: "price",
  newest: "createdAt",
  popular: "saleCount",
  rating: "viewCount",
};

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private drizzle: DrizzleService) {}

  private async generateSequentialSku(
    categoryId?: string,
    brandId?: string,
  ): Promise<string> {
    let catName = "";
    let brName = "";
    if (categoryId) {
      const [cat] = await this.drizzle.db
        .select({ name: categories.name })
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1);
      if (cat) catName = cat.name;
    }
    if (brandId) {
      const [br] = await this.drizzle.db
        .select({ name: brands.name })
        .from(brands)
        .where(eq(brands.id, brandId))
        .limit(1);
      if (br) brName = br.name;
    }
    const prefix = generateSKU(catName, brName, 0).slice(0, -6);
    const [row] = await this.drizzle.db
      .insert(skuSequences)
      .values({ prefix, lastNum: 1 })
      .onConflictDoUpdate({
        target: skuSequences.prefix,
        set: { lastNum: sql`${skuSequences.lastNum} + 1` },
      })
      .returning();
    return generateSKU(catName, brName, row!.lastNum);
  }

  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 20, sort = "createdAt", order = "desc", q, category, brand, use, minPrice, maxPrice, condition, inStock, isActive } = query;

    const conditions: (typeof sql.arguments[number] | undefined)[] = [];

    if (isActive !== undefined) {
      conditions.push(eq(products.isActive, isActive));
    }

    if (q) {
      conditions.push(
        or(
          like(products.name, `%${q}%`),
          like(products.sku, `%${q}%`),
          like(products.description, `%${q}%`),
          like(products.shortDescription, `%${q}%`),
        ),
      );
    }

    if (brand) {
      conditions.push(sql`EXISTS (SELECT 1 FROM ${brands} WHERE ${brands.slug} = ${brand} AND ${brands.id} = ${products.brandId})`);
    }

    if (use) {
      conditions.push(sql`EXISTS (SELECT 1 FROM ${uses} WHERE ${uses.slug} = ${use} AND ${uses.id} = ${products.useId})`);
    }

    if (category) {
      conditions.push(
        sql`EXISTS (SELECT 1 FROM ${productCategories} pc JOIN ${categories} c ON c.id = pc.category_id WHERE pc.product_id = ${products.id} AND c.slug = ${category})`,
      );
    }

    if (minPrice !== undefined) conditions.push(sql`${products.price} >= ${minPrice}`);
    if (maxPrice !== undefined) conditions.push(sql`${products.price} <= ${maxPrice}`);
    if (condition) conditions.push(eq(products.condition, condition as "New" | "Like New" | "Excellent" | "Good" | "Fair"));


    const where = and(...conditions.filter(Boolean));

    const data = await this.drizzle.db.query.products.findMany({
      where,
      with: {
        images: { where: eq(productImages.isPrimary, true), limit: 1 },
        brand: true,
        categories: { with: { category: true } },
      },
      orderBy: order === "desc" ? desc(productSortColumns[sortQueryToColumn[sort] ?? sort] ?? products.createdAt) : asc(productSortColumns[sortQueryToColumn[sort] ?? sort] ?? products.createdAt),
      offset: (page - 1) * limit,
      limit,
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(products)
      .where(where);

    const total = Number(totalResult?.total ?? 0);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findBySlug(slug: string) {
    const [product] = await this.drizzle.db.query.products.findMany({
      where: and(eq(products.slug, slug), eq(products.isActive, true)),
      with: {
        images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
        brand: true,
        categories: { with: { category: true } },
        specs: { orderBy: (specs, { asc }) => [asc(specs.sortOrder)] },
        variants: { where: eq(productVariants.isActive, true) },
        reviews: {
          where: eq(reviews.isApproved, true),
          with: { user: { columns: { name: true, image: true } } },
          orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
          limit: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await this.drizzle.db
      .update(products)
      .set({ viewCount: sql`${products.viewCount} + 1` })
      .where(eq(products.id, product.id));

    return product;
  }

  async findById(id: string) {
    const [product] = await this.drizzle.db.query.products.findMany({
      where: eq(products.id, id),
      with: {
        images: true,
        brand: true,
        categories: true,
        specs: true,
        variants: true,
      },
    });

    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async create(dto: CreateProductDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });
    const [existingSlug] = await this.drizzle.db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    const finalSlug = existingSlug
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    const sku =
      dto.sku ??
      (await this.generateSequentialSku(dto.categoryId, dto.brandId));

    const [product] = await this.drizzle.db
      .insert(products)
      .values({
        name: dto.name,
        slug: finalSlug,
        description: dto.description,
        shortDescription: dto.shortDescription,
        sku,
        barcode: dto.barcode ?? sku,
        condition: dto.condition as "New" | "Like New" | "Excellent" | "Good" | "Fair",
        price: dto.price.toString(),
        compareAtPrice: dto.compareAtPrice?.toString(),
        costPrice: dto.costPrice?.toString(),
        brandId: dto.brandId,
        useId: dto.useId,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        stock: dto.stock ?? 0,
      })
      .returning();

    if (dto.categoryId) {
      await this.drizzle.db
        .insert(productCategories)
        .values({ productId: product!.id, categoryId: dto.categoryId, isPrimary: true });
    }

    if (dto.specs?.length) {
      await this.drizzle.db.insert(productSpecs).values(
        dto.specs.map((s, i) => ({
          productId: product!.id,
          label: s.label,
          value: s.value,
          sortOrder: i,
        })),
      );
    }

    if (dto.images?.length) {
      await this.drizzle.db.insert(productImages).values(
        dto.images.map((url, i) => ({
          productId: product!.id,
          url,
          isPrimary: i === 0,
          sortOrder: i,
        })),
      );
    }

    const result = await this.findById(product!.id);

    this.logger.log(`Product created: ${result.name} (${result.sku})`);
    return result;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.findById(id);

    const updateData: Record<string, any> = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.shortDescription !== undefined) updateData.shortDescription = dto.shortDescription;
    if (dto.sku !== undefined) updateData.sku = dto.sku;
    if (dto.barcode !== undefined) updateData.barcode = dto.barcode;
    if (dto.condition !== undefined) updateData.condition = dto.condition;
    if (dto.price !== undefined) updateData.price = dto.price.toString();
    if (dto.compareAtPrice !== undefined) updateData.compareAtPrice = dto.compareAtPrice?.toString();
    if (dto.costPrice !== undefined) updateData.costPrice = dto.costPrice?.toString();
    if (dto.brandId !== undefined) updateData.brandId = dto.brandId;
    if (dto.useId !== undefined) updateData.useId = dto.useId;
    if (dto.categoryId !== undefined) {
      await this.drizzle.db
        .delete(productCategories)
        .where(eq(productCategories.productId, id));
      await this.drizzle.db
        .insert(productCategories)
        .values({ productId: id, categoryId: dto.categoryId, isPrimary: true });
    }
    if (dto.specs !== undefined) {
      await this.drizzle.db
        .delete(productSpecs)
        .where(eq(productSpecs.productId, id));
      if (dto.specs.length) {
        await this.drizzle.db.insert(productSpecs).values(
          dto.specs.map((s, i) => ({
            productId: id,
            label: s.label,
            value: s.value,
            sortOrder: i,
          })),
        );
      }
    }
    if (dto.images !== undefined) {
      await this.drizzle.db
        .delete(productImages)
        .where(eq(productImages.productId, id));
      if (dto.images.length) {
        await this.drizzle.db.insert(productImages).values(
          dto.images.map((url, i) => ({
            productId: id,
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        );
      }
    }
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.isFeatured !== undefined) updateData.isFeatured = dto.isFeatured;
    if (dto.stock !== undefined) updateData.stock = dto.stock;


    if ("name" in dto && dto.name && dto.name !== existing.name) {
      updateData.slug = slugify(dto.name, { lower: true, strict: true });
    }

    await this.drizzle.db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id));

    const result = await this.findById(id);

    this.logger.log(`Product updated: ${result.name}`);
    return result;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.drizzle.db
      .delete(products)
      .where(eq(products.id, id));
    this.logger.log(`Product deleted: ${id}`);
  }

  async searchFullText(query: string, limit: number = 20) {
    const data = await this.drizzle.db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        or(
          like(products.name, `%${query}%`),
          like(products.description, `%${query}%`),
          like(products.sku, `%${query}%`),
        ),
      ),
      with: {
        images: { where: eq(productImages.isPrimary, true), limit: 1 },
        brand: true,
      },
      orderBy: desc(products.viewCount),
      limit,
    });
    return { data };
  }
}
