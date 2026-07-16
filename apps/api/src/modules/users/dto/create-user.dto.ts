import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(["ADMIN", "SUPER_ADMIN", "INVENTORY_MANAGER", "SALES_MANAGER", "CONTENT_MANAGER", "SEO_MANAGER", "CUSTOMER"])
  role?: string;

  @IsOptional()
  isActive?: boolean;
}
