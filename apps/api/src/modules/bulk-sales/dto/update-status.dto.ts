import { IsEnum } from "class-validator";

export class UpdateBulkSaleStatusDto {
  @IsEnum(["PENDING", "QUOTED", "APPROVED", "REJECTED"])
  status!: string;
}
