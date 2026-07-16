import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { Public } from "../../common/decorators/public.decorator";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async submit(@Body() dto: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return this.contactService.submit(dto);
  }
}
