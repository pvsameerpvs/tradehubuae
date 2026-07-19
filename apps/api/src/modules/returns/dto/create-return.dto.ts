import { IsString, IsOptional } from "class-validator";

export class CreateReturnDto {
  @IsString()
  reason!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
