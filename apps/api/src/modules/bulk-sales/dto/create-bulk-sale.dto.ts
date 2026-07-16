import { IsString, IsEmail, IsOptional, IsArray, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

class BulkRequestItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetPrice?: number;
}

export class CreateBulkSaleDto {
  @IsString()
  companyName!: string;

  @IsString()
  contactName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  @Type(() => BulkRequestItemDto)
  items?: BulkRequestItemDto[];
}
