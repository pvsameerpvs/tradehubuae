import { Injectable, UnauthorizedException, ConflictException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../database/prisma.service";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        phone: dto.phone,
        role: "CUSTOMER",
      },
    });

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.generateToken(user);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return { user: this.sanitizeUser(user), token };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
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
