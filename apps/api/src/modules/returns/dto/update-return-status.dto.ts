import { IsString, IsIn, IsOptional, IsNumber } from "class-validator";

export class UpdateReturnStatusDto {
  @IsString()
  @IsIn(["APPROVED", "REJECTED", "REFUNDED"])
  status!: string;

  @IsNumber()
  @IsOptional()
  refundAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
