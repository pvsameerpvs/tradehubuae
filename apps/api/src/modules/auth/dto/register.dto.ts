import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
