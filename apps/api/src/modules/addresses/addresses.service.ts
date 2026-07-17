import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { addresses } from "@tradehubuae/database";
import { eq, and, count } from "drizzle-orm";
import type { CreateAddressDto } from "./dto/create-address.dto";
import type { UpdateAddressDto } from "./dto/update-address.dto";

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(userId: string) {
    return this.drizzle.db.query.addresses.findMany({
      where: eq(addresses.userId, userId),
      orderBy: (fields, { desc }) => [desc(fields.isDefault), desc(fields.createdAt)],
    });
  }

  async findById(id: string, userId: string) {
    const [address] = await this.drizzle.db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .limit(1);

    if (!address) throw new NotFoundException("Address not found");
    return address;
  }

  async create(dto: CreateAddressDto, userId: string) {
    if (dto.isDefault) {
      await this.drizzle.db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId));
    }

    const [address] = await this.drizzle.db
      .insert(addresses)
      .values({
        userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        emirate: dto.emirate as "Abu Dhabi" | "Dubai" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah",
        country: dto.country ?? "UAE",
        zipCode: dto.zipCode,
        isDefault: dto.isDefault ?? false,
      })
      .returning();

    this.logger.log(`Address created for user ${userId}`);
    return address!;
  }

  async update(id: string, dto: UpdateAddressDto, userId: string) {
    await this.findById(id, userId);

    if (dto.isDefault) {
      await this.drizzle.db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId));
    }

    const updateData: Record<string, any> = {};
    if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
    if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.addressLine1 !== undefined) updateData.addressLine1 = dto.addressLine1;
    if (dto.addressLine2 !== undefined) updateData.addressLine2 = dto.addressLine2;
    if (dto.city !== undefined) updateData.city = dto.city;
    if (dto.emirate !== undefined) updateData.emirate = dto.emirate;
    if (dto.country !== undefined) updateData.country = dto.country;
    if (dto.zipCode !== undefined) updateData.zipCode = dto.zipCode;
    if (dto.isDefault !== undefined) updateData.isDefault = dto.isDefault;

    const [address] = await this.drizzle.db
      .update(addresses)
      .set(updateData)
      .where(eq(addresses.id, id))
      .returning();

    return address!;
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    await this.drizzle.db
      .delete(addresses)
      .where(eq(addresses.id, id));
  }

  async setDefault(id: string, userId: string) {
    await this.findById(id, userId);

    await this.drizzle.db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId));

    const [address] = await this.drizzle.db
      .update(addresses)
      .set({ isDefault: true })
      .where(eq(addresses.id, id))
      .returning();

    return address!;
  }
}
