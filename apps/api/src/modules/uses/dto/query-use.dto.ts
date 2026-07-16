import { IsOptional, IsString, IsNumber, Min } from "class-validator";

export class QueryUseDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: "asc" | "desc";

  @IsOptional()
  @IsString()
  q?: string;
}
