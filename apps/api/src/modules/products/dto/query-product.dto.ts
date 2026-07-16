import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean, Min } from "class-validator";
import { Type } from "class-transformer";

export class QueryProductDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  use?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(["New", "Like_New", "Excellent", "Good", "Fair"])
  condition?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsEnum(["price_asc", "price_desc", "newest", "popular", "rating"])
  sort?: "price_asc" | "price_desc" | "newest" | "popular" | "rating";

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  order?: "asc" | "desc" = "desc";
}
