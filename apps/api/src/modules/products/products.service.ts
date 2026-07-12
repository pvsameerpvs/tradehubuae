import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import type { CreateProductDto } from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";
import type { QueryProductDto } from "./dto/query-product.dto";
import slugify from "slugify";
import { generateSKU } from "@tradehubuae/utils";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 20, sort = "createdAt", order = "desc", q, category, brand, minPrice, maxPrice, condition, inStock } = query;

    const where: any = { isActive: true };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.categories = { some: { category: { slug: category } } };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (condition) {
      where.condition = condition;
    }

    if (inStock) {
      where.availableStock = { gt: 0 };
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          brand: true,
          categories: { include: { category: true } },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

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
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        brand: true,
        categories: { include: { category: true } },
        specs: { orderBy: { sortOrder: "asc" } },
        variants: { where: { isActive: true } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    await this.prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
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
    const existingSlug = await this.prisma.product.findUnique({ where: { slug } });

    const finalSlug = existingSlug
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    const sku = dto.sku ?? generateSKU(dto.categoryId ?? "", dto.brandId ?? "", Date.now());

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug: finalSlug,
        description: dto.description,
        shortDescription: dto.shortDescription,
        sku,
        condition: dto.condition as any,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        costPrice: dto.costPrice,
        brandId: dto.brandId,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        metaKeywords: dto.metaKeywords,
        categories: dto.categoryId
          ? { create: { categoryId: dto.categoryId, isPrimary: true } }
          : undefined,
      },
      include: {
        images: true,
        brand: true,
        categories: { include: { category: true } },
      },
    });

    this.logger.log(`Product created: ${product.name} (${product.sku})`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.findById(id);

    const data: any = { ...dto };

    if ("name" in dto && dto.name && dto.name !== existing.name) {
      data.slug = slugify(dto.name, { lower: true, strict: true });
    }

    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: {
        images: true,
        brand: true,
        categories: { include: { category: true } },
        specs: true,
      },
    });

    this.logger.log(`Product updated: ${product.name}`);
    return product;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    this.logger.log(`Product soft-deleted: ${id}`);
  }

  async searchFullText(query: string, limit: number = 20) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { search: query } },
          { description: { search: query } },
          { sku: { search: query } },
        ],
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        brand: true,
      },
      orderBy: { viewCount: "desc" },
      take: limit,
    });
  }
}
