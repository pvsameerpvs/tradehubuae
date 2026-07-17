import { IsString, IsUUID, IsInt, Min, Max, IsOptional, IsBoolean } from "class-validator";

export class CreateReviewDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  pros?: string;

  @IsString()
  @IsOptional()
  cons?: string;
}

export class UpdateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  pros?: string;

  @IsString()
  @IsOptional()
  cons?: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}

export class ReviewQueryDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: "asc" | "desc";

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
