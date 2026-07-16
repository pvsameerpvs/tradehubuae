import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { users } from "@tradehubuae/database";
import { eq, like, or, count, and, desc } from "drizzle-orm";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: { page?: number; limit?: number; sort?: string; order?: string; role?: string; q?: string }) {
    const { page = 1, limit = 50, sort = "createdAt", order = "desc", role, q } = query;
    const conditions: any[] = [];

    if (role) conditions.push(eq(users.role, role as any));
    if (q) {
      conditions.push(
        or(
          like(users.name, `%${q}%`),
          like(users.email, `%${q}%`),
        ),
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.drizzle.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(where)
      .orderBy(order === "desc" ? desc(users.createdAt) : desc(users.createdAt))
      .offset((page - 1) * limit)
      .limit(limit);

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(users)
      .where(where);

    return {
      data,
      meta: {
        total: Number(totalResult?.total ?? 0),
        page,
        limit,
        totalPages: Math.ceil(Number(totalResult?.total ?? 0) / limit),
      },
    };
  }

  async findById(id: string) {
    const [user] = await this.drizzle.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async create(dto: CreateUserDto) {
    const [existing] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);

    if (existing) throw new ConflictException("Email already in use");

    const [user] = await this.drizzle.db
      .insert(users)
      .values({
        name: dto.name,
        email: dto.email,
        password: dto.password,
        phone: dto.phone,
        role: (dto.role ?? "STAFF") as any,
        isActive: true,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      });

    this.logger.log(`User created: ${user!.email} (${user!.role})`);
    return user!;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);

    if (dto.email) {
      const [existing] = await this.drizzle.db
        .select()
        .from(users)
        .where(and(eq(users.email, dto.email), eq(users.id, id)))
        .limit(1);

      if (!existing) {
        const [duplicate] = await this.drizzle.db
          .select()
          .from(users)
          .where(eq(users.email, dto.email))
          .limit(1);
        if (duplicate) throw new ConflictException("Email already in use");
      }
    }

    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.password !== undefined) updateData.password = dto.password;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.role !== undefined) updateData.role = dto.role as any;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const [user] = await this.drizzle.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      });

    this.logger.log(`User updated: ${user!.email}`);
    return user!;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.drizzle.db
      .update(users)
      .set({ isActive: false })
      .where(eq(users.id, id));
    this.logger.log(`User deactivated: ${id}`);
  }
}
