import { Injectable, Logger } from "@nestjs/common";

interface ContactDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  async submit(dto: ContactDto) {
    this.logger.log(`Contact form submission from ${dto.name} <${dto.email}>: ${dto.subject}`);
    return { success: true };
  }
}
