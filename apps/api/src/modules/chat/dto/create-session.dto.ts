import { IsString, IsEmail, IsOptional, IsObject } from "class-validator";

export class CreateSessionDto {
  @IsString()
  userName!: string;

  @IsEmail()
  userEmail!: string;

  @IsOptional()
  @IsString()
  userPhone?: string;

  @IsOptional()
  @IsObject()
  productContext?: Record<string, unknown>;
}
