import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { users, orders, addresses } from "@tradehubuae/database";
import { eq, like, or, count, and, desc } from "drizzle-orm";
import type { UpdateProfileDto } from "./dto/profile.dto";

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private drizzle: DrizzleService) {}

  async getProfile(userId: string) {
    const [user] = await this.drizzle.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.phone !== undefined) updateData.phone = dto.phone;

    const [user] = await this.drizzle.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        image: users.image,
        role: users.role,
      });

    return user;
  }

  async findAll(query: { page?: number; limit?: number; q?: string }) {
    const { page = 1, limit = 20, q } = query;
    const conditions: any[] = [eq(users.role, "CUSTOMER")];

    if (q) {
      conditions.push(
        or(
          like(users.name, `%${q}%`),
          like(users.email, `%${q}%`),
          like(users.phone, `%${q}%`),
        ),
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.drizzle.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        image: users.image,
        isActive: users.isActive,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .offset((page - 1) * limit)
      .limit(limit);

    const enriched = await Promise.all(
      data.map(async (customer) => {
        const [orderCount] = await this.drizzle.db
          .select({ total: count() })
          .from(orders)
          .where(eq(orders.userId, customer.id));
        return { ...customer, _count: { orders: Number(orderCount?.total ?? 0) } };
      }),
    );

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(users)
      .where(where);

    const total = Number(totalResult?.total ?? 0);

    return {
      data: enriched,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const [customer] = await this.drizzle.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        image: users.image,
        isActive: users.isActive,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(and(eq(users.id, id), eq(users.role, "CUSTOMER")))
      .limit(1);

    if (!customer) throw new NotFoundException("Customer not found");

    const [orderCount] = await this.drizzle.db
      .select({ total: count() })
      .from(orders)
      .where(eq(orders.userId, id));

    const customerOrders = await this.drizzle.db.query.orders.findMany({
      where: eq(orders.userId, id),
      with: { items: true },
      orderBy: [desc(orders.createdAt)],
      limit: 50,
    });

    const customerAddresses = await this.drizzle.db.query.addresses.findMany({
      where: eq(addresses.userId, id),
      orderBy: [desc(addresses.isDefault), desc(addresses.createdAt)],
    });

    return {
      ...customer,
      _count: { orders: Number(orderCount?.total ?? 0) },
      orders: customerOrders,
      addresses: customerAddresses,
    };
  }
}
