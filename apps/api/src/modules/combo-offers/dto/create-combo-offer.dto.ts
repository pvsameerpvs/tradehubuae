import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, Min, IsArray, ValidateNested, IsUUID } from "class-validator";
import { Type } from "class-transformer";

class ComboOfferItemDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateComboOfferDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(["PERCENTAGE", "FIXED"])
  discountType!: string;

  @IsNumber()
  @Min(0)
  discountValue!: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  startsAt?: string;

  @IsOptional()
  @IsString()
  expiresAt?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComboOfferItemDto)
  items?: ComboOfferItemDto[];
}
