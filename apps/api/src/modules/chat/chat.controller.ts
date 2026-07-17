import { Controller, Get, Post, Patch, Body, Param, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { SendMessageDto } from "./dto/send-message.dto";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Public()
  @Post("sessions")
  async createSession(@Body() dto: CreateSessionDto, @CurrentUser("id") userId?: string) {
    return this.chatService.createSession(dto, userId);
  }

  @Public()
  @Get("sessions")
  async getSessions(@Query() query: { page?: number; limit?: number; status?: string; q?: string }) {
    return this.chatService.getSessions(query);
  }

  @Public()
  @Get("sessions/:id")
  async getSession(@Param("id") id: string) {
    return this.chatService.getSessionById(id);
  }

  @Public()
  @Get("sessions/:id/messages")
  async getMessages(@Param("id") id: string) {
    return this.chatService.getMessages(id);
  }

  @Public()
  @Post("sessions/:id/messages")
  async sendMessage(@Param("id") id: string, @Body() dto: SendMessageDto, @CurrentUser("id") userId?: string) {
    return this.chatService.sendMessage(id, dto, userId);
  }

  @Public()
  @Patch("sessions/:id/assign")
  async assignSession(@Param("id") id: string, @CurrentUser("id") adminId: string) {
    return this.chatService.assignSession(id, adminId);
  }

  @Public()
  @Patch("sessions/:id/close")
  async closeSession(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.chatService.closeSession(id, userId);
  }

  @Public()
  @Patch("sessions/:id/reopen")
  async reopenSession(@Param("id") id: string) {
    return this.chatService.reopenSession(id);
  }

  @Public()
  @Patch("sessions/:id/status")
  async updateSessionStatus(
    @Param("id") id: string,
    @Body() body: { status: "new" | "in_progress" | "closed" },
  ) {
    return this.chatService.updateSessionStatus(id, body.status);
  }

  @Public()
  @Get("users/:id")
  async getUserById(@Param("id") id: string) {
    return this.chatService.getUserById(id);
  }

  @Public()
  @Get("users/:id/orders")
  async getUserOrders(@Param("id") id: string) {
    return this.chatService.getUserOrders(id);
  }
}
