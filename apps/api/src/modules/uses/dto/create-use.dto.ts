import { IsString, IsOptional } from "class-validator";

export class CreateUseDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  image?: string;
}
