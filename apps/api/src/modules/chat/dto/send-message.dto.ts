import { IsString, IsOptional, IsEnum } from "class-validator";

export class SendMessageDto {
  @IsString()
  content!: string;

  @IsOptional()
  @IsEnum(["text", "image", "file", "system"])
  messageType?: string;

  @IsOptional()
  @IsEnum(["user", "admin"])
  senderType?: string;
}
