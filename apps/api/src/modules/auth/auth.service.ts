import { Injectable, UnauthorizedException, ConflictException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DrizzleService } from "../../database/drizzle.service";
import { users } from "@tradehubuae/database";
import { eq } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";
import type { GoogleLoginDto } from "./dto/google-login.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private googleClient: OAuth2Client;

  constructor(
    private drizzle: DrizzleService,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async googleLogin(dto: GoogleLoginDto) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: dto.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) throw new UnauthorizedException("Invalid Google token");

      const [existing] = await this.drizzle.db
        .select()
        .from(users)
        .where(eq(users.email, payload.email))
        .limit(1);

      if (existing) {
        const token = this.generateToken(existing);
        await this.drizzle.db
          .update(users)
          .set({ lastLoginAt: new Date(), image: payload.picture ?? existing.image })
          .where(eq(users.id, existing.id));
        return { user: this.sanitizeUser(existing), token };
      }

      const [user] = await this.drizzle.db
        .insert(users)
        .values({
          email: payload.email,
          name: payload.name ?? payload.email.split("@")[0],
          image: payload.picture,
          role: "CUSTOMER",
        })
        .returning();

      if (!user) throw new Error("Failed to create user");
      const token = this.generateToken(user);
      this.logger.log(`User registered via Google: ${user.email}`);
      return { user: this.sanitizeUser(user), token };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException("Google authentication failed");
    }
  }

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

  private sanitizeUser(user: typeof users.$inferSelect) {
    const { password, ...rest } = user;
    return rest;
  }
}
