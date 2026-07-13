import { Injectable, UnauthorizedException, ConflictException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DrizzleService } from "../../database/drizzle.service";
import { users } from "@tradehubuae/database";
import { eq } from "drizzle-orm";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private drizzle: DrizzleService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const [existing] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const [user] = await this.drizzle.db
      .insert(users)
      .values({
        email: dto.email,
        name: dto.name,
        password: dto.password,
        phone: dto.phone,
        role: "CUSTOMER",
      })
      .returning();

    if (!user) throw new Error("Failed to create user");
    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  async login(dto: LoginDto) {
    const [user] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.generateToken(user);

    await this.drizzle.db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    return { user: this.sanitizeUser(user), token };
  }

  async validateUser(userId: string) {
    const [user] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.isActive) {
      throw new UnauthorizedException("User not found or inactive");
    }

    return this.sanitizeUser(user);
  }

  private generateToken(user: { id: string; email: string; role: string }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  private sanitizeUser(user: any) {
    const { password, ...rest } = user;
    return rest;
  }
}
